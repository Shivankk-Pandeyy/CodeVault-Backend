const mongoose=require("mongoose");
const mongopass=process.env.MONGO_PASSWORD;
const connectDB=async()=>{
    try{
        await mongoose.connect(`mongodb+srv://pandeyshivank21:${mongopass}@codevault-1.yuac0.mongodb.net/?retryWrites=true&w=majority&appName=CodeVault-1`);
        // await mongoose.connect(`mongodb://localhost:27017/CodeVault`);
        console.log("MongoDB Connected");
    }
    catch(err){
        console.log(err);
        process.exit(1);
    }
}
module.exports={connectDB};