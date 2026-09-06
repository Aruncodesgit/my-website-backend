const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connection succeeded.");
    })
    .catch((err) => {
        console.log(
            "Error in MongoDB connection: " +
            JSON.stringify(err, undefined, 2)
        );
        console.log("MONGO URI exists:", !!process.env.MONGODB_URI);
console.log(
  "MONGO HOST:",
  process.env.MONGODB_URI?.split("@")[1]
);
    });