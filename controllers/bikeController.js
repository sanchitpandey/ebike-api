const Bike = require("../models/Bike");

const updateBikeStatus = async (req, res) => {
  const { bikeId } = req.params;
  const { status } = req.body;

  const bike = await Bike.findByIdAndUpdate(bikeId, { status }, { new: true });

  if (!bike) return res.status(404).json({ message: "Bike not found" });

  res.json(bike);
};

module.exports = { updateBikeStatus };
