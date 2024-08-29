// Import necessary types and models from Next.js and local files
import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/dbConnect'
import Purchases from '@/lib/models/purchases'
import Bills from '@/lib/models/bills'

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

const getMonthlyPurchaseVsSales = async (startDate: Date, endDate: Date) => {
  const pipeLine = [
    {
      $match: {
        transactionDate: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: { $month: '$transactionDate' },
        value: { $sum: '$grossAmount' },
      },
    },
    {
      $sort: { _id: 1 }, // Sort by month
    },
  ]
  // const SalesPipeline = [
  //   {
  //     $match: {
  //       invoiceDate: { $gte: startDate, $lte: endDate },
  //     },
  //   },
  //   {
  //     $group: {
  //       _id: { $month: '$invoiceDate' },
  //       value: { $sum: '$grossAmount' },
  //     },
  //   },
  //   {
  //     $sort: { _id: 1 }, // Sort by month
  //   },
  // ]

  const result = await Promise.all([
    Purchases.aggregate(pipeLine as any),
    Bills.aggregate(pipeLine as any),
  ])
  return result
}

const getBillStats = async (startDate: Date, endDate: Date) => {
  const pipeline = [
    {
      $match: {
        invoiceDate: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: null,
        totalBills: { $sum: 1 },
        paidBills: { $sum: { $cond: [{ $eq: ['$isPaymentReceived', true] }, 1, 0] } },
        unpaidBills: { $sum: { $cond: [{ $eq: ['$isPaymentReceived', false] }, 1, 0] } },
        totalReceivedAmount: { $sum: { $cond: [{ $eq: ['$isPaymentReceived', true] }, '$grossAmount', 0] } },
        totalPendingAmount: { $sum: { $cond: [{ $eq: ['$isPaymentReceived', false] }, '$grossAmount', 0] } }
      },
    },
  ]

  const result = await Bills.aggregate(pipeline)

  if (result.length > 0) {
    return {
      totalBills: result[0].totalBills,
      paidBills: result[0].paidBills,
      unpaidBills: result[0].unpaidBills,
      totalReceivedAmount:result[0].totalReceivedAmount,
      totalPendingAmount:result[0].totalPendingAmount,
    }
  } else {
    return {
      totalBills: 0,
      paidBills: 0,
      unpaidBills: 0,
    }
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Connect to the database
  await dbConnect()

  // Handle GET requests
  if (req.method === 'GET') {
    try {
      const { startDate, endDate } = getFinancialYearDates()
      const purchaseVsSalesData = await getMonthlyPurchaseVsSales(startDate, endDate)
      const billPieData = await getBillStats(startDate, endDate)

      // Send the paginated list of items and total pages as response
      res.status(200).json({ purchaseVsSalesData, billPieData })
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
