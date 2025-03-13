const mongoose = require("mongoose");

const journeySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      index: true,
    },
    bike: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bike",
      required: [true, "Bike reference is required"],
      index: true,
    },
    startStation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
      required: [true, "Start station is required"],
    },
    endStation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Station",
    },
    startTime: {
      type: Date,
      required: [true, "Start time is required"],
      default: Date.now,
    },
    endTime: Date,
    cost: {
      type: Number,
      min: [0, "Cost cannot be negative"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

journeySchema.virtual("duration").get(function () {
  if (!this.endTime) return null;
  return (this.endTime - this.startTime) / (1000 * 60);
});

journeySchema.index({ user: 1, endTime: 1 });
journeySchema.index({ bike: 1, startTime: -1 });

module.exports = mongoose.model("Journey", journeySchema);
