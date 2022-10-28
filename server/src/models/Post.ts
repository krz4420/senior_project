import mongoose from "mongoose";
import Group from "./Group";
import User from './User';

const PostSchema = new mongoose.Schema({
    user: String,
    group: String,
    title: {
        type: "string",
        required: true,
    },
    comments: {
        type: "string",
    },
    likes: {
        type: "Number",
    },
    filename: {
        type:"string"
    },
},
{
    timestamps: true,
});

export const Post = mongoose.model("Posts", PostSchema);
export default Post;
