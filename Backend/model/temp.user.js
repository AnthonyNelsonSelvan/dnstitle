import { model, Schema } from "mongoose";

const tempUserSchema = new Schema({
    email : {
        type : String,
        required : true,
    },
    token : {
        type : String,
        required : true,
    },
    expiresAt : {
        type : Date,
        required : true,
        index : {expires : 0},
    },
    isVerified : {
        type : Boolean,
        required : true,
        default : false,
    }
});

const TempUser = model("tempUser",tempUserSchema);

export default TempUser;