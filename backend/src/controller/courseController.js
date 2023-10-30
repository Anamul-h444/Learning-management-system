const Courses = require("../models/Courses");
const cloudinary = require("cloudinary").v2;

module.exports.uploadCourse = async (req, res) => {
  try {
    const data = req.body;
    const thumbnail = data.thumbnail;
    //const thumbnailUrl = data.thumbnail.url;

    if (thumbnail) {
      const myCloud = await cloudinary.uploader.upload(thumbnail, {
        folder: "courses",
      });
      data.thumbnail = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }
    const course = await Courses.create(data);
    res.status(201).json({ success: true, message: "Course create success" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//edit course
module.exports.updateCourse = async (req, res) => {
  try {
    const data = req.body;
    const thumbnail = data.thumbnail;
    if (thumbnail) {
      await cloudinary.v2.uploader.distroy(thumbnail.public_id);
      const myCloud = await cloudinary.v2.uploader.upload(thumbnail, {
        folder: "courses",
      });
      data.thumbnail = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    const courseId = req.params.id;
    const course = await Courses.findByIdAndUpdate(
      courseId,
      { $set: data },
      { new: true }
    );
    res
      .status(200)
      .json({ success: true, message: "Course update successful" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
