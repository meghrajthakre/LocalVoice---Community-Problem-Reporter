const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
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
      maxlength: [128, "Password cannot exceed 128 characters"],
      select: false,
      validate: {
        validator: function (value) {
          // At least 1 letter, 1 number, minimum 6 characters
          return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/.test(value);
        },
        message:
          "Password must be minimum 6 characters and include at least 1 letter and 1 number",
      },
    },

    role: {
      type: String,
      enum: {
        values: ["admin", "citizen"],
        message: "Role must be either 'admin' or 'citizen'",
      },
      default: "citizen",
    },

    preferredLanguage: {
      type: String,
      default: "en",
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
userSchema.index({ email: 1 });

// 🔐 Generate JWT
userSchema.methods.getJWT = function () {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  
  return jwt.sign(
    { 
      id: this._id,
      role: this.role 
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: "8h" } // Match cookie expiration
  );
};

// 🔑 Compare password
userSchema.methods.isPassValid = async function (inputPassword) {
  if (!inputPassword) {
    throw new Error("Password is required for comparison");
  }
  return await bcrypt.compare(inputPassword, this.password);
};

// 📝 Get public profile (without sensitive data)
userSchema.methods.getPublicProfile = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    preferredLanguage: this.preferredLanguage,
    createdAt: this.createdAt,
  };
};

// 🔒 Hash password before save
userSchema.pre("save", async function (next) {
  // Only hash if password is modified
  if (!this.isModified("password")) return next();
  
  try {
    // Use cost factor of 12 for better security
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    next(error);
  }
});

// 🕐 Update lastLogin on successful login
userSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  await this.save({ validateBeforeSave: false });
};

module.exports = mongoose.model("User", userSchema);