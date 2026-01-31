const express = require("express");
const router = express.Router();
const upload = require("../middlewares/upload.middleware");
const { createReport } = require("../controllers/report.controller");

router.post(
  "/reports",
  upload.single("image"),
  createReport
);

module.exports = router;
