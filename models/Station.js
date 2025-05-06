const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Station name is required"],
    trim: true,
  },
  location: {
    type: {
      type: String,
      default: "Point",
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function (coords) {
          return (
            coords.length === 2 &&
            coords[0] >= -180 &&
            coords[0] <= 180 &&
            coords[1] >= -90 &&
            coords[1] <= 90
          );
        },
        message: "Invalid coordinates format [longitude, latitude]",
      },
    },
  },
  availableBikes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bike",
    },
  ],
  capacity: {
    type: Number,
    required: [true, "Capacity is required"],
    min: [1, "Capacity must be at least 1"],
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

stationSchema.index({ location: "2dsphere" });

stationSchema.pre("save", function (next) {
  if (this.availableBikes.length > this.capacity) {
    next(new Error("Available bikes exceed station capacity"));
  } else {
    next();
  }
});

module.exports = mongoose.model("Station", stationSchema);
