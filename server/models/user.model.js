import mongoose from "mongoose";
import crypto from "crypto";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: "Name is required",
  },
  email: {
    type: String,
    trim: true,
    unique: "Email already exists",
    match: [/.+\@.+\..+/, "Please fill a valid email address"],
    required: "Email is required",
  },
  role: {
    type: String,
    default: "user",   // admin will be hardcoded manually
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  hashed_password: {
    type: String,
    required: "Password is required",
  },
  salt: String,
});

// Virtual password field
UserSchema.virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

// Methods
UserSchema.methods = {
  encryptPassword(password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },

  authenticate(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
};

export default mongoose.model("User", UserSchema);
