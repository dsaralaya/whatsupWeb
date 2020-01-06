import * as mongoose from "mongoose";

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  number: {
    type: String,
    required: true
  }
})
const Contact = mongoose.model("Contact", schema);
export default Contact;
