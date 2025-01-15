const express=require("express");
const router=express.Router();
//CONTROLLER FUCNTIONS
const {homepage, signup, login, singleUser, updateDetails, otp, otpUpdate, addTask, displayTask, deleteTask, addTaskInfo, displayTaskInfo, updateTaskStatus, deleteTaskInfo, updateStatus, logout, getAllFolders, getAllFiles}=require("../Controllers/UserController");
const { singleFile } = require("../Controllers/AdminController");
//RESTFUL APIs
router.route("/").get(homepage);
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/online/:id").put(updateStatus)
router.route("/offline/:id").put(logout)
router.route("/otp/:id").put(otp);
router.route("/otpupdate/:id").put(otpUpdate);
router.route("/singleuser/:id").get(singleUser);
router.route("/updateinfo/:id").put(updateDetails);
router.route("/addtask/:id").put(addTask);
router.route("/displaytask/:id").get(displayTask);
router.route("/deletetask/:id/:tasktitle/:taskID").delete(deleteTask);
router.route("/addtaskinfo/:id/:taskID").put(addTaskInfo);
router.route("/displayTaskInfo/:id/:taskID").get(displayTaskInfo);
router.put("/updateTaskStatus/:id/:taskID/:taskInfoID", updateTaskStatus);
router.route("/deleteTaskInfo/:id/:taskID/:taskInfoID").delete(deleteTaskInfo);
router.route("/folders/:id").get(getAllFolders)
router.route("/folders/:userID/:folderID/files").get(getAllFiles);
router.route("/folders/:userID/:folderID/:fileID/files").get(singleFile);
module.exports=router;