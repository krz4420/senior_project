import mongoose from "mongoose";
import Group from "./Group";
import User from './User';

const PostSchema = new mongoose.Schema({
    title: {
        type: "string",
        required: true,
    },
    comments: {
        type: "string",
    },
    likes: {
        type: "int",
        required: true,
    },
    

});

export const Post = mongoose.model("Post", PostSchema);
export default Post;
