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
        author: String,
        time: Date,
        default: [],
      },
    ],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
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
