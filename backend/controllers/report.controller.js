const Report = require("../models/Report");
const { uploadImage } = require("../config/cloudinary");
const { translateText } = require("../utils/translate");
const fs = require("fs");

exports.createReport = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      language = "en",
      adminLanguage = "en",
      reportedBy,
    } = req.body;

    /* ---------- VALIDATION ---------- */
    const errors = [];

    if (!title) errors.push("Title is required");
    if (!description || description.length < 10)
      errors.push("Description must be at least 10 characters");
    if (!category) errors.push("Category is required");
    if (!location) errors.push("Location is required");
    if (!reportedBy) errors.push("Reporter details are required");

    if (errors.length) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors,
      });
    }

    const parsedLocation = JSON.parse(location);
    const parsedReporter = JSON.parse(reportedBy);

    /* ---------- TRANSLATION ---------- */
    const translatedTitle = await translateText(title, language, adminLanguage);
    const translatedDescription = await translateText(
      description,
      language,
      adminLanguage
    );

    /* ---------- IMAGE UPLOAD ---------- */
    let imageData = {};
    if (req.file) {
      imageData = await uploadImage(req.file.path);
      fs.unlinkSync(req.file.path); // cleanup temp file
    }

    /* ---------- CREATE REPORT ---------- */
    const report = await Report.create({
      title: {
        original: title,
        translated: translatedTitle,
      },
      description: {
        original: description,
        translated: translatedDescription,
      },
      category,
      location: {
        address: parsedLocation.address,
        coordinates: {
          type: "Point",
          coordinates: [
            parsedLocation.coordinates.lng,
            parsedLocation.coordinates.lat,
          ],
        },
      },
      language,
      adminLanguage,
      image: imageData,
      reportedBy: parsedReporter,
    });

    /* ---------- RESPONSE ---------- */
    res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      data: {
        _id: report._id,
        title: report.title,
        description: report.description,
        category: report.category,
        status: report.status,
        priority: report.priority,
        language: report.language,
        image: report.image,
        createdAt: report.createdAt,
      },
    });
  } catch (error) {
    console.error("Create Report Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit report",
    });
  }
};
