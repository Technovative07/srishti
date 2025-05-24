import { generateReportSummary, generateReportDraft } from "./aiService.js";

// Suppose inside your existing report controller

export const getSummaryForReport = async (req, res) => {
  const { id } = req.params;
  const { language } = req.query; // Get language from query param or default to 'en'

  try {
    const report = await Report.findById(id)
      .populate("patientName", "name")
      .populate("doctorName", "name");

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    const summary = await generateReportSummary(report, language || "en");
    res.json({ summary, language: language || "en" });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate summary" });
  }
};
