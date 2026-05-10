const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 *  Identity & Access Model — User
 * {
 *   id: string
 *   email: string
 *   password: string   // hashed
 *   isActive: boolean
 *   createdAt: Date
 * }
 *
 */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required ....."],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email ....."],
    },
    // password must be hashed (bcryptjs)
    password: {
      type: String,
      required: [true, "Password is required ....."],
      minlength: [6, "Password must be at least 6 characters ......"],
      select: false, // never return password in query results
    },
    
    isActive: {
      type: Boolean,
      default: true,
    },
    
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    // Refresh token storage for rotation & revocation 
    refreshToken: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true, //createdAt: Date
  }
);

// Hash password before saving 
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method: compare plain vs hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);