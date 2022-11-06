import mongoose from "mongoose";
import Group from "./Group";
import User from "./User";

const PostSchema = new mongoose.Schema(
  {
    user: String,
    group: String,
    title: {
      type: "string",
      required: true,
    },
    description: String,
    comments: [
      {
        type: String,
      },
    ],
    likes: {
      type: "Number",
      default: 0,
    },
    file: [
      {
        filename: String,
        filetype: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Post = mongoose.model("Posts", PostSchema);
export default Post;
