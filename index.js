import express from "express";
const app = express();
import dotenv from "dotenv";
import mongoose from "mongoose";
import todoroute  from "../backend/routes/todoroute.js";
import userRoute from "../backend/routes/userroute.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

// app.get("/", (req, res) => {
//   res.send("hello world !!");
// });

//Database connection method
const DB_URI = process.env.MONGODB_URI;
try {
  mongoose.connect(DB_URI);
  console.log("database connected");
} catch (error) {
  console.log(error);
}

//routes
app.use(express.json());
app.use("/todo",todoroute);
app.use("/user",userRoute)

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});


