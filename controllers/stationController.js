const Station = require("../models/Station");

const getNearbyStations = async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 5000, unit = "m" } = req.query;

    // Validate and parse inputs
    const lon = parseFloat(longitude);
    const lat = parseFloat(latitude);
    const maxDist = parseInt(maxDistance);

    const aggregationPipeline = [
      {
        $geoNear: {
          near: { type: "Point", coordinates: [lon, lat] },
          distanceField: "distance",
          maxDistance: maxDist,
          spherical: true, // Required for 2dsphere index
          query: {}, // Add any additional filters here
        },
      },
      {
        $lookup: {
          from: "bikes", // Collection name (pluralized form of 'Bike' model)
          localField: "availableBikes",
          foreignField: "_id",
          as: "availableBikes",
        },
      },
      {
        $addFields: {
          distance: {
            $cond: [
              { $eq: [unit, "km"] },
              { $divide: ["$distance", 1000] }, // Convert meters to km
              "$distance", // Keep in meters
            ],
          },
          distanceUnit: unit,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          location: 1,
          capacity: 1,
          availableBikes: 1,
          distance: 1,
          distanceUnit: 1,
          lastUpdated: 1,
        },
      },
    ];

    const stations = await Station.aggregate(aggregationPipeline);

    res.json(stations);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};

const createStation = async (req, res) => {
  try {
    const { name, latitude, longitude, capacity } = req.body;

    // Create GeoJSON Point (longitude first!)
    const location = {
      type: "Point",
      coordinates: [parseFloat(longitude), parseFloat(latitude)],
    };

    // Create new station with empty availableBikes array
    const station = new Station({
      name: name.trim(),
      location,
      capacity,
      availableBikes: [], // Explicitly initialize as empty array
    });

    await station.save();

    res.status(201).json(station);
  } catch (err) {
    console.error(err.message);

    // Handle specific error types
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    if (err.code === 11000) {
      // Duplicate station name
      return res.status(400).json({ error: "Station name already exists" });
    }
    if (err.message === "Available bikes exceed station capacity") {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getNearbyStations, createStation };
