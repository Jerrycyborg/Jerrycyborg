import PDFDocument from 'pdfkit';
import type { Response } from 'express';

interface MonthlyReportOptions {
  parentName: string;
  monthLabel: string;
  summaries: { title: string; value: string }[];
  visits: { scheduledAt: string; status: string; caregiver?: string }[];
  checkIns: { createdAt: string; mood: string; note?: string | null }[];
}

export function streamMonthlyReport(res: Response, options: MonthlyReportOptions) {
  const doc = new PDFDocument({ margin: 50 });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="pariconnect-${options.parentName}-report.pdf"`);
  doc.pipe(res);

  doc.fontSize(20).fillColor('#141826').text(`PariConnect Monthly Report`, { align: 'left' });
  doc.moveDown();
  doc.fontSize(12).fillColor('#444444').text(`Parent: ${options.parentName}`);
  doc.text(`Period: ${options.monthLabel}`);
  doc.moveDown();

  doc.fontSize(14).fillColor('#118473').text('Highlights', { underline: true });
  options.summaries.forEach((summary) => {
    doc.fontSize(12).fillColor('#141826').text(`• ${summary.title}: ${summary.value}`);
  });
  doc.moveDown();

  doc.fontSize(14).fillColor('#118473').text('Visits', { underline: true });
  if (!options.visits.length) {
    doc.fontSize(12).fillColor('#141826').text('No visits completed this month.');
  } else {
    options.visits.forEach((visit) => {
      doc.fontSize(12).fillColor('#141826').text(
        `${new Date(visit.scheduledAt).toLocaleString()} — ${visit.status}${visit.caregiver ? ` by ${visit.caregiver}` : ''}`
      );
    });
  }
  doc.moveDown();

  doc.fontSize(14).fillColor('#118473').text('Check-ins', { underline: true });
  if (!options.checkIns.length) {
    doc.fontSize(12).fillColor('#141826').text('No check-ins recorded.');
  } else {
    options.checkIns.forEach((checkIn) => {
      doc
        .fontSize(12)
        .fillColor('#141826')
        .text(`${new Date(checkIn.createdAt).toLocaleString()} — Mood: ${checkIn.mood}${checkIn.note ? ` (${checkIn.note})` : ''}`);
    });
  }

  doc.end();
}
