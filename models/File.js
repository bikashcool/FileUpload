const mongoose = require("mongoose");
// const nodemailer = require("../config/nodemailer");

const fileSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: true,
    },
    url: {
        type: String,
    },
    tags: {
        type: String,
    },
    email: {
        type: String,
    }
});

// post middleware
fileSchema.post("save", async function (doc){
    try{
        console.log("DOC", doc);

        const transporter = nodemailer.connect();

        let info = await transporter.sendMail({
            from: `bikashcool481@gmail.com`,
            to: doc.email,
            subject: "New file Uploaded in Cloudinary",
            html: `<h2>Hey ${doc.name}</h2>
                   <p>File has been successfully uploaded</p>
                   <p>View Here: <a href="${doc.url}">${doc.url}</a></p> 
            `,
        });

        console.log("Info of mail", info);
    }catch(error){
        console.error(error);
    }
})

const File = mongoose.model("File", fileSchema);
module.exports = File;