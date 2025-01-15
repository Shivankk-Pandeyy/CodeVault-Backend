const mongoose = require("mongoose");

// Define TaskInfo schema
const TaskInfoSchema = new mongoose.Schema({
    taskname: {
        type: String,
        required: true, // Make this field required
    },
    taskInfoID: {
        type: String,
        required: true, // This must be generated (e.g., using UUID) when creating a new task
    },
    taskStatus: {
        type: Boolean,
        default: false, // Optional: Leave the default for boolean if you want it to always start as false
    },
});

// Define Task schema
const TaskSchema = new mongoose.Schema({
    tasktitle: {
        type: String,
        required: true, // Ensure this field is provided
    },
    taskID: {
        type: String,
        required: true, // This must be generated when creating a new task
    },
    taskInfo: {
        type: [TaskInfoSchema], // Array of TaskInfoSchema
        required: true, // Ensure taskInfo array is provided
    },
});

// Define UserTask schema
const UserTaskSchema = new mongoose.Schema(
    {
        userID: {
            type: String,
            required: true, // Make this field required
        },
        task: {
            type: [TaskSchema], // Array of TaskSchema
            required: true, // Ensure task array is provided
        },
    },
    { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

// Create the model
const Task = mongoose.model("Task", UserTaskSchema);
module.exports = Task;
