import { Request, Response, Router } from "express";
import { User, Group, Post } from "../models";
import mongoose from "mongoose";

const { GridFsStorage } = require("multer-gridfs-storage");
import { GridFSBucket } from "mongodb";
import Grid from "gridfs-stream";

import path, { resolve } from "path";
import multer from "multer";
const hbjs = require("handbrake-js");
var fs = require("fs");

const router = Router();
const mime = require("mime");

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

const dir = path.resolve(__dirname, "../utils/tmp");

const handleVideoConvert = (filePath: any, filename: any) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  const output = dir + "/" + filename;

  const options = {
    input: filePath,
    output: output,
    preset: "Very Fast 480p30",
  };

  return hbjs.spawn(options);
};

// Storage Engine for when images are uploaded to backend. Uploads straight to mongoDB
const imageStorage = new GridFsStorage({
  url: mongoUri,
  file: (req: any, file: any) => {
    console.log("File", file);
    return new Promise((resolve, reject) => {
      let ext = file.mimetype.split("/")[1];
      const filename = `post-${Date.now()}.${ext}`;

      const fileInfo = {
        filename,
        bucketName: "posts",
      };

      resolve(fileInfo);
    });
  },
});

// Storage Engine for videos. Downloads locally.
const videoStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `post-` + Date.now() + "." + file.originalname);
  },
});

const imageUpload = multer({
  limits: { fieldSize: 25 * 1024 * 1024 },
  storage: imageStorage,
});

// Endpoint for storing images into the database
router.post(
  "/create/image",
  imageUpload.array("file", 10),
  (req: Request, res: Response) => {
    console.log("REQUEST FOR CREATE IMAGE");
    console.log(req.files);
    res.status(200).json(req.files);
  }
);

const videoUpload = multer({
  limits: { fieldSize: 25 * 1024 * 1024 },
  storage: videoStorage,
});

// Endpoint for storing videos into the databse.
router.post(
  "/create/video",
  videoUpload.array("file", 10),
  async (req: Request, res: Response) => {
    console.log("REQUEST FOR CREATE VIDEO");

    // Grab all the videos being uploaded
    const videoFiles: any = req.files;

    // Stores the path of the mp4 and filename
    let promises: any = [];

    // Stores the filename and contentType
    let ret: any = [];

    // Go through all the videos and converts them into mp4
    Promise.all(
      videoFiles.map((file: any) => {
        return new Promise((resolve, reject) => {
          // Convert the file into mp4 format
          const mp4FileName = file.filename.split(".")[0] + ".mp4";
          const handbrake = handleVideoConvert(file.path, mp4FileName);

          handbrake
            // When the video conversion finishes the following block runs
            .on("end", (data: any) => {
              console.log("Path", handbrake.options.output);
              // Add the filename and its new path to an array that will be passed to the then() chunk
              promises.push({
                filename: mp4FileName,
                path: handbrake.options.output,
              });
              ret.push({ filename: mp4FileName, contentType: "video/mp4" });
              resolve(promises);
            })
            .on("error", (error: any) => {
              console.log("error", error);
              reject;
            });
        });
      })
    )
      .then(() => {
        // Take the converted files and upload to mongoDB
        Promise.all(
          promises.map((promise: any) => {
            return new Promise((resolve, reject) => {
              // Create the write stream to mongoDB
              const writeStream = gridfsbucket.openUploadStream(
                promise.filename
              );
              console.log(mime.getType(promise.path));
              // Create the read stream taking input from video and pipe it to monogDB
              fs.createReadStream(promise.path).pipe(writeStream);

              // Reject the promise if there is an error
              writeStream.on("error", reject);

              // When the write stream is closed this means the video has finished uploading to mongoDB, resolve promise
              writeStream.on("close", () => {
                resolve({
                  filename: promise.filename,
                  contentType: "video/mp4",
                });
              });
            });
          })
        )
          .then((data) => {
            // Send back the filenames and filetypes to frontend
            res.status(200).json(data);
          })
          .catch((error) => {
            console.log(error);
            res.status(400).json(error);
          });
      })
      .catch((error) => {
        console.log("Error at bottom", error);
        res.status(400).json(error);
      });
  }
);

router.post("/create/post", async (req: Request, res: Response) => {
  const dbPost = req.body;
  console.log(req.body);
  Post.create(dbPost)
    .then((data) => {
      console.log("Successfully Created Post");
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// Endpoint for fetching images from monogDB
router.get("/retrieve/image", async (req, res) => {
  // Look up file name in mongoDB
  const result = await gfs.files.findOne({ filename: req.query.name });

  // If the file exists, then open readStream and pipe it to response.
  if (result != null) {
    const readStream = gridfsbucket.openDownloadStream(result._id);

    readStream.pipe(res);
  }
});

// Endpoint for fetching videos from mongoDB
router.get("/retrieve/video", async (req, res) => {
  // Look up the file name in mongoDB
  const result = await gfs.files.findOne({ filename: req.query.name });

  if (result != null) {
    console.log("Result", result);
    const videoPath = __dirname + "/post-1669652865650.mp4";

    // const videoSize = fs.statSync(videoPath).size;
    const videoSize = result.length;

    console.log("VideoSize", videoSize);

    const { range } = req.headers;

    /* Check for Range header */
    if (range) {
      // Grab the start and end bytes from the request
      const parts = req.headers["range"].replace(/bytes=/, "").split("-");
      const partialstart = parts[0];
      const partialend = parts[1];

      // Convert the start/end from strings to ints
      const start = parseInt(partialstart, 10);
      const end = partialend ? parseInt(partialend, 10) : videoSize - 1;
      const chunksize = end - start + 1;

      // Send back 206 header for partial data
      res.writeHead(206, {
        "Content-Range": "bytes " + start + "-" + end + "/" + videoSize,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": "video/mp4",
      });

      // Open a read stream to the video in mongoDB
      const readStream = gridfsbucket.openDownloadStream(result._id, {
        start,
        end: end + 1,
      });

      // Pipe this stream to response back to frontend
      readStream.pipe(res);

      return;
    } else {
      res.writeHead(200, {
        "Content-Length": videoSize,
        "Content-Type": "video/mp4",
      });

      const readStream = gridfsbucket.openDownloadStream(result._id);

      readStream.pipe(res);
      readStream.on("end", () => res.end());
    }
  }
});

// Uses lazy loading. Frontend passes the lastPost to be rendered and limit.
router.post("/retrieve/post", async (req, res) => {
  const { group, limit, lastPost } = req.body;

  const query =
    lastPost != null
      ? {
          group: group,
          createdAt: {
            $lt: lastPost,
          },
        }
      : { group: group };

  await Post.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .then((data) => {
      return res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
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
