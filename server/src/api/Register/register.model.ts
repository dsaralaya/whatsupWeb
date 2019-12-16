import * as mongoose from "mongoose";

const schema=new mongoose.Schema({
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
        type: String
    }
  })
const User = mongoose.model("User",schema);
export default User;
