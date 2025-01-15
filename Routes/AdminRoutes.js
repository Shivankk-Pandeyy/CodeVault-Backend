const express = require("express");
const router = express.Router();
const path = require("path");

// CONTROLLER FUNCTIONS
const {
    addFolder,
    displayFolders,
    deleteFolder,
    uploadFile,
    displayFiles,
    deleteFile,
    getAllUsers,
    singleFile,
} = require("../Controllers/AdminController");
const upload = require("../Middleware/Multer");

// RESTFUL APIs
router.route("/folders/:id").put(addFolder).get(displayFolders);
router.route("/folders/:userID/:folderID").delete(deleteFolder);
router.route("/folders/:userID/:folderID/upload").put(upload.single("file"), uploadFile);
router.route("/folders/:userID/:folderID/files").get(displayFiles);
router.route("/folders/:userID/:folderID/files/:fileID").delete(deleteFile);
router.route("/folders/:userID/:folderID/:fileID/files").get(singleFile);
router.route("/users").get(getAllUsers);
module.exports = router;
