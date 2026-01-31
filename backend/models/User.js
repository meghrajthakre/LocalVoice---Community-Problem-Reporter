const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator"); // <-- import validator

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "Invalid email format",
      },
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
      validate: {
        validator: function (value) {
          return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/.test(value);
        },
        message:
          "Password must be minimum 6 characters and include at least 1 letter and 1 number",
      },
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
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
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
