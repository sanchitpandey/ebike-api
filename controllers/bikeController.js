const Bike = require("../models/Bike");
const Station = require("../models/Station");

const updateBikeStatus = async (req, res) => {
  const { bikeId } = req.params;
  const { status } = req.body;

  const bike = await Bike.findOneAndUpdate(
    { bikeId },
    { status },
    { new: true }
  );
  //const bike = await Bike.findByIdAndUpdate(bikeId, { status }, { new: true });

  if (!bike) return res.status(404).json({ message: "Bike not found" });

  res.status(200).json({ message: "Bike status updated successfully.", bike });
};

const getBikeStatus = async (req, res) => {
  const { bikeId } = req.params;

  const bike = await Bike.findOne({ qrCode: bikeId });
  if (!bike) return res.status(404).json({ message: "Bike not found" });
  res.status(200).json({ bike });
};

const createBike = async (req, res) => {
  try {
    const { qrCode, currentStation, status } = req.body;

    if (!qrCode) {
      return res.status(400).json({ message: "QR code is required" });
    }

    const newBike = await Bike.create({
      qrCode,
      currentStation,
      status: status || "available",
    });

    // If station is provided, add to station's available bikes
    if (currentStation) {
      await Station.findByIdAndUpdate(currentStation, {
        $addToSet: { availableBikes: newBike._id },
      });
    }

    res.status(201).json(newBike);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "QR code must be unique" });
    }
    res
      .status(500)
      .json({ message: "Error creating bike", error: err.message });
  }
};

const deleteBike = async (req, res) => {
  try {
    const { bikeId } = req.params;

    // Find bike first to get its station
    const bike = await Bike.findById(bikeId);
    if (!bike) {
      return res.status(404).json({ message: "Bike not found" });
    }

    // Remove from station's available bikes
    if (bike.currentStation) {
      await Station.findByIdAndUpdate(bike.currentStation, {
        $pull: { availableBikes: bikeId },
      });
    }

    await Bike.findByIdAndDelete(bikeId);
    res.json({ message: "Bike deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting bike", error: err.message });
  }
};

// Add to exports
module.exports = { updateBikeStatus, createBike, deleteBike, getBikeStatus };
