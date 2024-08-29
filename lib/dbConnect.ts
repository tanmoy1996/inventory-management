// lib/dbConnect.js
import mongoose from 'mongoose'

const connection: any = {}

async function dbConnect() {
  if (connection.isConnected) {
    return
  }

  const db = await mongoose.connect(process.env.MONGODB_URI as any, {})

  connection.isConnected = db.connections[0].readyState
}

export default dbConnect
