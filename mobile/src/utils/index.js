export const BACKENDPOINT = "http://10.0.0.139:4000";
import axios from "axios";

const monthNames = [
  "Jan",
  "Feb",
  "March",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const calculateTimeDifference = (timestamp) => {
  const postedTime = new Date(timestamp);
  const currTime = Date.now();
  const differenceMilliseconds = currTime - postedTime;
  const diffMinutes = Math.ceil(differenceMilliseconds / (1000 * 60));
  const diffHours = Math.ceil(differenceMilliseconds / (1000 * 3600));
  const diffDays = Math.ceil(diffHours / 24);

  if (diffMinutes <= 59) {
    return diffMinutes == 1
      ? `${diffMinutes} Minute ago`
      : `${diffMinutes} Minutes ago`;
  } else if (diffHours <= 24) {
    return diffHours == 1 ? `${diffHours} Hour ago` : `${diffHours} Hours ago`;
  } else if (diffDays <= 7) {
    return diffDays == 1 ? `${diffDays} Day ago` : `${diffDays} Days ago`;
  } else {
    return `${
      monthNames[postedTime.getMonth()]
    } ${postedTime.getDate()}, ${postedTime.getFullYear()}`;
  }
};

export const wait = (timeout) => {
  return new Promise((resolve) => setTimeout(resolve, timeout));
};

export const uploadMedia = async (bodyData, fileData, media) => {
  await axios
    .post(`${BACKENDPOINT}/Post/create/${media}`, bodyData, {
      headers: {
        accept: "application/json",
        "Content-Type": `multipart/form-data;}`,
      },
    })
    .then((res) => {
      res.data.map((file) => {
        fileData.push({
          filename: file.filename,
          filetype: file.contentType,
        });
      });
    })
    .catch((error) => {
      throw error;
    });
};

export const createPost = async (postData) => {
  await axios
    .post(`${BACKENDPOINT}/Post/create/post`, postData)
    .then((res) => {
      console.log(res.data);
    })
    .catch((error) => {
      throw error;
    });
};
