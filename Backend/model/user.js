import { Schema,model } from "mongoose";
import  argon2  from "argon2";

const userSchema = new Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    }
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next(); 

    this.password = await argon2.hash(this.password) 
    next();
});

const User = model("user", userSchema);

export default User;