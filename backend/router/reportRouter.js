const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const { createReport } = require("../controllers/report.controller");

router.post(
  "/reports",
  upload.single("image"),
  createReport
);

router.get("/reports/all", async (req, res) => {
  try {
    const {
      language,
      status,
      category,
      priority,
      page = 1,
      limit = 10,
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

module.exports = router;
