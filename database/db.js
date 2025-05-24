
import mongoose from "mongoose";

const dbconnection = () => {
    const mongoUrl = process.env.MONGO_URL;

    if (!mongoUrl) {
        console.log("MONGO_URL is not defined");
        return;
    }

    mongoose.connect(mongoUrl, {
        dbName: "PORTFOLIO",
    })
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error.message);
    });
};

export default dbconnection;
