import mongoose, { Schema, model } from "mongoose";

const dnsSchema = new Schema(
  {
    dnsName: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    publicIp: {
      type: String,
      required: true,
    },
    recordType: {
      type: String,
      enum: ["A", "CNAME"],
      required: true,
    },
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiryDate: {
      type: Date,
      default: function () {
        const date = new Date();
        date.setMonth(date.getMonth() + 3);
        return date;
      },
      required: true,
    },
    isRenewed: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

dnsSchema.index({ expiryDate: 1, isRenewed: 1 });

dnsSchema.pre("save", function (next) {
  if (this.isModified("isRenewed") && this.isRenewed === true) {
    const date = new Date();
    date.setMonth(date.getMonth() + 3);
    this.expiryDate = date;
  }
  next();
});

const DNS = model("dns", dnsSchema);

export default DNS;
