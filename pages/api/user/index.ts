// Import necessary types and models from Next.js and local files
import type { NextApiRequest, NextApiResponse } from "next";
import User from "@/lib/models/users";
import dbConnect from "@/lib/dbConnect";

/**
 * Handles API requests for vendors.
 * Supports GET requests for fetching vendors with optional search, filters, sorting, and pagination.
 * Supports POST requests for creating new vendor.
 * @param {NextApiRequest} req - The incoming request object.
 * @param {NextApiResponse} res - The response object to send back to the client.
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Connect to the database
  await dbConnect();

  // Handle GET requests
  if (req.method === "GET") {
    try {
      // Extract query parameters for search, filters, sorting, and pagination
      const { email } = req.query;

      // Initialize the query object
      let query: any = {};

      query = { email: email };

      // Execute the query with pagination, sorting, and population of related documents
      const user = await User.findOne(query)

      // Send the paginated list of items and total pages as response
      res.status(200).json(user);
    } catch (error: any) {
      // Handle errors by sending a 500 status code and the error message
      res.status(500).json({ error: error.message });
    }
  }
  else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
