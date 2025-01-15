const mongoose = require("mongoose");

// Define File schema for the uploaded file
const FileSchema = new mongoose.Schema({
    filename: { 
        type: String, 
        required: true 
    },
    fileID: { 
        type: String, 
        required: true 
    },
    filePath: { 
        type: String, 
        required: true 
    },
    originalname: { 
        type: String 
    },
    filePath:{
        type:String
    }
});

// Define Folder schema to store files
const FolderSchema = new mongoose.Schema({
    foldername: { 
        type: String, 
        required: true 
    },
    folderID: { 
        type: String, 
        required: true 
    },
    files: { 
        type: [FileSchema], 
        required: true 
    },
}, { timestamps: true });

// Create a model for folders
const Folder = mongoose.model("Folder", FolderSchema);

module.exports = Folder;

