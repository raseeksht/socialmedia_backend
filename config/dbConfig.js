import mongoose from "mongoose";

const dbConnnect = async () => {
    mongoose.connect("mongodb://127.0.0.1:27017/socialmedia")
        .then((data) => {
            console.log("connected to mongoose")
        })
        .catch(err => {
            console.log(err)
            console.log("db connection error")
        })
}

export { dbConnnect }