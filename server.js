import express from "express"
import cors from "cors"
import { Connectdb } from "./config/db.js"
import  router from "./routes/allproductroutes.js"
import dotenv from 'dotenv'
import { startConsumer } from "./kafkaConsumer.js"
const app = express()
dotenv.config()
app.use(express.json())
app.use(cors())
Connectdb()
app.use('/',router)
startConsumer();
const PORT = 5000
app.listen(PORT,()=>console.log(`PORT is running on ${PORT}`))