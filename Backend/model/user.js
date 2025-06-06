import { Schema,model } from "mongoose";
import  argon2  from "argon2";
import crypto from "crypto";

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
    },
    resetToken : {
        type : String,
    },
    resetTokenExpiry : {
        type : Date
    },
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

userSchema.methods.createResetToken = function () {
    const rawToken = crypto.randomBytes(32).toString('hex');
    this.resetToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    this.resetTokenExpiry = Date.now() + 1000  * 60 * 15;
    console.log(rawToken);
    console.log(this.resetToken);
    console.log(this.resetTokenExpiry);
    return rawToken;
}

const User = model("user", userSchema);

export default User;