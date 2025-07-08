import mongoose, { Schema } from "mongoose";


const DomainLimitSchema = new Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
        unique : true,
    },
    domainCount : {
        type : Number,
        default : 0,
    },
    domainLimit : {
        type : Number,
        default : 3,
    },
    warnedTimes : {
        type : Number,
        default : 0,
    },
    warnedLimit : {
        type : Number,
        default : 3,
    }
},{
    timestamps : true
});

const DomainLimit = mongoose.model("DomainLimit",DomainLimitSchema);

export default DomainLimit;