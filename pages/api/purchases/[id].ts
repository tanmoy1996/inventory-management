// Import necessary types and models from Next.js and local files
import type { NextApiRequest, NextApiResponse } from 'next'
import Purchase from '@/lib/models/purchases'
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
      // Extract item details from the request body
      const { items, ...itemData } = req.body

      // Update the purchase document
      const purchase = await Purchase.findByIdAndUpdate(req.query.id as string, itemData, { new: true })

      if (!purchase) {
        return res.status(404).json({ error: 'Purchase not found' })
      }

      // Update purchase items and inventory
      for (const item of purchase.items) {
        await Items.findByIdAndUpdate(
          item.item as string,
          { $inc: { quantity: -item.quantity } },
          { new: true }, // Return the updated item
        )
      }
      for (const item of items) {
        await Items.findByIdAndUpdate(
          item.item as string,
          { $inc: { quantity: +item.quantity } },
          { new: true }, // Return the updated item
        )
      }

      // Send the updated item as response
      res.status(200).json(purchase)
    } catch (error: any) {
      // Handle errors by sending a 400 status code and the error message
      res.status(400).json({ error: error.message })
    }
  } else if (req.method === 'DELETE') {
    try {
      // Update the purchase document
      const purchase = await Purchase.findById(req.query.id as string)

      if (!purchase) {
        return res.status(404).json({ error: 'Purchase not found' })
      }

      //TODO: Update items list, unlink items taken by mistake or link new items

      // Update inventory
      for (const item of purchase.items) {
        await Items.findByIdAndUpdate(
          item.item as string,
          { $inc: { quantity: -item.quantity } },
          { new: true }, // Return the updated item
        )
      }
      await Purchase.deleteOne(purchase)

      res.status(200).json(purchase)
    } catch (error: any) {
      // Handle errors by sending a 400 status code and the error message
      res.status(400).json({ error: error.message })
    }
  } else {
    // Respond with a 405 status code for unsupported methods
    res.setHeader('Allow', ['PUT', 'DELETE'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
