// Import necessary types and models from Next.js and local files
import type { NextApiRequest, NextApiResponse } from 'next'
import Item from '@/lib/models/items'
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
        query = { ...query, description: { $regex: search as string, $options: 'i' } }
      }

      // Apply filters if provided
      if (filters) {
        // Parse filters from JSON string
        const parsedFilters = JSON.parse(filters as string)
        parsedFilters.forEach((filter: any) => {
          // Apply filters based on field type
          switch (filter.field) {
            case 'quantity':
              query = { ...query, [filter.field]: filter.value }
              break
            default:
              // Placeholder for handling other filter types
              break
          }
        })
      }

      // Apply sorting
      let sortOptions: any = {}
      sortOptions['description'] = 1
      if (sortBy) {
        sortOptions[sortBy as string] = sortOrder === 'desc' ? -1 : 1
      }

      // Execute the query with pagination, sorting, and population of related documents
      const inventoryItems = await Item.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize)

      // Count total items for pagination
      const totalItems = await Item.countDocuments(query)
      const totalPages = Math.ceil(totalItems / pageSize)

      // Send the paginated list of items and total pages as response
      res.status(200).json({ inventoryItems, totalPages })
    } catch (error: any) {
      // Handle errors by sending a 500 status code and the error message
      res.status(500).json({ error: error.message })
    }
  }

  // Handle POST requests
  else if (req.method === 'POST') {
    try {

      // Check if an item with the same name and tags already exists
      let itemPresent = await Item.findOne({
        description: req.body.description,
      })
      if (itemPresent) {
        // Return an error if a duplicate item is found
        return res.status(400).json({ error: 'Item with same name and tags are present' })
      }

      // Create the item with the IDs of the make and type documents
      const item = new Item(req.body)
      await item.save()

      // Send the created item as response
      res.status(201).json(item)
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
