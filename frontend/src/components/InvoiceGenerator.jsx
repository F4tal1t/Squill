import React from 'react';
import { jsPDF } from 'jspdf';
import { Button } from './ui/button';
import { FileText, Download } from 'lucide-react';

const InvoiceGenerator = ({ invoiceData }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Header with Sea Green theme
    doc.setFillColor(32, 178, 170); // Sea Green
    doc.rect(0, 0, 210, 50, 'F');
    
    // Logo area (square placeholder)
    doc.setFillColor(20, 20, 20); // Black
    doc.rect(15, 10, 30, 30, 'F');
    doc.setFillColor(32, 178, 170); // Sea Green
    doc.rect(17, 12, 26, 26, 'F');
    
    // Logo "S"
    doc.setTextColor(20, 20, 20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('S', 28, 32);
    
    // Company name
    doc.setTextColor(20, 20, 20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(32);
    doc.text('SQUILL', 55, 25);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text('SERVERLESS BILLING AUTOMATION', 55, 35);
    
    // Invoice title
    doc.setTextColor(20, 20, 20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(28);
    doc.text('INVOICE', 150, 25);
    
    // Invoice details with brutal styling
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text(`INVOICE ID: ${invoiceData.invoice_id || 'INV-2024-001'}`, 150, 35);
    doc.text(`DATE: ${invoiceData.date || new Date().toLocaleDateString()}`, 150, 42);
    doc.text(`DUE DATE: ${invoiceData.due_date || new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString()}`, 150, 49);
    
    // Company info
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('FROM:', 20, 65);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Squill Technologies Inc.', 20, 73);
    doc.text('AWS Serverless Billing Solutions', 20, 78);
    doc.text('San Francisco, CA 94105', 20, 83);
    doc.text('billing@squill.com', 20, 88);
    
    // Customer info
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('TO:', 120, 65);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(invoiceData.customer_name, 120, 73);
    doc.text('Customer ID: ' + (invoiceData.customer_id || 'N/A'), 120, 78);
    doc.text('Billing Period: Current Month', 120, 83);
    
    // AWS Services Breakdown Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('AWS SERVICES BREAKDOWN', 20, 105);
    
    // Table header
    doc.setFillColor(248, 249, 250);
    doc.rect(20, 115, 170, 12, 'F');
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('AWS Service', 25, 123);
    doc.text('Usage', 90, 123);
    doc.text('Rate', 130, 123);
    doc.text('Cost', 165, 123);
    
    // AWS Services breakdown
    const awsServices = [
      { service: 'API Gateway', usage: '15,000 requests', rate: '$0.001/req', cost: '$15.00' },
      { service: 'Lambda Functions', usage: '50,000 invocations', rate: '$0.0008/inv', cost: '$40.00' },
      { service: 'DynamoDB', usage: '25 GB storage', rate: '$0.25/GB', cost: '$6.25' },
      { service: 'S3 Storage', usage: '100 GB', rate: '$0.023/GB', cost: '$2.30' },
      { service: 'CloudWatch', usage: '1M metrics', rate: '$0.30/1M', cost: '$0.30' },
      { service: 'SES Email', usage: '1,000 emails', rate: '$0.10/1K', cost: '$0.10' },
      { service: 'EventBridge', usage: '500 events', rate: '$1.00/1M', cost: '$0.05' }
    ];
    
    let yPos = 135;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    
    awsServices.forEach((service, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(252, 252, 252);
        doc.rect(20, yPos - 4, 170, 8, 'F');
      }
      
      doc.text(service.service, 25, yPos);
      doc.text(service.usage, 90, yPos);
      doc.text(service.rate, 130, yPos);
      doc.text(service.cost, 165, yPos);
      yPos += 8;
    });
    
    // Subtotal section
    yPos += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('Subtotal (AWS Services):', 130, yPos);
    doc.text('$64.00', 165, yPos);
    
    yPos += 8;
    doc.text('Platform Fee (15%):', 130, yPos);
    doc.text('$9.60', 165, yPos);
    
    yPos += 8;
    doc.text('Tax (8.5%):', 130, yPos);
    doc.text('$6.26', 165, yPos);
    
    // Total section
    yPos += 15;
    doc.setFillColor(138, 43, 226);
    doc.rect(120, yPos - 8, 70, 15, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('TOTAL:', 125, yPos);
    doc.text(`$${invoiceData.total_amount || '79.86'}`, 160, yPos);
    
    // Payment info
    yPos += 25;
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('PAYMENT INFORMATION', 20, yPos);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    yPos += 8;
    doc.text('Payment Method: Auto-debit from AWS account', 20, yPos);
    yPos += 5;
    doc.text('Due Date: Net 30 days from invoice date', 20, yPos);
    yPos += 5;
    doc.text('Late Fee: 1.5% per month on overdue amounts', 20, yPos);
    
    // Footer
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.text('This invoice reflects your AWS resource consumption through Squill\'s billing platform.', 20, 270);
    doc.text('For support, contact: support@squill.com | Phone: +1 (555) 123-4567', 20, 275);
    
    doc.save(`squill-invoice-${invoiceData.invoice_id || 'latest'}.pdf`);
  };

  return (
    <Button 
      onClick={generatePDF} 
      size="sm" 
      variant="outline"
      className="h-7 px-2 text-xs"
    >
      <FileText className="h-3 w-3 mr-1" />
      PDF
    </Button>
  );
};

export default InvoiceGenerator;