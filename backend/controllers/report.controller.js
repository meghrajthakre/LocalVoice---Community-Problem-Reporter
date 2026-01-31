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

    /* ---------- SAFE JSON PARSE ---------- */
    let parsedLocation, parsedReporter;
    try {
      parsedLocation = JSON.parse(location);
      parsedReporter = JSON.parse(reportedBy);
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid JSON in location or reportedBy",
      });
    }

    /* ---------- TRANSLATION (ALWAYS) ---------- */
    const translatedTitle = await translateText(title, adminLanguage);
    const translatedDescription = await translateText(description, adminLanguage);

    /* ---------- IMAGE UPLOAD ---------- */
    let imageData = {};
    if (req.file) {
      imageData = await uploadImage(req.file.path);
      fs.unlinkSync(req.file.path);
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
      status: "new",
      priority: "medium",
      language,
      adminLanguage,
      image: imageData,
      reportedBy: parsedReporter,
    });

    return res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      data: report,
    });

  } catch (error) {
    console.error("Create Report Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit report",
    });
  }
};
