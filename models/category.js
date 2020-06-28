const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cateSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", cateSchema);
module.exports = Category;
