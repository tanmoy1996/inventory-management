// Import necessary types and models from Next.js and local files
import type { NextApiRequest, NextApiResponse } from "next";
import Client from "@/lib/models/clients";
import dbConnect from "@/lib/dbConnect";

/**
 * Handles API requests for updating Clients.
 * Supports PUT requests for updating existing clients.
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
      // Update the client with the new item data
      const client = await Client.findByIdAndUpdate(
        req.query.id as string,
        req.body,
        { new: true } // Return the updated item
      );
      if (!client) {
        // Return a 404 status code if the client is not found
        return res.status(404).json({ error: "Client not found" });
      }

      // Send the updated item as response
      res.status(200).json(client);
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
