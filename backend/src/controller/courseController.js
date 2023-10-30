const { default: mongoose } = require("mongoose");
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

//get single course without purchase
module.exports.getSingleCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const course = await Courses.findById(courseId).select(
      "-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.links"
    );

    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//get all courses without purchase
module.exports.getAllCourses = async (req, res) => {
  try {
    const course = await Courses.find().select(
      "-courseData.videoUrl -courseData.suggestion -courseData.question -courseData.links"
    );

    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// get course content - only valid user
module.exports.getCourseByUser = async (req, res) => {
  try {
    const userCourseList = req.user?.courses;
    const courseId = req.params.id;

    // Check if userCourseList is not null and course exists in it
    const courseExists = userCourseList?.some(
      (course) => course._id.toString() === courseId
    );

    if (!courseExists) {
      return res
        .status(403) // 403 Forbidden status code is more appropriate here
        .json({
          success: false,
          message: "You are not eligible to access this course",
        });
    }

    // Find the course by its ID in the Courses model
    const course = await Courses.findById(courseId);

    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    const content = course.courseData;

    res.status(200).json({ success: true, content });
  } catch (error) {
    res
      .status(500) // 500 Internal Server Error for unexpected errors
      .json({ success: false, message: error.message });
  }
};

// add question in course
module.exports.addQuestion = async (req, res) => {
  try {
    const { question, courseId, contentId } = req.body;
    const course = await Courses.findById(courseId);

    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      return res.status(400).json({ message: "Invalid content ID" }); // Changed the error message
    }

    const courseContent = course?.courseData?.find(
      (item) => item._id.toString() === contentId // Corrected the comparison
    );

    if (!courseContent) {
      return res.status(400).json({ message: "Invalid content id" });
    }

    // Create a new question object
    const newQuestion = {
      user: req.user,
      question,
      questionReplies: [],
    };

    // Add this question to our course content
    courseContent.questions.push(newQuestion);

    // Save the updated course
    await course.save();
    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
