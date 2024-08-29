// Import necessary types and models from Next.js and local files
import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/dbConnect'
import Purchases from '@/lib/models/purchases'
import Bills from '@/lib/models/bills'
import Items from '@/lib/models/items'

/**
 * Handles API requests for inventory items.
 * Supports GET requests for fetching items with optional search, filters, sorting, and pagination.
 * Supports POST requests for creating new items.
 * @param {NextApiRequest} req - The incoming request object.
 * @param {NextApiResponse} res - The response object to send back to the client.
 */

const getFinancialYearDates = () => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  const startYear = currentMonth < 3 ? currentYear - 1 : currentYear
  const endYear = startYear + 1

  const startDate = new Date(startYear, 3, 1) // April 1st
  const endDate = new Date(endYear, 2, 31, 23, 59, 59, 999) // March 31st

  return { startDate, endDate }
}

const getPurchasesForCurrentFinancialYear = async (startDate: Date, endDate: Date) => {
  const results = await Purchases.aggregate([
    {
      $match: {
        transactionDate: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalPurchases: { $sum: 1 },
        grossAmount: { $sum: '$grossAmount' },
      },
    },
  ])

  if (results.length > 0) {
    return {
      totalPurchases: results[0].totalPurchases,
      grossAmount: results[0].grossAmount,
    }
  } else {
    return {
      totalPurchases: 0,
      grossAmount: 0,
    }
  }
}

const getBillsForCurrentFinancialYear = async (startDate: Date, endDate: Date) => {
  const results = await Bills.aggregate([
    {
      $match: {
        invoiceDate: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        _id: null,
        totalBills: { $sum: 1 },
        grossAmount: { $sum: '$grossAmount' },
      },
    },
  ])

  if (results.length > 0) {
    return {
      totalBills: results[0].totalBills,
      grossAmount: results[0].grossAmount,
    }
  } else {
    return {
      totalBills: 0,
      grossAmount: 0,
    }
  }
}

const getItemStats = async () => {
  const totalItems = await Items.countDocuments({})
  const zeroQuantityItems = await Items.countDocuments({ quantity: 0 })
  return { totalItems, zeroQuantityItems }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Connect to the database
  await dbConnect()

  // Handle GET requests
  if (req.method === 'GET') {
    try {
      const { startDate, endDate } = getFinancialYearDates()
      const purchaseData = await getPurchasesForCurrentFinancialYear(startDate, endDate)
      const salesData = await getBillsForCurrentFinancialYear(startDate, endDate)
      const itemData = await getItemStats()

      // Send the paginated list of items and total pages as response
      res.status(200).json({ purchase: purchaseData, sales: salesData, items: itemData })
    } catch (error: any) {
      // Handle errors by sending a 500 status code and the error message
      res.status(500).json({ error: error.message })
    }
  }

  // Handle POST requests
  else {
    // Respond with a 405 status code for unsupported methods
    res.setHeader('Allow', ['GET'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
