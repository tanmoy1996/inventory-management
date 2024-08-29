// Import necessary types and models from Next.js and local files
import type { NextApiRequest, NextApiResponse } from 'next'
import Bill from '@/lib/models/bills'
import Items from '@/lib/models/items'
import dbConnect from '@/lib/dbConnect'

/**
 * Handles API requests for inventory items.
 * Supports GET requests for fetching items with optional search, filters, sorting, and pagination.
 * Supports POST requests for creating new items.
 * @param {NextApiRequest} req - The incoming request object.
 * @param {NextApiResponse} res - The response object to send back to the client.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Connect to the database
  await dbConnect()

  // Handle PUT requests
  if (req.method === 'PUT') {
    try {
      const { items } = req.body

      // Update the bill document
      const bill = await Bill.findByIdAndUpdate(req.query.id as string, req.body, { new: true })

      if (!bill) {
        return res.status(404).json({ error: 'Bill not found' })
      }

      // Update bill items and inventory
      for (const item of bill.items) {
        await Items.findByIdAndUpdate(
          item.item as string,
          { $inc: { quantity: +item.quantity } }, //quantity increased
          { new: true }, // Return the updated item
        )
      }
      for (const item of items) {
        await Items.findByIdAndUpdate(
          item.item as string,
          { $inc: { quantity: -item.quantity } }, //quantity decreased
          { new: true }, // Return the updated item
        )
      }

      // Send the updated item as response
      res.status(200).json(bill)
    } catch (error: any) {
      // Handle errors by sending a 400 status code and the error message
      res.status(400).json({ error: error.message })
    }
  } else if (req.method === 'DELETE') {
    try {

      // Update the bill document
      const bill = await Bill.findById(req.query.id as string)

      if (!bill) {
        return res.status(404).json({ error: 'Bill not found' })
      }

      // Update bill items and inventory
      for (const item of bill.items) {
        await Items.findByIdAndUpdate(
          item.item as string,
          { $inc: { quantity: +item.quantity } }, //quantity increased
          { new: true }, // Return the updated item
        )
      }

      await Bill.deleteOne(bill)

      // Send the updated item as response
      res.status(200).json(bill)
    } catch (error: any) {
      // Handle errors by sending a 400 status code and the error message
      res.status(400).json({ error: error.message })
    }
  } else {
    // Respond with a 405 status code for unsupported methods
    res.setHeader('Allow', ['PUT'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
