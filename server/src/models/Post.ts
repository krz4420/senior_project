import mongoose from "mongoose";

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
        body: String,
        by: mongoose.Schema.Types.ObjectId,
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
