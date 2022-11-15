import { Request, Response, Router } from "express";
import { User, Group, Post } from "../models";
const { GridFsStorage } = require("multer-gridfs-storage");
import Grid from "gridfs-stream";
import path from "path";
import mongoose from "mongoose";

import multer from "multer";
import { GridFSBucket } from "mongodb";

const router = Router();

const mongoUri =
  process.env.MONGO_URI ||
  "mongodb://user:pass@localhost:27017/mydatabase?authSource=admin";

const conn = mongoose.createConnection(mongoUri);
let gfs: Grid.Grid;
let gridfsbucket: GridFSBucket;

conn.once("open", () => {
  console.log("DB open");
  gridfsbucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "posts",
  });

  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection("posts"); // Has to be the same as the bucketName
});

const handleVideoUpload = (file: any) => {
  console.log(file);
};

const storage = new GridFsStorage({
  url: mongoUri,
  file: (req: any, file: any) => {
    console.log("STORAGE");
    console.log(file);
    return new Promise((resolve, reject) => {
      let ext = path.extname(file.originalname);

      // if (file.mimetype && file.mimetype.includes("video")) {
      //   console.log("UPLOADING VIDEO");
      //   handleVideoUpload(file);
      // }
      const filename = `post-${Date.now()}${ext}`;

      const fileInfo = {
        filename,
        bucketName: "posts",
      };

      resolve(fileInfo);
    });
  },
});

const upload = multer({ limits: { fieldSize: 25 * 1024 * 1024 }, storage });

// Endpoints for storing images and posts into database
router.post(
  "/create/image",
  upload.array("file", 10),
  (req: Request, res: Response) => {
    console.log("REQUEST FOR CREATE IMAGE");
    console.log(req.files);
    res.status(200).json(req.files);
  }
);

router.post("/create/post", async (req: Request, res: Response) => {
  const dbPost = req.body;
  console.log(req.body);
  Post.create(dbPost)
    .then((data) => {
      console.log("Successfully Created Post");
      res.json(data);
    })
    .catch((err) => {
      res.json(err);
    });
});

// Endpoints for fetching images and posts
router.get("/retrieve/image", async (req, res) => {
  const result = await gfs.files.findOne({ filename: req.query.name });

  if (result != null) {
    const readStream = gridfsbucket.openDownloadStream(result._id);

    readStream.pipe(res);
  }
});

// Endpoints for fetching images and posts
router.get("/retrieve/video", async (req, res) => {
  console.warn("IN RETRIEVE VIDEO");
  const result = await gfs.files.findOne({ filename: req.query.name });
  console.log(result);
  if (result != null) {
    console.log("not null");
    const readStream = gridfsbucket.openDownloadStream(result._id);

    readStream.pipe(res);
  }
});

router.get("/retrieve/post", async (req, res) => {
  const group = req.query.group;
  Post.find({ group: group })
    .then((data) => {
      data.sort((x, y) => {
        return y.createdAt - x.createdAt;
      });

      return res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json(err);
    });
});

router.post("/like", async (req, res) => {
  const { postID, userID } = req.body;
  try {
    const post = await Post.findById(postID);

    if (!post.likes.includes(userID)) {
      await post.updateOne({ $push: { likes: userID } });
      res.status(200).json("Post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: userID } });
      res.status(200).json("Post has been disliked");
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post("/comment", async (req, res) => {
  const { postID, username, body } = req.body;
  console.log(body);
  console.log(postID);
  const allPosts = await Post.find();
  console.log(allPosts);
  try {
    const data = { body, author: username, time: Date.now() };
    await Post.findByIdAndUpdate(postID, {
      $push: { comments: data },
    });
    res.status(200).json("Comment has been created");
  } catch (error) {
    res.status(400).json(error);
  }
});

export default router;
