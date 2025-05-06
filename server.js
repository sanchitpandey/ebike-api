// server.js
const express = require("express");

const app = express();
const PORT = 7900;

app.listen(PORT, () => {
  console.log(`Basic server running on http://localhost:${PORT}`);
});
