import { Schema,model } from "mongoose";
import  argon2  from "argon2";

const userSchema = new Schema({
    authType : {
        type : String,
        required : true,
        enum : ['local','google'],
        default : 'local',
    },
    username : {
        type : String,
        unique : true
    },
    authId : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
    },
    email : {
        type : String,
        required : true,
        unique : true
    }
})

userSchema.pre("save", async function (next) {
    if(!this.username && this.email){
        this.username = this.email.split("@")[0];
    }

    if (this.authType === 'local' && this.isModified("password") && this.password){ 
    this.password = await argon2.hash(this.password) 
    }
    next();
});
const User = model("user", userSchema);

export default User;