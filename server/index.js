const express = require("express");
const app = express();

const port = process.env.PORT || 3000; // Use port 3000 or the environment PORT variable provided by Replit

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
