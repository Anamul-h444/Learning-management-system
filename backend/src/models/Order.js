const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    courseId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    payment_info: {
      type: Object,
      //required: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
