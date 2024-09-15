import mongoose, { model, Schema } from "mongoose";
const verificationTokenSchema = new Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  verificationToken: String,
  verificationExpiresAt: Date,
});
verificationTokenSchema.index({ timestamp: 1 }, { expireAfterSeconds: 300 });
const verificationTokenModel = model(
  "verificationTokenModel",
  verificationTokenSchema
);
export default verificationTokenModel;
