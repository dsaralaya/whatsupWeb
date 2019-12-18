import * as mongoose from "mongoose";

const schema = new mongoose.Schema({
  messageId: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
})
const ImageHistory = mongoose.model("ImageHistory", schema);
export default ImageHistory;
