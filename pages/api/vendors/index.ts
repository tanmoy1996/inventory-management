// Import necessary types and models from Next.js and local files
import type { NextApiRequest, NextApiResponse } from "next";
import Vendor from "@/lib/models/vendors";
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
      const vendors = await Vendor.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize);

      // Count total items for pagination
      const totalVendors = await Vendor.countDocuments(query);
      const totalPages = Math.ceil(totalVendors / pageSize);

      // Send the paginated list of items and total pages as response
      res.status(200).json({ vendors, totalPages });
    } catch (error: any) {
      // Handle errors by sending a 500 status code and the error message
      res.status(500).json({ error: error.message });
    }
  }

  // Handle POST requests
  else if (req.method === "POST") {
    try {
      // Check if an vendor with the same name and gst already exists
      let vendorPresent = await Vendor.findOne({
        name: req.body.name,
        gst: req.body.gst,
      });
      if (vendorPresent) {
        // Return an error if a duplicate vendor is found
        return res
          .status(400)
          .json({ error: "Vendor with same name and GST Number is present" });
      }
      // Create the vendor documents
      const vendor = new Vendor(req.body);
      await vendor.save();

      // Send the created item as response
      res.status(201).json(vendor);
    } catch (error: any) {
      // Handle errors by sending a 400 status code and the error message
      res.status(400).json({ error: error.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
