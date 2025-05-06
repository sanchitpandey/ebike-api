const mongoose = require("mongoose");

const bikeSchema = new mongoose.Schema({
  qrCode: {
    type: String,
    unique: true,
    required: [true, "QR code is required"],
    index: true,
  },
  currentStation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Station",
    index: true,
  },
  status: {
    type: String,
    enum: ["available", "in_use"],
    default: "available",
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

bikeSchema.index({ status: 1, currentStation: 1 });

module.exports = mongoose.model("Bike", bikeSchema);
