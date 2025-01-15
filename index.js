//EXPRESS SETUP
const express=require("express");
const app=express();
const path = require("path");
//CORS SETUP
const cors=require("cors");
//DOTENV SETUP
const dotenv=require("dotenv");
dotenv.config();
//PORT SETUP
const PORT=process.env.PORT;
//MONGODB SETUP
const {connectDB}=require("./Database/Connection");
connectDB();
//MIDDLEWARE SETUP
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
//ROUTES SETUP
// Serve the 'uploads' directory as a static route
app.use("/upload", express.static(path.join(__dirname, "./Middleware/uploads")));
//USER ROUTES
const userroutes=require("./Routes/UserRoutes");
app.use("/codevault",userroutes);
//ADMIN ROUTES
const adminroutes=require("./Routes/AdminRoutes");
app.use("/codevault/admin",adminroutes);
//SERVER SETUP
app.listen(PORT,()=>{
    console.log(`Server started at PORT ${PORT}`);
})