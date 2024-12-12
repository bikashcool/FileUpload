// app creation
const express = require("express");
const cors = require("cors");
const app = express();

// access env variables
require("dotenv").config();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(cors());


const fileUpload = require("express-fileupload");
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
}));

// DB Connection
const db = require("./config/database");
db.connect();

// connecting to cloudinary
const cloudinary = require("./config/cloudinary");
cloudinary.cloudinaryConnect();

// Routes
const Upload = require("./routes/FileUpload");
app.use("/api/v1/upload", Upload);

// Activating App
app.listen(PORT, () => {
    console.log(`App is running at PORT ${PORT}`);
})