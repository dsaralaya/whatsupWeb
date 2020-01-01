import * as mongoose from "mongoose";

const schema = new mongoose.Schema({
  senderId: {
    type: String,
    required: true
  },
  assignedTo: {
    type: String,
    required: false
  },
  menuId: {
    type: String,
    required: false
  },
  lastUpdated: {
    type: Number,
    required: false
  }
})
const chatHistory = mongoose.model("chatHistory", schema);
export default chatHistory;
