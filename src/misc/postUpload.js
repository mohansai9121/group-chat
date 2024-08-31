import { push, ref, set } from "firebase/database";
import { database } from "./firebase";

export const postUpload = ({ url, name, descripton }) => {
  if (!url) {
    console.log("Image url not defined");
    return;
  }
  const postData = {
    imgurl: url,
    info: descripton,
    user: name,
    timestamp: Date.now(),
  };
  const postRef = push(ref(database, "posts"));
  set(postRef, postData);
  alert("Image posted");
  console.log("Image uploaded to firebase");
};
