const mongoose = require("mongoose");
require("dotenv").config();

const reviewSchema = mongoose.Schema({
  user: Object,
  rating: { type: Number, default: 0 },
});

const linkSchema = mongoose.Schema({
  title: String,
  url: String,
});

const commentSchema = mongoose.Schema({
  user: Object,
  comment: String,
  commentReplies: [Object],
});

const courseDataSchema = mongoose.Schema({
  videoUrl: String,
  title: String,
  videoSection: String,
  description: String,
  videoLength: Number,
  videoPlayer: String,
  links: [linkSchema],
  suggestion: String,
  question: [commentSchema],
});

const courseSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    estimatePrice: { type: Number },
    thumbnail: {
      public_id: { type: String },
      url: { type: String },
    },
    tags: { type: String, required: true },
    level: { type: String, required: true },
    demoUrl: { type: String, required: true },
    benifits: { title: String },
    prerequisites: { title: String },
    reviews: [reviewSchema],
    courseData: [courseDataSchema],
    rating: { type: Number, default: 0 },
    purchased: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Courses", courseSchema);
