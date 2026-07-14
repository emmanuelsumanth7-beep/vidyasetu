const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle, WidthType } = require('docx');

const doc = new Document({
  creator: "Antigravity AI",
  title: "Next-Generation School ERP Features, UI Design, and Cost Analysis",
  description: "Comprehensive feature list, detailed UI architecture, and infrastructure cost analysis per student.",
  sections: [
    {
      properties: {},
      children: [
        new Paragraph({
          text: "Vidya Setu: Next-Generation Smart School Application",
          heading: HeadingLevel.TITLE,
        }),
        new Paragraph({
          text: "Executive Summary, UI Architecture & Infrastructure Cost Analysis",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "This document outlines the complete UI/UX architecture, features, technology stack, and per-student infrastructure costs for the Next-Generation Smart School ERP platform, built strictly according to NEP 2020, DPDP Act 2023, and ISO 27001 standards.", italics: true }),
          ],
        }),
        
        new Paragraph({ text: "", spacing: { after: 200 } }),
        
        // --- COMPLETE UI DETAILS ---
        new Paragraph({
          text: "1. Complete UI/UX Architecture & Design System",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({
          text: "The platform's user interface is engineered to transcend traditional, clunky ERP systems. It utilizes a state-of-the-art Design System inspired by modern SaaS applications and Apple's Human Interface Guidelines (HIG), ensuring it feels like a premium consumer app rather than legacy enterprise software.",
        }),
        
        new Paragraph({ text: "A. Color Psychology & Tokens", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "• Primary Palettes: We use 'French Porcelain' (#f5f4f7) for backgrounds and 'Hudson' (#ebdbd3) for soft accents, providing a calming, premium canvas.", bullet: { level: 0 } }),
        new Paragraph({ text: "• Typography & Contrast: High-contrast 'Ink' colors (near black) for primary text to ensure absolute readability and accessibility.", bullet: { level: 0 } }),
        new Paragraph({ text: "• Strategic Accents: 'Interactive Blue' for primary actions and 'Structural Red' for critical alerts or crisis notifications.", bullet: { level: 0 } }),
        
        new Paragraph({ text: "B. Layout & Navigation Paradigms", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "• The Command Desk Canvas: Desktop users experience a sprawling, clean canvas layout.", bullet: { level: 0 } }),
        new Paragraph({ text: "• Floating Pill Navigation (Desktop): A modern, vertically-oriented floating dock on the left side, utilizing Framer Motion micro-animations (spring physics) that follow the user's active selection.", bullet: { level: 0 } }),
        new Paragraph({ text: "• Native Bottom Bar (Mobile): On mobile devices, the UI switches to a native-app style bottom navigation bar with haptic-like visual feedback, completely avoiding hamburger menus for primary routing.", bullet: { level: 0 } }),
        
        new Paragraph({ text: "C. The Premium Icon-Grid Dashboard", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "• Replacing boring data tables, the home screen features a stunning, responsive Icon-Grid.", bullet: { level: 0 } }),
        new Paragraph({ text: "• Each module (Attendance, Salary, Wellness) is represented by a large, bespoke Lucide icon housed inside a soft, pastel-gradient circle.", bullet: { level: 0 } }),
        new Paragraph({ text: "• Interaction Design: Hovering or tapping a module scales the icon gracefully and casts a dynamic drop-shadow, drawing the user in.", bullet: { level: 0 } }),
        
        new Paragraph({ text: "D. Specialized Module Interfaces", heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: "• Mental Wellness Safe Space: The clinical interface avoids harsh lines. It uses organic, rounded borders (32px border-radius) and soothing gradients to emotionally contain the student while they take psychological assessments (PHQ-A).", bullet: { level: 0 } }),
        new Paragraph({ text: "• Clinical Command Center: For counselors, the UI utilizes color-coded priority cards (Green/Orange/Red) to instantly highlight students in distress.", bullet: { level: 0 } }),
        new Paragraph({ text: "• Drafting-Style Approvals: Leave applications and document approvals are presented as 'physical sheets of paper' layered on the canvas, allowing principals to quickly scan and approve them.", bullet: { level: 0 } }),

        new Paragraph({ text: "", spacing: { after: 300 } }),

        // --- FEATURES ---
        new Paragraph({
          text: "2. Core Features & Capabilities",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({ text: "• Role-Based Access Control (RBAC): Dynamic UI that filters features (e.g., hiding 'Salary Slips' from students).", bullet: { level: 0 } }),
        new Paragraph({ text: "• Student & Staff Directory: Centralized information management.", bullet: { level: 0 } }),
        new Paragraph({ text: "• Academic Operations: Attendance tracking, Exam Marks, Study Material distribution.", bullet: { level: 0 } }),
        new Paragraph({ text: "• HR & Payroll: Digital Salary Slips and Staff Attendance.", bullet: { level: 0 } }),
        new Paragraph({ text: "• AI Timetable Generator: Automated conflict-free scheduling engine.", bullet: { level: 0 } }),
        
        new Paragraph({ text: "", spacing: { after: 200 } }),
        new Paragraph({
          text: "2. Advanced Security & Compliance Features",
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({ text: "• ISO 27001 Compliant Audit Trails: Middleware logs the IP address, action, and user ID of sensitive data interactions.", bullet: { level: 0 } }),
        new Paragraph({ text: "• Network Hardening: HTTP Strict Transport Security (HSTS), Content Security Policy (CSP), and aggressive Rate Limiting to prevent DoS attacks.", bullet: { level: 0 } }),

        new Paragraph({ text: "", spacing: { after: 400 } }),

        // --- COST ANALYSIS ---
        new Paragraph({
          text: "4. Infrastructure & Assumed Cost Analysis",
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({
          text: "Built on Next.js, Node.js (AWS EC2), PostgreSQL (AWS RDS), and Firebase.",
        }),
        
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ text: "Service", bold: true })] }),
                new TableCell({ children: [new Paragraph({ text: "Estimated Monthly Cost (USD)", bold: true })] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph("AWS Compute & RDS Database")] }),
                new TableCell({ children: [new Paragraph("$70 - $105")] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph("Miscellaneous (Domain, DNS, Email Auth)")] }),
                new TableCell({ children: [new Paragraph("Route53, SendGrid, etc.")] }),
                new TableCell({ children: [new Paragraph("$10")] }),
              ],
            }),
          ],
        }),

        new Paragraph({ text: "", spacing: { after: 200 } }),
        new Paragraph({
          text: "Total Estimated Infrastructure Cost: ~$102 to $150 per month / per school.",
          bold: true,
        }),
        
        new Paragraph({ text: "", spacing: { after: 200 } }),
        new Paragraph({
          text: "Per-Student Cost Analysis (Assuming 1,000 students):",
          heading: HeadingLevel.HEADING_2,
        }),
        new Paragraph({ text: "• Monthly Cloud Cost per Student: $0.125 USD (approx. ₹10.4 INR).", bold: true, bullet: { level: 0 } }),
        new Paragraph({ text: "• Annual Cloud Cost per Student: $1.50 USD (approx. ₹125 INR).", bold: true, bullet: { level: 0 } }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("/Users/sumanthemmanuel/Desktop/finalproto/Features_UI_and_Cost_Analysis.docx", buffer);
  console.log("Document created successfully at /Users/sumanthemmanuel/Desktop/finalproto/Features_UI_and_Cost_Analysis.docx");
});
