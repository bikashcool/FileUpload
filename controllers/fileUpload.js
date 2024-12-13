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