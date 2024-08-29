// Import necessary libraries and models from Next.js, exceljs, and local files
import { Workbook } from 'exceljs'
import type { NextApiRequest, NextApiResponse } from 'next'
import Purchase from '@/lib/models/purchases'
import Vendors from '@/lib/models/vendors'
import dbConnect from '@/lib/dbConnect'
/**
 * Fetches purchase items from the database.
 * @returns {Promise<any[]>} - A promise that resolves to an array of purchase items.
 */
async function fetchpurchases() {
  // Fetch purchase items from the database, populating related 'make' and 'type' documents
  const purchaseItems = await Purchase.find()
    .populate([
      { path: 'vendor', model: Vendors },
    ])
    .exec()
  return purchaseItems
}

/**
 * Generates an Excel file containing purchase items.
 * @param {any[]} purchaseItems - An array of purchase items.
 * @returns {Promise<Buffer>} - A promise that resolves to a buffer containing the Excel file data.
 */
async function generatePurchaseExcel(purchaseItems: any) {
  // Create a new workbook and add a worksheet named "Purchase"
  const workbook = new Workbook()
  const worksheet = workbook.addWorksheet('Purchase')

  // Define columns for the worksheet
  worksheet.columns = [
    { header: 'Sl. No.', key: 'itemId', width: 8 },
    { header: 'InvoiceNo', key: 'invoiceNo', width: 40 },
    { header: 'Date', key: 'trnsactionDate', width: 30 },
    { header: 'Vendor', key: 'vendorName', width: 20 },
    { header: 'Transaction type', key: 'transactionType', width: 10 },
    { header: 'Total Amount', key: 'totalAmount', width: 10 },
    { header: 'CGST', key: 'cgst', width: 10 },
    { header: 'SGST', key: 'sgst', width: 10 },
    { header: 'IGST', key: 'igst', width: 10 },
    { header: 'Discount', key: 'discount', width: 10 },
    { header: 'Round Off', key: 'roundOff', width: 10 },
    { header: 'Gross Amount', key: 'grossAmount', width: 10 },
    { header: 'Paid', key: 'isPaid', width: 5 },
    // Add other fields as needed
  ]

  // Populate rows with purchase item data
  purchaseItems.forEach((item: any, idx: number) => {
    worksheet.addRow({
      itemId: idx + 1,
      invoiceNo: item.invoiceNo,
      trnsactionDate: item.trnsactionDate.toISOString().split('T')[0],
      vendorName: item.vendor.name,
      transactionType: item.transactionType,
      totalAmount: item.totalAmount,
      cgst: item.cgst,
      sgst: item.sgst,
      igst: item.igst,
      discount: item.discount,
      deliveryCharges: item.deliveryCharges,
      shippingLoadingCharges: item.shippingLoadingCharges,
      roundOff: item.roundOff,
      grossAmount: item.grossAmount,
      isPaid: item.isPaid?'Yes':'No',
    })
  })

  // Write the workbook to a buffer
  const buffer = await workbook.xlsx.writeBuffer()
  return buffer
}

/**
 * Handles API requests for generating and downloading an Excel file of purchase items.
 * Supports GET requests for generating the Excel file.
 * @param {NextApiRequest} req - The incoming request object.
 * @param {NextApiResponse} res - The response object to send back to the client.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Connect to the database
  await dbConnect()

  // Handle GET requests
  if (req.method === 'GET') {
    try {
      // Fetch purchase items and generate an Excel file
      const purchaseItems = await fetchpurchases()
      const buffer = await generatePurchaseExcel(purchaseItems)

      // Set headers to trigger file download
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      res.setHeader('Content-Disposition', 'attachment; filename=purchase.xlsx')
      res.send(buffer)
    } catch (error) {
      // Handle errors by sending a 500 status code and an error message
      res.status(500).json({ error: 'Failed to generate Excel file' })
    }
  } else {
    // Respond with a 405 status code for unsupported methods
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}

// import React from 'react';

// function DownloadPurchaseButton() {
//  async function downloadPurchase() {
//     try {
//       const response = await fetch('/api/download-purchase', {
//         method: 'GET',
//       });

//       if (!response.ok) {
//         throw new Error('Failed to download purchase');
//       }

//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', 'purchase.xlsx');
//       document.body.appendChild(link);
//       link.click();
//       link.parentNode.removeChild(link);
//     } catch (error) {
//       console.error('Error downloading purchase:', error);
//     }
//  }

//  return (
//     <button onClick={downloadPurchase}>Download Purchase</button>
//  );
// }

// export default DownloadPurchaseButton;
