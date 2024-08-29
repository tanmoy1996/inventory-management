// Import necessary libraries and models from Next.js, exceljs, and local files
import { Workbook } from 'exceljs'
import type { NextApiRequest, NextApiResponse } from 'next'
import Client from '@/lib/models/clients'
import dbConnect from '@/lib/dbConnect'

/**
 * Fetches clients from the database.
 * @returns {Promise<any[]>} - A promise that resolves to an array of clients.
 */
async function fetchClients() {
  // Fetch clients from the database
  const clients = await Client.find().exec()
  return clients
}

/**
 * Generates an Excel file containing clients.
 * @param {any[]} clientItems - An array of clients.
 * @returns {Promise<Buffer>} - A promise that resolves to a buffer containing the Excel file data.
 */
async function generateClientsExcel(clientItems: any) {
  // Create a new workbook and add a worksheet named "Clients"
  const workbook = new Workbook()
  const worksheet = workbook.addWorksheet('Clients')

  // Define columns for the worksheet
  worksheet.columns = [
    { header: 'Sl. No.', key: 'itemId', width: 8 },
    { header: 'Name', key: 'name', width: 30 },
    { header: 'Address', key: 'address', width: 40 },
    { header: 'Phone No', key: 'phoneNo', width: 20 },
    { header: 'GST No', key: 'gstNo', width: 20 },
    { header: 'Bank Name', key: 'bankName', width: 10 },
    { header: 'Bank Branch', key: 'bankBranch', width: 10 },
    { header: 'Bank AccountNo', key: 'bankAccountNo', width: 20 },
    { header: 'Bank IFSC Code', key: 'bankIFSCCode', width: 10 },
    // Add other fields as needed
  ]

  // Populate rows with inventory item data
  clientItems.forEach((item: any, idx: number) => {
    worksheet.addRow({
      itemId: idx + 1,
      name: item.name,
      address: `${item.address.street}, ${item.address.state}, ${item.address.pinCode}`,
      phoneNo: item.phoneNo,
      gstNo: item.gstNo,
      bankName: item.bankDetails.bankName,
      bankBranch: item.bankDetails.bankBranch,
      bankAccountNo: item.bankDetails.bankAccountNo,
      bankIFSCCode: item.bankDetails.bankIFSCCode,
    })
  })

  // Write the workbook to a buffer
  const buffer = await workbook.xlsx.writeBuffer()
  return buffer
}

/**
 * Handles API requests for generating and downloading an Excel file of clients.
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
      // Fetch clients and generate an Excel file
      const clientItems = await fetchClients()
      const buffer = await generateClientsExcel(clientItems)

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
