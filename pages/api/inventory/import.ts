// Import necessary types, libraries, and models from Next.js, formidable, fs, exceljs, and local files
import type { NextApiRequest, NextApiResponse } from 'next'
import { IncomingForm } from 'formidable'
import fs from 'fs'
import { Workbook } from 'exceljs'
import Item from '@/lib/models/items'
import dbConnect from '@/lib/dbConnect'

/**
 * Processes an Excel file to extract inventory items.
 * @param {Buffer} fileBuffer - The buffer containing the Excel file data.
 * @returns {Promise<any[]>} - A promise that resolves to an array of inventory items.
 */
const processExcelFile = async (fileBuffer: Buffer) => {
  const workbook: any = new Workbook()
  await workbook.xlsx.load(fileBuffer)
  const worksheet = workbook.getWorksheet(1) // Assuming the data is in the first worksheet

  const inventoryItems: any = []
  worksheet.eachRow((row: any, rowNumber: any) => {
    if (rowNumber > 1) {
      // Skip header row
      const item = {
        description: row.getCell(2).value,
        unit: row.getCell(3).value,
        mrp: row.getCell(4).value,
        sp: row.getCell(5).value,
        gstPercentage: row.getCell(6).value,
        gstCode: row.getCell(7).value,
        quantity: row.getCell(8).value,
        // Add other fields as necessary
      }
      inventoryItems.push(item)
    }
  })

  return inventoryItems
}

/**
 * Creates inventory items in the database based on the provided data.
 * @param {any[]} itemsData - An array of inventory item data.
 * @returns {Promise<{ succeed: number, failed: number }>} - A promise that resolves to an object containing the number of items successfully created and failed.
 */
const createInventoryItems = async (itemsData: any) => {
  let succeed = 0
  let failed = 0
  try {
    for (const itemData of itemsData) {

      // Check if an item with the same name and tags already exists
      let itemPresent = await Item.findOne({
        description: itemData.description,
      })
      if (itemPresent) {
        failed++
        continue
      }

      // Create the item with the IDs of the make and type documents
      const item = new Item(itemData)
      await item.save()

      succeed++
    }
    return {
      succeed,
      failed,
    }
  } catch (e) {
    throw new Error('File Validation Error')
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
 * Handles API requests for uploading and processing an Excel file to create inventory items.
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

        // Process the Excel file to extract inventory items
        const inventoryItems = await processExcelFile(fileBuffer)

        // Create inventory items in the database
        const createdItems = await createInventoryItems(inventoryItems)

        // Send the result of the operation as response
        res.status(200).json({
          createdItems,
          message: 'Inventory items created successfully',
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

// import React, { useState } from 'react';

// function UploadForm() {
//  const [file, setFile] = useState(null);

//  const handleSubmit = async (event) => {
//     event.preventDefault();

//     const formData = new FormData();
//     formData.append('file', file);

//     const response = await fetch('/api/upload-inventory', {
//       method: 'POST',
//       body: formData,
//     });

//     if (response.ok) {
//       alert('Inventory items created successfully');
//     } else {
//       alert('Failed to create inventory items');
//     }
//  };

//  return (
//     <form onSubmit={handleSubmit}>
//       <input type="file" onChange={(e) => setFile(e.target.files[0])} />
//       <button type="submit">Upload</button>
//     </form>
//  );
// }

// export default UploadForm;
