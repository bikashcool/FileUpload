const File = require("../models/File");
const cloudinary = require("cloudinary").v2;

// localFileUpload -> Handler function
exports.localFileUpload = async (req, res) => {
    try{
        // fetch file from request
        const file = req.files.file;
        console.log("File recieved -> ", file);

        // create path where file need to be stored on server
        let path = __dirname + "/files/" + Date.now() + `.${file.name.split(".")[1]}`;
        console.log("Path -> ", path);

        // add path to the move function
        file.mv(path, (err) => {
            console.log(err);
        });


        // create a successfull response
        res.json({
            success: true,
            message: "Local file Uploaded Successfully",
        });
    }catch(error){
        console.log("Not able to upload the file on server");
        console.log(error);
    }
};

function isFileTypeSupported(type, supportedTypes){
    return supportedTypes.includes(type);
}

function isLargeFile(fileSize){
    // converting bytes into megabytes
    const mbSize = fileSize /(1024 * 1024);
    console.log("fileSize is ->> ", mbSize);
    return mbSize > 5;
}

async function uploadFileToCloudinary(file, folder, quality){
    const options = {
        folder: folder,
        resource_type: "auto",

        public_id: file.name,
        use_filename: true,
        unique_filename: false
    };

    console.log("temp file path", file.tempFilePath);
    options.resource_type = "auto";
    if(quality){
        options.quality = quality;
    }
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

exports.imageUpload = async (req, res) => {
    try{
        const {name, tags, email} = req.body;
        console.log(name, tags, email);

        const file = req.files.imageFile;
        console.log(file);


        // validation
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split(".")[1].toLowerCase();
        console.log("File Type: ", fileType);


        if(!isFileTypeSupported(fileType, supportedTypes)){
            return res.status(400).json({
                success: false,
                message: "File format not supported",
            });
        }

        // file format is supported
        console.log("Uploading to Cloudinary");
        const response = await uploadFileToCloudinary(file, "TestFolder");
        console.log(response);

        const fileData = await File.create({
            name,
            tags,
            email, 
            imageUrl: response.secure_url,
        });

        res.json({
            success: true,
            imageUrl: response.secure_url,
            message: "Image Successfully Uploaded",
        });
    }catch(error){
        console.error(error);
        res.status(400).json({
            success: false,
            message: "Something went Wrong",
        });
    }
};

exports.videoUpload = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.files);

    const { name, tags, email } = req.body;

    if (!req.files || !req.files.videoFile) {
      return res.status(400).json({
        success: false,
        message: "No video file uploaded",
      });
    }

    const file = req.files.videoFile;

    // Validate file type
    const supportedTypes = ["mp4", "mov"];
    const fileType = file.name.split(".")[1].toLowerCase();
    console.log("File Name:", file.name);
    console.log("File Type:", fileType);

    if (!isFileTypeSupported(fileType, supportedTypes)) {
      return res.status(400).json({
        success: false,
        message: "File format not supported",
      });
    }

    // Validate file size
    const fileSize = file.size;
    console.log("File Size (bytes):", fileSize);
    if (isLargeFile(fileSize)) {
      return res.status(400).json({
        success: false,
        message: "File must be less than 5MB",
      });
    }

    // Upload to Cloudinary
    console.log("Uploading to Cloudinary...");
    const response = await uploadFileToCloudinary(file, "TestFolder");
    console.log("Cloudinary Response:", response);

    const fileData = await File.create({
      name,
      tags,
      email,
      url: response.secure_url,
    });

    res.json({
      success: true,
      imageUrl: response.secure_url,
      message: "Video Successfully Uploaded",
    });
  } catch (error) {
    console.error("Error in videoUpload:", error);
    res.status(400).json({
      success: false,
      message: error.message || "Something went Wrong",
    });
  }
};

// image Reducer Handler
exports.imageSizeReducer = async(req, res) => {
    try{
        const {name, tags, email} = req.body;
        console.log(name, tags, email);

        const file = req.files.imageFile;
        console.log(file);

        // validation
        const supportedTypes = ["jpg", "jpeg", "png"];
        const fileType = file.name.split(".")[1].toLowerCase();
        console.log("File Type: ", fileType);

        if(!isFileTypeSupported(fileType, supportedTypes)){
            return res.status(400).json({
                success: false,
                message: "File Format not support",
            });
        }

        // add a upper limit  of 5MB for image
        const fileSize = file.size;
        if(isLargeFile(fileSize)){
            return res.status(400).json({
                success: false,
                message: "File must be less than 5MB",
            });
        }

        console.log("Uploading to Cloudinary");
        const response = await uploadFileToCloudinary(file, "TestFolder", 60);
        console.log(response);

        const fileData = await File.create({
            name, 
            tags, 
            email,
            url: response.secure_url,
        });

        res.json({
            success: true,
            imageurl: response.secure_url,
            message: "Image successfully Uploaded",
        });
    }catch(error){
        console.error(error);
        res.status(400).json({
            success: false,
            message: "Something went wrong",
        });
    }
};