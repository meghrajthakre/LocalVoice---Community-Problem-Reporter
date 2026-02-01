const express = require("express");
const router = express.Router();
const { userAuth } = require("../middlewares/authMiddleware.js");
const upload = require("../middlewares/upload.middleware");
const { createReport } = require("../controllers/report.controller");
const Report = require("../models/Report.js");
const { translateText } = require("../utils/translate");
const User = require("../models/User.js");
const { isAdmin } = require("../middlewares/adminAuth.js");

// to create a report
router.post(
  "/reports",
  upload.single("image"),
  createReport
);
// to get all reports with filters, pagination, sorting, and translation
router.get("/reports/all", async (req, res) => {
  try {
    const {
      language,
      status,
      category,
      priority,
      page = 1,
      limit,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const skip = (page - 1) * limit;
    const sortOrder = order === "asc" ? 1 : -1;

    const totalCount = await Report.countDocuments(filter);

    let reports = await Report.find(filter)
      .populate("reportedBy", "name email")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // 🔥 Translation logic
    if (language) {
      reports = await Promise.all(
        reports.map(async (report) => {
          const translatedTitle = await translateText(
            report.title.original,
            language
          );

          const translatedDescription = await translateText(
            report.description.original,
            language
          );

          return {
            ...report,
            title: {
              original: report.title.original,
              translated: translatedTitle,
            },
            description: {
              original: report.description.original,
              translated: translatedDescription,
            },
          };
        })
      );
    }

    res.status(200).json({
      success: true,
      count: totalCount,
      page: Number(page),
      totalPages: Math.ceil(totalCount / limit),
      data: reports,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch reports",
    });
  }
});

// to get a single report by ID with translation
router.get("/reports/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { language } = req.query;

    let report = await Report.findById(id)
      .populate("reportedBy", "name email")
      .lean();

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    // 🔥 Translation logic
    if (language) {
      const translatedTitle = await translateText(
        report.title.original,
        language
      );

      const translatedDescription = await translateText(
        report.description.original,
        language
      );

      report = {
        ...report,
        title: {
          original: report.title.original,
          translated: translatedTitle,
        },
        description: {
          original: report.description.original,
          translated: translatedDescription,
        },
      };
    }

    res.status(200).json({
      success: true,
      data: report,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch report",
    });
  }
});


// update report status
router.put("/reports/:id/status", userAuth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority } = req.body;

    // ✅ Allowed values
    const allowedStatus = ["new", "in-progress", "resolved"];
    const allowedPriority = ["low", "medium", "high"];

    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    if (priority && !allowedPriority.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Invalid priority value",
      });
    }

    // 🔍 Step 1: find report
    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    // ✏️ Step 2: update fields
    if (status) report.status = status;
    if (priority) report.priority = priority;

    // 💾 Step 3: save
    await report.save();

    res.status(200).json({
      success: true,
      message: "Report status updated successfully",
      data: {
        _id: report._id,
        status: report.status,
        priority: report.priority,
        updatedAt: report.updatedAt,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update report status",
    });
  }
});


// Admin adds a respond to a report (auto-translated to citizen's language).
router.post("/reports/:id/respond", userAuth, isAdmin, async (req, res) => {
  try {
    const { id } = req.params; // report ID
    const { text, respondedBy, language = "en" } = req.body;

    if (!text || !respondedBy) {
      return res.status(400).json({
        success: false,
        message: "Response text and respondedBy are required",
      });
    }

    // Find the report
    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    // Translate response to reporter's language
    let translatedText = text;
    if (report.language && report.language !== language) {
      translatedText = await translateText(text, report.language);
    }

    // Add response to report
    const responseData = {
      text: {
        original: text,
        translated: translatedText,
      },
      respondedBy,
      respondedByEmail: req.user?.email || "", // optional
      respondedAt: new Date(),
      language,
    };

    report.responses.push(responseData);
    await report.save();

    res.status(200).json({
      success: true,
      message: "Response added successfully",
      data: {
        _id: report._id,
        responses: report.responses,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add response",
    });
  }
});

// delete a report admin only

router.delete("/reports/:id", userAuth, isAdmin, async (req, res) => {
   try {
    const { id } = req.params;

    // Find the report
    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found",
      });
    }

    // Delete the report
    await Report.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Report deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete report",
    });
  
  }

});

module.exports = router;
