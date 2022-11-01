import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: true,
    unique: true,
  },
  
});

export const Group = mongoose.model("Group", GroupSchema);
export default Group;
