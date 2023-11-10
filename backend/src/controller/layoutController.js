const Layout = require("../models/Layout");
const cloudinary = require("cloudinary");

//create layout
module.exports.createLayout = async (req, res) => {
  try {
    const { type } = req.body;
    const isTypeExist = await Layout.findOne({ type });
    if (isTypeExist) {
      return res.status(400).json({ message: `${type} already exist` });
    }
    if (type === "Banner") {
      const { image, title, subTitle } = req.body;
      const myCloud = await cloudinary.v2.uploader.upload(image, {
        folder: "layout",
      });
      const banner = {
        image: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
        title,
        subTitle,
      };
      await Layout.create(banner);
    }

    if (type === "FAQ") {
      const { faq } = req.body;
      const faqItems = await Promise.all(
        faq.map(async (item) => ({
          question: item.question,
          answer: item.answer,
        }))
      );
      await Layout.create({ type: "FAQ", faq: faqItems });
    }

    if (type === "Categories") {
      const { categories } = req.body;
      const categoriesItems = await Promise.all(
        categories.map(async (item) => ({
          title: item.title,
        }))
      );
      await Layout.create({ type: "Categories", categories: categoriesItems });
    }

    res.status(200).json({ message: "Layout created successfull" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//edit layout
module.exports.editLayout = async (req, res) => {
  try {
    const { type } = req.body;
    const isTypeExist = await Layout.findOne({ type });

    if (type === "Banner") {
      const bannerData = await Layout.findOne({ type: "Banner" });
      const { image, title, subTitle } = req.body;
      if (bannerData) {
        await cloudinary.v2.uploader.destroy(bannerData.image.public_id);
      }
      const myCloud = await cloudinary.v2.uploader.upload(image, {
        folder: "layout",
      });
      const banner = {
        image: {
          public_id: myCloud.public_id,
          url: myCloud.secure_url,
        },
        title,
        subTitle,
      };
      await Layout.findByIdAndUpdate(bannerData?._id, { banner });
    }

    if (type === "FAQ") {
      const { faq } = req.body;
      const faqItem = await Layout.findOne({ type: "FAQ" });
      const faqItems = await Promise.all(
        faq.map(async (item) => ({
          question: item.question,
          answer: item.answer,
        }))
      );
      await Layout.findByIdAndUpdate(faqItem?._id, {
        type: "FAQ",
        faq: faqItems,
      });
    }

    if (type === "Categories") {
      const { categories } = req.body;
      const category = await Layout.findOne({ type: "Categories" });
      const categoriesItems = await Promise.all(
        categories.map(async (item) => ({
          title: item.title,
        }))
      );
      await Layout.findByIdAndUpdate(category?._id, {
        type: "Categories",
        categories: categoriesItems,
      });
    }

    res.status(200).json({ message: "Layout update  successfull" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

//get layout by type
module.exports.getLayoutByType = async (req, res) => {
  try {
    const layout = await Layout.findOne({ type: req.body.type });
    if (!layout) {
      res.status(400).json({ message: `${type} not found` });
    }
    res.status(200).json({ success: true, layout });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
