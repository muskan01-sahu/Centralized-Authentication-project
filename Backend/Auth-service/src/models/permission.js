const mongoose = require("mongoose");

/**
 * Identity & Access Model — Permission
 * {
 *   id: string
 *   resource: string  // orders, reports, users
 *   action: string    // read, write, delete
 * }
 * Permission format: <resource>:<action>  e.g. orders:read
 */
const permissionSchema = new mongoose.Schema(
  {
    resource: {
      type: String,
      required: [true, "Resource is required !!!"],
      trim: true,
      lowercase: true,
      // examples: orders, reports, users
    },
    action: {
      type: String,
      required: [true, "Action is required! !!!"],
      trim: true,
      lowercase: true,
      enum: {
        values: ["read", "write", "delete"],
        message: "Action must be read, write, or delete !!!",
      },
    },
  },
  { timestamps: true }
);

// Unique constraint: one resource+action pair only
permissionSchema.index({ resource: 1, action: 1 }, { unique: true });

module.exports = mongoose.model("Permission", permissionSchema);
