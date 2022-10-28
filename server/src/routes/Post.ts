import { Request, Response, Router } from "express";
import { User, Group, Post } from "../models";
const { GridFsStorage } = require('multer-gridfs-storage');
import Grid from 'gridfs-stream';
import path from 'path';
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

conn.once('open', () => {
  console.log("DB open")
  gridfsbucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName:'posts'
  })

  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('posts') // Has to be the same as the bucketName
});

const storage = new GridFsStorage({
    url:mongoUri,
    file:(req: any, file: any) => {
      return new Promise((resolve, reject)=>{
        const filename = `post-${Date.now()}${path.extname(file.originalname)}`;
  
        const fileInfo = {
          filename,
          bucketName: 'posts'
        }
  
        resolve(fileInfo);
      })
    }
  })
  
const upload = multer({  limits: { fieldSize: 25 * 1024 * 1024 }, storage });
  

// Endpoints for storing images and posts into database
router.post("/create/image", upload.single("file"), (req: Request, res: Response) => {
    console.log(req);
    res.status(200).json(req.file);
});

router.post("/create/post", async (req: Request, res: Response) => {
  const dbPost = req.body;

  Post.create(dbPost).then(data => {
    console.log("Successfully Created Post");

    res.json(data);
  }).catch( err => {
    console.log(err);
    res.json(err);
  })
  
});

// Endpoints for fetching images and posts
router.get("/retrieve/image", async (req, res) =>{
  const result = await gfs.files.findOne({filename:req.query.name});
  console.log(result);
  const readStream = gridfsbucket.openDownloadStream(result._id);
  // res.send("Sag")
  readStream.pipe(res);
});

router.get("/retrieve/post", async (req, res) =>{
  Post.find().then( data => {
    console.log(data)
    data.sort((x, y) => {
      return x.timestamps - y.timestamps;
    })

    return res.status(200).json(data);
  }).catch( err => {
    console.log(err)
    return res.status(400).json(err);
  })
});

export default router;
