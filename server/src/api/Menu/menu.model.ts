import * as mongoose from "mongoose";

const schema = new mongoose.Schema({
  menuId: {
    type: String,
    required: true
  },
  menuType: {
    type: String,
    required: true
  },
  file: {
    type: String,
    required: false
  },
  text: {
    type: String,
    required: true
  },
  option1: {
    type: String,
    required: false
  },
  option2: {
    type: String,
    required: false
  },
  option3: {
    type: String,
    required: false
  },
  option4: {
    type: String,
    required: false
  },
  option5: {
    type: String,
    required: false
  }
})
const Menu = mongoose.model("Menu", schema);
export default Menu;
