import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const generatePDF = (data, filename) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();

    const dirPath = path.join(__dirname, "../generated_pdfs");
    const outputPath = path.join(dirPath, filename);

    // Ensure directory exists
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    // Write content to the PDF
    doc.fontSize(20).text("Medical Details", { align: "center" }).moveDown();

    doc.fontSize(12).text(`Patient Name: ${data.patientName}`);
    doc.text(`Patient ID: ${data.patientId}`);
    doc.text(`Age: ${data.age}`);
    doc.text(`Gender: ${data.gender}`).moveDown();
    doc.text(`Doctor: Dr. ${data.doctorName}`);
    doc.text(`Specialization: ${data.specialization}`).moveDown();
    doc.text(`Diagnosis: ${data.diagnosis}`);
    doc.text(`Prescription: ${data.prescription}`);
    doc.text(`Date: ${new Date(data.date).toLocaleDateString()}`).moveDown();
    doc.text("This is a system-generated document.", {
      align: "center",
      oblique: true,
    });

    doc.end();

    stream.on("finish", () => resolve(outputPath));
    stream.on("error", (err) => reject(err));
  });
};

export default generatePDF;
