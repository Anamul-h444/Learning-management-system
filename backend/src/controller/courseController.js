const Courses = require("../models/Courses");
const cloudinary = require("cloudinary").v2;
const ejs = require("ejs");
const path = require("path");
const sendEmail = require("../mailer/sendEmail");
const Notification = require("../models/Notification");

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

    //find cousrse by course id
    const course = await Courses.findById(courseId);

    // if (!mongoose.Types.ObjectId.isValid(quiestionsId)) {
    //   return res.status(400).json({ message: "Invalid content ID" });
    // }

    //find course content by course data id (course data == course content)
    const courseContent = course?.courseData?.find(
      (item) => item._id.toString() === contentId
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

    //send notification to the admin about this question
    await Notification.create({
      user: req.user?._id,
      title: "New Question",
      message: `You have a new question from ${courseContent?.title}`,
    });

    // Save the updated course
    await course.save();
    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//add answer
module.exports.addAnswer = async (req, res) => {
  try {
    const { answer, courseId, contentId, questionId } = req.body;
    //find course by course id
    const course = await Courses.findById(courseId);

    //find content by course data by contentid from course > courseContent
    const courseContent = course?.courseData?.find(
      (item) => item._id.toString() === contentId
    );

    if (!courseContent) {
      return res.status(400).json({ message: "Invalid content id" });
    }

    //find question by question id from courseContent > questons
    const question = courseContent?.questions.find(
      (question) => question._id.toString() === questionId
    );
    if (!question) {
      return res.status(400).json({ message: "Invalid content id" });
    }
    //create a new answer object
    const newAnswer = {
      user: req.user,
      answer,
    };

    //add this answer in question replay
    question.questionReplies.push(newAnswer);

    await course.save();

    if (req.user?._id === question.user._id) {
      //create a notification
      await Notification.create({
        user: req.user?._id,
        title: "New question reply received",
        message: `You have a question reply from ${courseContent.title}`,
      });
    } else {
      const data = {
        name: question.user.name,
        title: courseContent.title,
        answer: answer,
      };
      try {
        // Get the path to the email template file
        const templatePath = path.join(
          __dirname,
          "../mailer/question-reply.ejs"
        );

        // Render the email template with ejs
        const html = await ejs.renderFile(templatePath, data);
        await sendEmail(question.user.email, "Question Reply", html);
      } catch (error) {
        res.status(500).json({ success: false, message: error.message });
      }
    }

    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//add review
module.exports.addReview = async (req, res) => {
  try {
    const userCourseList = req.user?.courses;
    const courseId = req.params.id;
    const courseExists = userCourseList?.some(
      (course) => course._id.toString() === courseId
    );
    if (!courseExists) {
      return res
        .status(400)
        .json({ message: "You are not eligible to access to this course" });
    }
    const course = await Courses.findById(courseId);
    const { review, rating } = req.body;
    const reviewData = {
      user: req.user,
      comment: review,
      rating,
    };
    course.reviews.push(reviewData);

    //calculate average rating
    let avg = 0;
    course?.reviews.forEach((review) => (avg += review.rating));

    //set course avg rating
    if (course) {
      course.rating = avg / course.reviews.length;
    }
    // 2 reviews 4* and 5* => 0+4+5 = 9 => 9/2 = 4.5

    await course.save();

    const notification = {
      title: "New Review Received",
      message: `${req.user.name} has given a review in ${course.name}`,
    };
    //creeate notification

    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//add reply to review
module.exports.addReplyToReview = async (req, res) => {
  try {
    const { comment, couresId, reviewId } = req.body;

    const course = await Courses.findById(couresId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const review = course?.reviews.find(
      (review) => review._id.toString() === reviewId
    );
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const replyData = {
      user: req.user,
      comment,
    };

    review.commentReplies.push(replyData);
    await course?.save();

    res.status(200).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//get all courses --only admin allowed
module.exports.getAllCoursesForAdmin = async (req, res) => {
  try {
    const courses = await Courses.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, courses });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//delete course --only admin is allowed
module.exports.deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Courses.findById(id);
    if (!course) {
      return res
        .status(400)
        .json({ success: false, message: "Course not found" });
    }

    await course.deleteOne({ _id: id });

    // Send success response
    res
      .status(200)
      .json({ success: true, message: "Course delete successful" });
  } catch (error) {
    // Handle the error and send an error response
    res.status(400).json({ success: false, message: error.message });
  }
};
