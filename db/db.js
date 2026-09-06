// const mongoose = require("mongoose");

// mongoose.connect(process.env.MONGODB_URI)
//     .then(() => {
//         console.log("MongoDB connection succeeded.");
//     })
//     .catch((err) => {
//         console.log(
//             "Error in MongoDB connection: " +
//             JSON.stringify(err, undefined, 2)
//         );
//         console.log("MONGO URI exists:", !!process.env.MONGODB_URI);
// console.log(
//   "MONGO HOST:",
//   process.env.MONGODB_URI?.split("@")[1]
// );
//     });



    const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        return;
    }

    if (!process.env.MONGODB_URI) {
        throw new Error("MONGODB_URI is not defined");
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        isConnected = true;
        console.log("MongoDB connected");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
};

module.exports = connectDB;
