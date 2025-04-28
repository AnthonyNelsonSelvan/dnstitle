import mongoose, { Schema,model } from "mongoose";

const dnsSchema =  new Schema({
    dnsName : {
        type : String,
        unique : true,
        required : true,
        trim : true,
    },
    publicIp : {
        type : String,
        required : true,
    },
    recordType : {
        type : String,
        enum : ['A','CNAME'],
        required : true,
    },
    userRef : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true
    }
},{timestamps : true})

const DNS = model("dns", dnsSchema);

export default DNS;

