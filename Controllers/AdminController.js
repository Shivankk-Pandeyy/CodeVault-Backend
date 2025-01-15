const { v4: uuidv4 } = require("uuid");
const Folder = require("../Schema/FolderSchema");
const fs = require("fs");
const User = require("../Schema/UserSchema");
const { get } = require("http");
// Add Folder
const addFolder = async (req, res) => {
    const { foldername } = req.body;
    try {
        const existingFolder = await Folder.findOne({ foldername });
        if (existingFolder) {
            return res.status(400).json({ message: "Folder name already exists" });
        }
        const folderID = uuidv4();
        const newFolder = new Folder({
            foldername,
            folderID,
            files: [],
        });

        await newFolder.save();
        res.status(200).json({ message: "Folder created successfully", folderID });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

// Display Folders
const displayFolders = async (req, res) => {
    try {
        const folders = await Folder.find({});
        res.status(200).json(folders);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

// Delete Folder
const deleteFolder = async (req, res) => {
    const { folderID } = req.params;
    try {
        const folder = await Folder.findOne({ folderID });
        if (!folder) {
            return res.status(404).json({ message: "Folder not found" });
        }

        // Remove files from storage
        folder.files.forEach(file => {
            if (fs.existsSync(file.filePath)) {
                fs.unlinkSync(file.filePath);
            }
        });

        await Folder.deleteOne({ folderID });
        res.status(200).json({ message: "Folder deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

// Upload File
const uploadFile = async (req, res) => {
    const { folderID } = req.params;
    const {filename}=req.body;
    try {
        const folder = await Folder.findOne({ folderID });
        if (!folder) {
            return res.status(404).json({ message: "Folder not found" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const {originalname, path: filePath } = req.file;
        const fileID = uuidv4();

        folder.files.push({
            filename:filename,
            fileID,
            filePath,
            originalname,
            filePath:req.file.filename
        });

        await folder.save();
        res.status(200).json({ message: "File uploaded successfully", fileID });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

// Display Files in a Folder
const displayFiles = async (req, res) => {
    const { folderID } = req.params;
    try {
        const folder = await Folder.findOne({ folderID });
        if (!folder) {
            return res.status(404).json({ message: "Folder not found" });
        }

        res.status(200).json(folder.files);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

// Delete File
const deleteFile = async (req, res) => {
    const { folderID, fileID } = req.params;
    try {
        const folder = await Folder.findOne({ folderID });
        if (!folder) {
            return res.status(404).json({ message: "Folder not found" });
        }

        const fileIndex = folder.files.findIndex(file => file.fileID === fileID);
        if (fileIndex === -1) {
            return res.status(404).json({ message: "File not found" });
        }

        const filePath = folder.files[fileIndex].filePath;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        folder.files.splice(fileIndex, 1);
        await folder.save();

        res.status(200).json({ message: "File deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
};

//GET ALL USERS
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
}
//SINGLE FILE
const singleFile=async(req,res)=>{
    const { folderID, fileID } = req.params;

    try {
        // Find the folder containing the file
        const folder = await Folder.findOne({ folderID });
        if (!folder) {
            return res.status(404).json({ message: "Folder not found" });
        }

        // Find the specific file within the folder
        const file = folder.files.find(file => file.fileID === fileID);
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        // Send the file details as a response
        res.status(200).json({ 
            message: "File retrieved successfully",
            file 
        });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
}
module.exports = {
    addFolder,
    displayFolders,
    deleteFolder,
    uploadFile,
    displayFiles,
    deleteFile,
    getAllUsers,
    singleFile
};