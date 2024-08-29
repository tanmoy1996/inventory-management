// Import necessary libraries and models from Next.js, exceljs, and local files
import { Workbook } from 'exceljs'
import type { NextApiRequest, NextApiResponse } from 'next'
import Item from '@/lib/models/items'
import dbConnect from '@/lib/dbConnect'

/**
 * Fetches inventory items from the database.
 * @returns {Promise<any[]>} - A promise that resolves to an array of inventory items.
 */
async function fetchInventoryItems() {
  // Fetch inventory items from the database, populating related 'make' and 'type' documents
  const inventoryItems = await Item.find()
    .populate({
      path: 'make type',
    })
    .exec()
  return inventoryItems
}

/**
 * Generates an Excel file containing inventory items.
 * @param {any[]} inventoryItems - An array of inventory items.
 * @returns {Promise<Buffer>} - A promise that resolves to a buffer containing the Excel file data.
 */
async function generateInventoryExcel(inventoryItems: any) {
  // Create a new workbook and add a worksheet named "Inventory"
  const workbook = new Workbook()
  const worksheet = workbook.addWorksheet('Inventory')

  // Define columns for the worksheet
  worksheet.columns = [
    { header: 'Sl. No.', key: 'itemId', width: 8 },
    { header: 'Description', key: 'description', width: 50 },
    { header: 'Make', key: 'make', width: 20 },
    { header: 'Type', key: 'type', width: 20 },
    { header: 'Unit', key: 'unit', width: 10 },
    { header: 'MRP', key: 'mrp', width: 10 },
    { header: 'SP', key: 'sp', width: 10 },
    { header: 'GST Code', key: 'gstCode', width: 10 },
    { header: 'GST (in %)', key: 'gstPercentage', width: 10 },
    { header: 'Quantity', key: 'quantity', width: 10 },
    // Add other fields as needed
  ]

  // Populate rows with inventory item data
  inventoryItems.forEach((item: any, idx: number) => {
    worksheet.addRow({
      itemId: idx + 1,
      description: item.description,
      make: item.make.name,
      type: item.type.name,
      unit: item.type.unit,
      mrp: item.mrp,
      sp: item.sp,
      gstCode: item.gstCode,
      gstPercentage: item.gstPercentage,
      quantity: item.quantity,
    })
  })

  // Write the workbook to a buffer
  const buffer = await workbook.xlsx.writeBuffer()
  return buffer
}

/**
 * Handles API requests for generating and downloading an Excel file of inventory items.
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
      // Fetch inventory items and generate an Excel file
      const inventoryItems = await fetchInventoryItems()
      const buffer = await generateInventoryExcel(inventoryItems)

      // Set headers to trigger file download
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      res.setHeader('Content-Disposition', 'attachment; filename=inventory.xlsx')
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
