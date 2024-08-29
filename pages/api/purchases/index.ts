// Import necessary types and models from Next.js and local files
import type { NextApiRequest, NextApiResponse } from 'next'
import Purchase from '@/lib/models/purchases'
import Vendors from '@/lib/models/vendors'
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

  // Handle GET requests
  if (req.method === 'GET') {
    try {
      // Extract query parameters for search, filters, sorting, and pagination
      const { search, filters, sortBy, sortOrder, page, limit } = req.query

      // Parse and calculate pagination parameters
      const pageNumber = parseInt(page as string) || 1
      const pageSize = parseInt(limit as string) || 10
      const skip = (pageNumber - 1) * pageSize

      // Initialize the query object
      let query: any = {}

      // Apply search query if provided
      if (search) {
        query = {
          ...query,
          invoiceNo: { $regex: search as string, $options: 'i' },
        }
      }

      // Apply filters if provided
      if (filters) {
        // Parse filters from JSON string
        const parsedFilters = JSON.parse(filters as string)
        parsedFilters.forEach((filter: any) => {
          // Apply filters based on field type
          switch (filter.field) {
            case 'isPaid':
            case 'transactionType':
            case 'paymentType':
            case 'vendor':
            case 'boughtBy':
              query = { ...query, [filter.field]: filter.value }
              break
            case 'grossAmount':
            case 'transactionDate':
              query = {
                ...query,
                [filter.field]: {
                  $gte: filter.value[0],
                  $lte: filter.value[1],
                },
              }
              break
            default:
              // Placeholder for handling other filter types
              break
          }
        })
      }

      // Apply sorting
      const sortOptions: any = {}
      if (sortBy) {
        sortOptions[sortBy as string] = sortOrder === 'desc' ? -1 : 1
      }

      // Execute the query with pagination, sorting, and population of related documents
      const purchases = await Purchase.find(query)
        .populate([
          { path: 'vendor', model: Vendors },
        ])
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize)

      // Count total items for pagination
      const totalPurchases = await Purchase.countDocuments(query)
      const totalPages = Math.ceil(totalPurchases / pageSize)

      // Send the paginated list of items and total pages as response
      res.status(200).json({ purchases, totalPages })
    } catch (error: any) {
      // Handle errors by sending a 500 status code and the error message
      res.status(500).json({ error: error.message })
    }
  }

  // Handle POST requests
  else if (req.method === 'POST') {
    try {
      // Extract item details from the request body
      const { items } = req.body

      // Create the purchase document
      const purchase = new Purchase(req.body)
      await purchase.save()

      // Create purchase items and update inventory
      for (const item of items) {
        // Update inventory item quantity
        await Items.findByIdAndUpdate(
          item._id as string,
          { $inc: { quantity: req.body.transactionType==='purchased' ? +item.quantity : -item.quantity } }, //quantity increased
          { new: true }, // Return the updated item
        )
      }

      // Send the updated item as response
      res.status(201).json(purchase)
    } catch (error: any) {
      // Handle errors by sending a 400 status code and the error message
      res.status(400).json({ error: error.message })
    }
  } else {
    // Respond with a 405 status code for unsupported methods
    res.setHeader('Allow', ['GET', 'POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
