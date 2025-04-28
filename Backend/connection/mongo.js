import { mongoose } from "mongoose";


async function connectMongoose(url){
    try {
        await mongoose.connect(url)
        .then( () => console.log("mongodb connected"));
    } catch (error) {
        console.log("mongodb error : ", error);
    }
}

export {connectMongoose}