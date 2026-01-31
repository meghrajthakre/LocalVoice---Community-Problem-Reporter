const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["admin", "citizen"],
      default: "citizen",
    },

    preferredLanguage: {
      type: String,
      default: "en",
    },
  },
  {
    timestamps: true,
  }
);


// 🔐 Generate JWT
userSchema.methods.getJWT = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};


// 🔑 Compare password
userSchema.methods.isPassValid = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};


// 🔒 Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);
