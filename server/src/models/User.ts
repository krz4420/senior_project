import mongoose, { Schema } from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: "string",
    required: true,
    unique: true,
  },
  password: {
    type: "string",
    required: true,
  },
  email:{
    type:"string",
    required:true,
    unique: true,
  },
  role:{
    type:"string",
    required: true,
    default: "basic",
  },
  groups:{
    type: mongoose.Schema.Types.ObjectId, 
    ref:'Group',
    required: true
  }

});

export const User = mongoose.model("User", UserSchema);
export default User;
