// Import necessary types and models from Next.js and local files
import type { NextApiRequest, NextApiResponse } from "next";
import Client from "@/lib/models/clients";
import dbConnect from "@/lib/dbConnect";

/**
 * Handles API requests for clients.
 * Supports GET requests for fetching clients with optional search, filters, sorting, and pagination.
 * Supports POST requests for creating new client.
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
      const { search, sortBy, sortOrder, page, limit } = req.query;

      // Parse and calculate pagination parameters
      const pageNumber = parseInt(page as string) || 1;
      const pageSize = parseInt(limit as string) || 10;
      const skip = (pageNumber - 1) * pageSize;

      // Initialize the query object
      let query: any = {};

      // Apply search query if provided
      if (search) {
        query = { ...query, name: { $regex: search as string, $options: "i" } };
      }

      // Apply sorting
      const sortOptions: any = {};
      if (sortBy) {
        sortOptions[sortBy as string] = sortOrder === "desc" ? -1 : 1;
      }

      // Execute the query with pagination, sorting, and population of related documents
      const clients = await Client.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize);

      // Count total items for pagination
      const totalClients = await Client.countDocuments(query);
      const totalPages = Math.ceil(totalClients / pageSize);

      // Send the paginated list of items and total pages as response
      res.status(200).json({ clients, totalPages });
    } catch (error: any) {
      // Handle errors by sending a 500 status code and the error message
      res.status(500).json({ error: error.message });
    }
  }

  // Handle POST requests
  else if (req.method === "POST") {
    try {
      // Check if an client with the same name and gst already exists
      let clientPresent = await Client.findOne({
        name: req.body.name,
        gst: req.body.gst,
      });
      if (clientPresent) {
        // Return an error if a duplicate client is found
        return res
          .status(400)
          .json({ error: "Client with same name and GST Number is present" });
      }
      // Create the client documents
      const client = new Client(req.body);
      await client.save();

      // Send the created item as response
      res.status(201).json(client);
    } catch (error: any) {
      // Handle errors by sending a 400 status code and the error message
      res.status(400).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
