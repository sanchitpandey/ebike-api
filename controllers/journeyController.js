const Bike = require("../models/Bike.js");
const Journey = require("../models/Journey.js");
const Station = require("../models/Station.js");
const User = require("../models/User.js");

const startJourney = async (req, res) => {
  try {
    const { bikeId, stationId } = req.body;
    const userId = req.user.id;

    // 1. Check bike availability
    const bike = await Bike.findById(bikeId);
    if (!bike) return res.status(404).json({ message: "Bike not found" });
    if (bike.status !== "available") {
      return res.status(400).json({ message: "Bike is already in use" });
    }

    // 2. Verify station exists
    const station = await Station.findById(stationId);
    if (!station) return res.status(404).json({ message: "Station not found" });

    // 3. Create new journey
    const newJourney = await Journey.create({
      user: userId,
      bike: bikeId,
      startStation: stationId,
      startTime: new Date(),
    });

    // 4. Update bike status
    bike.status = "in_use";
    bike.currentStation = undefined; // Remove from station
    await bike.save();

    // 5. Remove bike from starting station
    await Station.findByIdAndUpdate(stationId, {
      $pull: { availableBikes: bikeId },
    });

    // 6. Update user's current journey
    await User.findByIdAndUpdate(userId, {
      currentJourney: newJourney._id,
    });

    res.status(201).json({
      message: "Journey started successfully",
      journey: newJourney,
    });
  } catch (err) {
    console.error("Error starting journey:", err);
    res.status(500).json({
      message: "Error starting journey",
      error: err.message,
    });
  }
};

const endJourney = async (req, res) => {
  try {
    const { bikeId, stationId } = req.body;
    const userId = req.user.id;

    // 1. Find active journey
    const journey = await Journey.findOne({
      user: userId,
      bike: bikeId,
      endTime: { $exists: false },
    });

    if (!journey) return res.status(400).json({ message: "No active journey" });

    // 2. Calculate cost
    const endTime = new Date();
    const duration = (endTime - journey.startTime) / (1000 * 60); // minutes
    const cost = duration * 0.1; // $0.10 per minute

    // 3. Update journey
    journey.endTime = endTime;
    journey.endStation = stationId;
    journey.cost = cost;
    await journey.save();

    // 4. Update bike
    const bike = await Bike.findById(bikeId);
    bike.status = "available";
    bike.currentStation = stationId;
    await bike.save();

    // 5. Add bike back to station
    await Station.findByIdAndUpdate(stationId, {
      $push: { availableBikes: bikeId },
    });

    res.json(journey);
  } catch (err) {
    res.status(500).json({ message: "Error ending journey" });
  }
};

module.exports = { startJourney, endJourney };
