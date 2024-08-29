// Import necessary types and models from Next.js and local files
import type { NextApiRequest, NextApiResponse } from "next";
import Item from "@/lib/models/items";
import dbConnect from "@/lib/dbConnect";

/**
 * Handles API requests for updating inventory items.
 * Supports PUT requests for updating existing items.
 * @param {NextApiRequest} req - The incoming request object.
 * @param {NextApiResponse} res - The response object to send back to the client.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Connect to the database
  await dbConnect();

  // Handle PUT requests
  if (req.method === "PUT") {
    try {
      // Extract item details from the request body

      // Find the item by ID from the request query parameters
      let itemPresent = await Item.findById(req.query.id);
      if (!itemPresent) {
        // Return a 404 status code if the item is not found
        return res.status(404).json({ error: "Item not found" });
      }

      // Update the item with the new make and type IDs, and other item data
      const item = await Item.findByIdAndUpdate(
        req.query.id as string,
        req.body,
        { new: true } // Return the updated item
      );

      // Send the updated item as response
      res.status(200).json({ item });
    } catch (error: any) {
      // Handle errors by sending a 400 status code and the error message
      res.status(400).json({ error: error.message });
    }
  } else {
    // Respond with a 405 status code for unsupported methods
    res.setHeader("Allow", ["PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
