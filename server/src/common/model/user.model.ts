import * as mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  userRole: {
    type: String,
    required: true
  },
  assignedChatCount: {
    type: Number
  },
  status: {
    type: String
  }
})
const User = mongoose.model("User", schema);
export default User;
