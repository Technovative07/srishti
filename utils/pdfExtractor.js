import fs from 'fs';
import pdfParse from 'pdf-parse';
import cloudinary from '../config/cloudinary.config.js';
import Report from '../model/report.model.js'; // adjust path if needed
import { v4 as uuidv4 } from 'uuid';

export const extractTextFromPDF = async (filePath, patientId, title = "Uploaded Report") => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at path: ${filePath}`);
    }

    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);

    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: 'raw',
      folder: 'hospital/reports',
      public_id: `report_${uuidv4()}`
    });

    const newReport = new Report({
      patientId,
      title,
      text: data.text,
      source: "PDF Upload",
      fileUrl: uploadResult.secure_url
    });

    await newReport.save();
    fs.unlinkSync(filePath); // clean up temp file

    return {
      success: true,
      message: "✅ Report uploaded and extracted successfully",
      report: newReport
    };
  } catch (error) {
    return {
      success: false,
      message: "❌ Failed to extract or upload report",
      error: error.message
    };
  }
};
