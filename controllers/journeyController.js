const Bike = require("../models/Bike.js");
const Journey = require("../models/Journey.js");
const Station = require("../models/Station.js");
const User = require("../models/User.js");

const startJourney = async (req, res) => {
  try {
    const { bikeQr, stationId } = req.body;
    const userId = req.user.id;

    // 1. Check bike availability
    const bike = await Bike.findOne({ qrCode: bikeQr });
    // console.log("QR received:", bikeQr);
    // console.log("Bike found:", bike);

    if (!bike) return res.status(404).json({ message: "Bike not found" });
    if (bike.status !== "available") {
      return res.status(400).json({ message: "Bike is already in use" });
    }
    const activeJourney = await Journey.findOne({
      bikeId: bikeQr,
      endTime: { $exists: false },
    });

    if (activeJourney) {
      return res.status(400).json({ error: "Bike already in use" });
    }

    // 2. Verify station exists
    const station = await Station.findById(stationId);
    if (!station) return res.status(404).json({ message: "Station not found" });

    // 3. Create new journey
    const newJourney = await Journey.create({
      user: userId,
      bike: bike._id,
      startStation: stationId,
      startTime: new Date(),
    });

    // 4. Update bike status
    bike.status = "in_use";
    bike.currentStation = undefined;
    await bike.save();

    // 5. Remove bike from starting station
    await Station.findByIdAndUpdate(stationId, {
      $pull: { availableBikes: bike._id },
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
    var { bikeId, stationId } = req.body;
    const userId = req.user.id;
    stationId = stationId.substring(8);
    console.log(stationId);
    // 1. Validate inputs
    if (!bikeId || !stationId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 2. Find active journey
    const journey = await Journey.findOne({
      user: userId,
      endTime: { $exists: false },
    });

    if (!journey) {
      return res.status(404).json({ message: "No active journey found" });
    }

    // 3. Calculate duration and cost
    const endTime = new Date();
    const durationMinutes = Math.floor((endTime - journey.startTime) / 60000);
    const cost = durationMinutes * 0.1; // $0.10 per minute

    // 4. Update journey
    journey.endTime = endTime;
    journey.endStation = stationId;
    journey.cost = cost;
    await journey.save();

    console.log(journey);

    // 5. Update bike status
    const bike = await Bike.findById(journey.bike);
    bike.status = "available";
    bike.currentStation = stationId;
    await bike.save();

    // 6. Update station
    await Station.findByIdAndUpdate(stationId, {
      $addToSet: { availableBikes: bike._id },
    });

    // 7. Clear user's current journey
    await User.findByIdAndUpdate(userId, { currentJourney: null });

    res.status(200).json({
      message: "Journey ended successfully",
      cost: cost.toFixed(2),
      duration: durationMinutes,
    });
  } catch (err) {
    console.error("Error ending journey:", err);
    res.status(500).json({
      message: "Error ending journey",
      error: err.message,
    });
  }
};

module.exports = { startJourney, endJourney };
