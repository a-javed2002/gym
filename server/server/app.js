import express from 'express'
import connectDB from "./connection.js";
import c from "./routes/route.js";
import cors from 'cors'
import dotenv from 'dotenv';
const port = process.env.PORT || '8000'
const DATABASE_URL = process.env.DATABASE_URL
 || "mongodb+srv://huzaifa:123@cluster0.l8u3soa.mongodb.net/Fitness";


 dotenv.config();
const app = express()
app.use(cors())
connectDB(DATABASE_URL);
app.use(express.json())
app.use("/api", c)
app.use("/",express.static("Images/Products"))
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
 })