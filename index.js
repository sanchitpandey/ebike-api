const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");
const authRoutes = require("./routes/auth.js");
const stationRoutes = require("./routes/stations.js");
const journeyRoutes = require("./routes/journeys.js");
const bikeRoutes = require("./routes/bikes.js");
const errorHandler = require("./middleware/error.js");

const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Connect DB
connectDB();

//Routes
app.use("/api/auth", authRoutes);
app.use("/api/stations", stationRoutes);
app.use("/api/journeys", journeyRoutes);
app.use("/api/bikes", bikeRoutes);
app.use(errorHandler);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
