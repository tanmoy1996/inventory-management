// Import necessary types, libraries, and models from Next.js, formidable, fs, exceljs, and local files
import type { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm } from 'formidable'
import fs from 'fs'
import { Workbook } from 'exceljs'
import Client from '@/lib/models/clients'
import dbConnect from '@/lib/dbConnect'

/**
 * Processes an Excel file to extract clients.
 * @param {Buffer} fileBuffer - The buffer containing the Excel file data.
 * @returns {Promise<any[]>} - A promise that resolves to an array of clients.
 */
const processExcelFile = async (fileBuffer: Buffer) => {
  const workbook: any = new Workbook()
  await workbook.xlsx.load(fileBuffer)
  const worksheet = workbook.getWorksheet(1) // Assuming the data is in the first worksheet

  const clients: any = []
  worksheet.eachRow((row: any, rowNumber: any) => {
    if (rowNumber > 1) {
      // Skip header row
      const item = {
        name: row.getCell(2).value,
        address: {
          street: row.getCell(3).value,
          state: row.getCell(4).value,
          pinCode: row.getCell(5).value,
        },
        phoneNo: row.getCell(6).value,
        gstNo: row.getCell(7).value,
        bankDetails: {
          bankName: row.getCell(8).value,
          bankBranch: row.getCell(9).value,
          bankAccountNo: row.getCell(10).value,
          bankIFSCCode: row.getCell(11).value,
        },
      }
      clients.push(item)
    }
  })

  return clients
}

/**
 * Creates clients in the database based on the provided data.
 * @param {any[]} itemsData - An array of clientsdata.
 * @returns {Promise<{ succeed: number, failed: number }>} - A promise that resolves to an object containing the number of items successfully created and failed.
 */
const createClients = async (itemsData: any) => {
  let succeed = 0
  let failed = 0
  try {
    for (const itemData of itemsData) {
      // Check if an client with the same name and gst already exists
      let clientPresent = await Client.findOne({
        name: itemData.name,
        gst: itemData.gst,
      })

      if (clientPresent) {
        failed++
        continue
      }

      // Create the client documents
      const client = new Client(itemData)
      await client.save()
      succeed++
    }
    return {
      succeed,
      failed,
    }
  } catch (e) {
    console.log('Error is:', e)
    return new Error('Failed to Import')
  }
}

/**
 * Configuration for the API route to disable the default body parser.
 * This is necessary because we're using formidable to parse the form data.
 */
export const config = {
  api: {
    bodyParser: false,
  },
}

/**
 * Handles API requests for uploading and processing an Excel file to create clients.
 * Supports POST requests for uploading the file.
 * @param {NextApiRequest} req - The incoming request object.
 * @param {NextApiResponse} res - The response object to send back to the client.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Connect to the database
  await dbConnect()

  // Handle POST requests
  if (req.method === 'POST') {
    try {
      // Initialize formidable to parse the form data
      const form = new IncomingForm()
      form.parse(req, async (err: any, fields: any, files: any) => {
        if (err) {
          throw err
        }
        const file = files.files[0]
        if (!file || !file.filepath) {
          // Return a 404 status code if the file is not found or path is undefined
          res.status(404).end('File not found or path is undefined')
          return
        }

        // Read the file
        const fileBuffer = fs.readFileSync(file.filepath)

        // Process the Excel file to extract clients
        const clientList = await processExcelFile(fileBuffer)

        // Create clients in the database
        const createdItems = await createClients(clientList)

        // Send the result of the operation as response
        res.status(200).json({
          createdItems,
          message: 'Clients created successfully',
        })
      })
    } catch (error: any) {
      // Handle errors by sending a 500 status code and the error message
      res.status(500).json({ error: error.message })
    }
  } else {
    // Respond with a 405 status code for unsupported methods
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
