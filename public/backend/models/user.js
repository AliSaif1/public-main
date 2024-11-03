import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  userName: { type: String, unique: true },
  password: { type: String, required: true },
  userType: { type: String, required: true }, // Could be 'brand', 'influencer', etc.
  status: { type: String, default: "incomplete" },
  earnings: { type: Number },

  // Common Fields
  fullName: { type: String },
  age: { type: Number },
  website: { type: String },
  photo: { type: String },
  gender: { type: String },
  followers: { type: Number },
  bio: { type: String },
  blogs: [
    {
      blogID: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }
    }
  ],
  likedPosts: [
    {
      postID: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }
    }
  ],
  savedPosts: [
    {
      postID: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }
    }
  ],

  // Brand-Specific Fields
  position: { type: String }, // Position of user in company
  companySize: { type: String }, // Size of the company
  influencersWorkedWith: { type: String }, // Store as a string range
  category: [{ type: String }], // Array of categories like 'Fashion', 'Travel', etc.
  
  // Influencer-Specific Fields
  groups: { type: Number }, // Number of groups influencer is part of
},{ timestamps: true });

export default mongoose.model("User", userSchema);