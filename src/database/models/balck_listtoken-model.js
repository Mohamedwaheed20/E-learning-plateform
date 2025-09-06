import mongoose from 'mongoose';

const blackListTokenSchema = new mongoose.Schema({
    tokenid: {
    type: String,
    required: true,
    unique: true,
  },
  expirydate: {
    type: Date,
    required: true,
  },
}, { timestamps: true });

export const BlackListToken = mongoose.models.blacklisttoken || mongoose.model("blacklisttoken", blackListTokenSchema);
