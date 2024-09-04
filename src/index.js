// require("dotenv").config({ path: "./env" }); //but this is not desirable here because rest all imports are with module es5 syntax
import dotenv from "dotenv";
// import mongoose from "mongoose";
// import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";
import { app } from './app.js'
dotenv.config({ path: './.env' });

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(' ⚙ Server is running on port: ', process.env.PORT || 8000);
        })
    })
    .catch(err => {
        console.log("MongoDB Connection FAILED ", err);
    })
// one way to connect database is-
/* function connectDB(){}
connectDB(); //but its not professional */

// another way is using IIFE (Immediately Invoked Function Expression)
/* (async ()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        app.on("error", (error)=> {
            console.log("Error: ", error);
            throw error;
        })
    } catch (err) {
        console.log("Error: ", err);
        throw err;
    }
}) (); //lets rather do it in a separate file inside db folder
*/
