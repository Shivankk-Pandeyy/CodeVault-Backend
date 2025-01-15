//USER SCHEMA
const User=require("../Schema/UserSchema");
//TASK SCHEMA
const Task=require("../Schema/TaskSchema");
//FOLDER SCHEMA
const Folder=require("../Schema/FolderSchema");
//BCRYPT JS 
const bcrypt=require('bcryptjs');
//NODEMAILER
const nodemailer = require("nodemailer");
//UUID LIBRARY
const { v4: uuidv4 } = require('uuid');
const { single } = require("../Middleware/Multer");
const { text } = require("express");
//API FUNCTION CALLS
const homepage=async(req,res)=>{
    try{
        return res.status(200).json({Message:"CODEVAULT HOMEPAGE GET REQUEST"});
    }
    catch(err){
 
        return res.status(500).json({Message:"INTERNAL SERVER ERROR"});
    }
}
//REGISTER USER 
const signup=async(req,res)=>{
    const {name,email,password}=req.body;
    const dummy=await User.findOne({email});
    const ademail=process.env.ADMIN_EMAIL;
    if(dummy){
        return res.status(400).json({Message:"EMAIL"});
    }
    else{
        try{
            const randomNumber = Math.floor(100000 + Math.random() * 900000);
            bcrypt.genSalt(10,async(err,salt)=>{
                bcrypt.hash(password,salt,async(err,hash)=>{
                    const transporter = await nodemailer.createTransport({
                        service: "gmail",
                        port: 465,
                        secure: true, // true for port 465, false for other ports
                        auth: {
                          user: "shivank.pandeyy@gmail.com",
                          pass: "ytly next jflt ltxz",
                        },
                      });
                      const reciver={
                        from:"shivank.pandeyy@gmail.com",
                        to:`${email}`,
                        subject:"OTP FROM CODEVAULT",
                        text:`Your OTP is ${randomNumber}`
                      }
                    if(email===ademail){
                        const user=await new User({
                            name,
                            email,
                            password:hash,
                            OTP:randomNumber,
                            isVerified:false,
                            admin:true
                        });
                        await user.save();
                        const Valid=await User.findOne({name,email});
                        await transporter.sendMail(reciver,(err,data)=>{
                            if(err){
                                console.log(err);
                            }
                            else{
                                console.log("Email sent");
                            }
                        }
                        )
                    }    
                    else{
                        const user=await new User({
                            name,
                            email,
                            password:hash,
                            OTP:randomNumber,
                            isVerified:false,
                            admin:false
                        });
                        await user.save();
                        const Valid=await User.findOne({name,email});
                        const task=await new Task({
                            userID:Valid._id.toString() 
                        });
                        await task.save();
                        await transporter.sendMail(reciver,(err,data)=>{
                            if(err){
                                console.log(err);
                            }
                            else{
                                console.log("Email sent");
                            }
                        }
                        )
                    }
                    const Valid=await User.findOne({name,email});
                    return res.status(200).json({message:"CREATED",id:Valid._id,isVerified:Valid.isVerified});
                })
            })
        }
        catch(err){
      
            return res.status(500).json({Message:"INTERNAL SERVER ERROR"});
        }
    }
}
//LOGIN USER
const login=async(req,res)=>{
    const{email,password}=req.body; 
    const Valid=await User.findOne({email});
    try{
        if(Valid){
            const bool=await bcrypt.compare(password,Valid.password);
            if(bool&&Valid.isVerified===true){
                return res.status(200).json({message:"LOGIN",id:Valid._id,Admin:Valid.admin,Verified:Valid.isVerified});
            }
            else if(bool&&Valid.isVerified===false){
                const transporter = await nodemailer.createTransport({
                    service: "gmail",
                    port: 465,
                    secure: true, // true for port 465, false for other ports
                    auth: {
                      user: "shivank.pandeyy@gmail.com",
                      pass: "ytly next jflt ltxz",
                    },
                  });
                  const reciver={
                    from:"shivank.pandeyy@gmail.com",
                    to:`${email}`,
                    subject:"OTP FROM CODEVAULT",
                    text:`Your OTP is ${Valid.OTP}`
                  }
                  await transporter.sendMail(reciver,(err,data)=>{
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log("EMAIL SENT");
                    }
                }
                )
                return res.status(400).json({message:"LOGIN",id:Valid._id,Verified:Valid.isVerified});
            }
            else{
                return res.status(400).json({message:"PASSWORD"});
            }
        }
        else{
            return res.status(400).json({message:"USERX"});
        }
    }
    catch(err){
        return res.status(500).json({Message:"INTERNAL SERVER ERROR"});
    }
}
//UPDATE STATUS
const updateStatus=async(req,res)=>{
    const {id}=req.params;
    try{
        await User.findByIdAndUpdate(id,{status:"online"});
        return res.status(200).json({Message:"ONLINE"});
    }
    catch(err){
   
        return res.status(500).json({Message:"INTERNAL SERVER ERROR"});
    }
}
//LOGOUT UPDATE
const logout=async(req,res)=>{
    const {id}=req.params;
    try{
        await User.findByIdAndUpdate(id,{status:"offline"});
        return res.status(200).json({Message:"OFFLINE"});
    }
    catch(err){
        
        return res.status(500).json({Message:"INTERNAL SERVER ERROR"});
    }
}
//OTP VERIFY 
const otp=async(req,res)=>{
    const {id}=req.params;
    const {OTP}=req.body;
    const user=await User.findById(id);
    try{
        if(OTP===user.OTP){
            await User.findByIdAndUpdate(id,{isVerified:true});
            return res.status(200).json({Message:"VERIFIED"});
        }
        else{
            return res.status(400).json({Message:"INVALID OTP"});
        }
    }
    catch(err){
        return res.status(500).json({Message:"INTERNAL SERVER ERROR"});
    }
}
//OTP UPDATE
const otpUpdate=async(req,res)=>{
    const {id}=req.params;
    try{
        const randomNumber = Math.floor(100000 + Math.random() * 900000);
        await User.findByIdAndUpdate(id,{OTP:randomNumber});
        const transporter = await nodemailer.createTransport({
            service: "gmail",
            port: 465,
            secure: true, // true for port 465, false for other ports
            auth: {
              user: "shivank.pandeyy@gmail.com",
              pass: "ytly next jflt ltxz",
            },
          });
          const reciver={
            from:"shivank.pandeyy@gmail.com",
            to:`${email}`,
            subject:"OTP FROM CODEVAULT",
            text:`Your OTP is ${randomNumber}`
          }
          await transporter.sendMail(reciver,(err,data)=>{
            if(err){
                console.log(err);
            }
            else{
                console.log("EMAIL SENT");
            }
        }
        )
        return res.status(200).json({Message:"OTP UPDATED"})
    }
    catch(err){
       
        return res.status(500).json({Message:"INTERNAL SERVER ERROR"});
    }
}
//SINGLE USER
const singleUser=async(req,res)=>{
    const {id}=req.params;
    const userdetails=await User.findById({_id:id});
    try{
        return res.status(200).json(userdetails);
    }
    catch(err){
        return res.status(500).json({Message:"INTERNAL SERVER ERROR"});
    }
}
//UPDATE INFORMATION
const updateDetails=async(req,res)=>{
    const {id}=req.params;
    const {name,password}=req.body;
    const dummy=await User.findById({_id:id});
    const pass_bool=await bcrypt.compare(password,dummy.password)
    try{
        if(name===dummy.name&&pass_bool===true){
            return res.status(400).json({Message:"NO CHANGES"})
        }
        else if(pass_bool===true){
            return res.status(400).json({Message:"PASSWORD SAME"});
        }
        else if(pass_bool===true&&name===dummy.name){
            return res.status(400).json({Message:"SAME PASSWORD"});
        }
        else if(name!==dummy.name&&name!==""&&password===""){
            await User.findByIdAndUpdate(id,{
                _id:id,
                name:name
            })
            return res.status(200).json({Message:"NAME CHANGED"});
        }
        else if(pass_bool===false&&name===""){
            bcrypt.genSalt(10,async(err,salt)=>{
                bcrypt.hash(password,salt,async(err,hash)=>{
                    await User.findByIdAndUpdate(id,{
                        _id:id,
                        password:hash
                    })
                })
            })
            return res.status(200).json({Message:"PASSWORD CHANGED"});
        }
        else if(pass_bool===false&&name!==dummy.name){
          
            bcrypt.genSalt(10,async(err,salt)=>{
                bcrypt.hash(password,salt,async(err,hash)=>{
                    await User.findByIdAndUpdate(id,{
                        _id:id,
                        name:name,
                        password:hash
                    })
                })
            })
            return res.status(200).json({Message:"DETAILS CHANGED"});
        }
    }
    catch(err){
        
        return res.status(500).json({Message:"INTERNAL SERVER ERROR"});
    }
}
const addTask = async (req, res) => {
    const { id } = req.params; // `id` corresponds to userID
    const { tasktitle } = req.body;

    try {
        // Find the user task document
        const userTask = await Task.findOne({ userID: id });
        if (!userTask) {
            return res.status(404).json({ Message: "User not found" });
        }

        // Check if the task title already exists
        const existingTask = userTask.task.find((task) => task.tasktitle === tasktitle);
        if (existingTask) {
            return res.status(400).json({ Message: "Task title already exists" });
        }

        // Generate a unique ID for the new task
        const uniqueId = uuidv4();

        // Add the new task
        userTask.task.push({ tasktitle, taskID: uniqueId, taskInfo: [] });

        // Save the updated user task document
        await userTask.save();

        return res.status(200).json({ Message: "Added task successfully" });
    } catch (err) {
        console.error("Error adding task:", err);
        return res.status(500).json({ Message: "Internal Server Error" });
    }
};

const displayTask = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the user task document
        const userTask = await Task.findOne({ userID: id });
        if (!userTask) {
            return res.status(404).json({ Message: "User not found" });
        }

        // Return all task titles
        return res.status(200).json(userTask.task);
    } catch (err) {
        console.error("Error displaying tasks:", err);
        return res.status(500).json({ Message: "Internal Server Error" });
    }
};

const deleteTask = async (req, res) => {
    const { id, taskID } = req.params;

    try {
        // Find the user task document
        const userTask = await Task.findOne({ userID: id });
        if (!userTask) {
            return res.status(404).json({ Message: "User not found" });
        }

        // Filter out the task with the matching `taskID`
        const initialLength = userTask.task.length;
        userTask.task = userTask.task.filter((task) => task.taskID !== taskID);

        // Check if a task was actually deleted
        if (userTask.task.length === initialLength) {
            return res.status(404).json({ Message: "Task not found" });
        }

        // Save the updated document
        await userTask.save();
        return res.status(200).json({ Message: "Deleted task successfully" });
    } catch (err) {
        console.error("Error deleting task:", err);
        return res.status(500).json({ Message: "Internal Server Error" });
    }
};

const addTaskInfo = async (req, res) => {
    const { id, taskID } = req.params;
    const { taskname } = req.body;

    try {
        // Find the user task document
        const userTask = await Task.findOne({ userID: id });
        if (!userTask) {
            return res.status(404).json({ Message: "User not found" });
        }

        // Find the specific task by taskID
        const task = userTask.task.find((task) => task.taskID === taskID);
        if (!task) {
            return res.status(404).json({ Message: "Task not found" });
        }

        // Check if the taskInfo already exists
        const existingTaskInfo = task.taskInfo.find((info) => info.taskname === taskname);
        if (existingTaskInfo) {
            return res.status(400).json({ Message: "Task name already exists" });
        }

        // Generate a unique ID for the taskInfo
        const uniqueId = uuidv4();

        // Add the new taskInfo
        task.taskInfo.push({ taskname, taskInfoID: uniqueId, taskStatus: false });

        // Save the updated user task document
        await userTask.save();

        return res.status(200).json({ Message: "Added task successfully" });
    } catch (err) {
        console.error("Error adding task info:", err);
        return res.status(500).json({ Message: "Internal Server Error" });
    }
};

const displayTaskInfo = async (req, res) => {
    const { id, taskID } = req.params; // Extract userID and taskID from the request

    try {
        // Find the user by userID
        const userTask = await Task.findOne({ userID: id });
        if (!userTask) {
            return res.status(404).json({ Message: "User not found" });
        }

        // Find the specific task by taskID
        const task = userTask.task.find((task) => task.taskID === taskID);
        if (!task) {
            return res.status(404).json({ Message: "Task not found" });
        }

        // Return the taskInfo array
        return res.status(200).json(task.taskInfo);
    } catch (err) {
        console.error("Error displaying task info:", err);
        return res.status(500).json({ Message: "Internal Server Error" });
    }
};

// UPDATE TASK STATUS
const updateTaskStatus = async (req, res) => {
    const { id, taskID, taskInfoID } = req.params; // Extract userID, taskID, and taskInfoID from the request
    const { taskStatus } = req.body; // Extract the new status from the request body

    try {
        // Find the user document
        const userTask = await Task.findOne({ userID: id });
        if (!userTask) {
            return res.status(404).json({ Message: "User not found" });
        }

        // Find the specific task by taskID
        const task = userTask.task.find((task) => task.taskID === taskID);
        if (!task) {
            return res.status(404).json({ Message: "Task not found" });
        }

        // Find the specific taskInfo by taskInfoID
        const taskInfo = task.taskInfo.find((info) => info.taskInfoID === taskInfoID);
        if (!taskInfo) {
            return res.status(404).json({ Message: "Task info not found" });
        }

        // Update the taskStatus
        taskInfo.taskStatus = taskStatus;
        await userTask.save();

        return res.status(200).json({ Message: "Task status updated successfully" });
    } catch (err) {
        console.error("Error updating task status:", err);
        return res.status(500).json({ Message: "Internal Server Error" });
    }
};
const deleteTaskInfo = async (req, res) => {
    try {
      const { id, taskID, taskInfoID } = req.params;
  
      // Log the params to check if they're coming through correctly
  
      // Find the user by userID
      const user = await Task.findOne({ "userID": id });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Find the task by taskID
      const task = user.task.find(t => t.taskID === taskID);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      // Find the taskInfo by taskInfoID within the task
      const taskInfoIndex = task.taskInfo.findIndex(ti => ti.taskInfoID === taskInfoID);
      if (taskInfoIndex === -1) {
        return res.status(404).json({ message: "Task info not found" });
      }
  
      // Remove the taskInfo from the taskInfo array
      task.taskInfo.splice(taskInfoIndex, 1);
  
      // Save the changes to the database
      await user.save();
  
      return res.status(200).json({ message: "Task info deleted successfully" });
    } catch (err) {
      console.error("Error deleting task info:", err);
      return res.status(500).json({ message: "Server Error" });
    }
};
const getAllFolders = async (req, res) => {
    try {
      const folders = await Folder.find({});
      return res.status(200).json(folders);
    } catch (err) {
      console.error("Error getting all folders:", err);
      return res.status(500).json({ message: "Server Error" });
    }
}
// Display Files in a Folder
const getAllFiles = async (req, res) => {
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
//SINGLE FILE
const singleFile = async (req, res) => {
    const { folderID, fileID } = req.params;

    try {
        const folder = await Folder.findOne({ folderID });
        if (!folder) {
            return res.status(404).json({ message: "Folder not found" });
        }

        const file = folder.files.find(file => file.fileID === fileID);
        if (!file) {
            return res.status(404).json({ message: "File not found" });
        }

        const filePath = file.filePath;

        if (fs.existsSync(filePath)) {
            res.setHeader('Content-Disposition', 'inline; filename=' + path.basename(filePath)); // 'inline' shows file in browser
            res.setHeader('Content-Type', 'application/pdf'); // Adjust this based on your file type

            res.sendFile(filePath, { root: '.' }, (err) => {
                if (err) {
                    console.error("File download error: ", err);
                    res.status(500).send("Error in file download");
                }
            });
        } else {
            return res.status(404).json({ message: "File not found on the server" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error });
    }
}
module.exports={homepage,signup,login,singleUser,updateDetails,otp,otpUpdate,addTask,displayTask,deleteTask,addTaskInfo,displayTaskInfo,updateTaskStatus,deleteTaskInfo,updateStatus,logout,getAllFolders,getAllFiles,singleFile};