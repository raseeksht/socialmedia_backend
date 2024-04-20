import mongoose from "mongoose";

const dbConnnect = async () => {
    mongoose.connect(process.env.NODE_ENV === "dev" ? "mongodb://127.0.0.1:27017/socialmedia" : process.env.MONGO_URI)
        .then((data) => {
            console.log("connected to mongoose")
        })
        .catch(err => {
            console.log(err)
            console.log("db connection error")
        })
}

export { dbConnnect }