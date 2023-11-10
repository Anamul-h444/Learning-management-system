const mongoose = require("mongoose");

const faqSchema = mongoose.Schema({
  question: { type: String },
  answer: { type: String },
});

const categorySchema = mongoose.Schema({
  title: { type: String },
});

const bannerSchema = mongoose.Schema({
  public_id: { type: String },
  url: { type: String },
});

const layoutSchema = mongoose.Schema(
  {
    type: { type: String },
    faq: [faqSchema],
    categories: [categorySchema],
    banner: {
      Image: bannerSchema,
      title: { type: String },
      subTitle: { type: String },
    },
  },
  { timeStamps: true }
);

module.exports = mongoose.model("Layout", layoutSchema);
