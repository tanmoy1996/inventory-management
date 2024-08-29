import mongoose, { Document, Schema } from 'mongoose'

interface IItems extends Document {
  description: string
  unit: string
  mrp: number
  sp: number
  gstPercentage: number
  gstCode: string
  quantity: number
}

const itemsSchema: Schema = new Schema({
  description: {
    type: String,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },

  mrp: {
    type: Number,
    required: true,
  },
  sp: {
    type: Number,
  },
  gstPercentage: {
    type: Number,
    required: true,
  },
  gstCode: {
    type: String,
  },
  quantity: {
    type: Number,
    required: true,
  },
})

itemsSchema.index({ description: 1 }, { unique: true })

export default mongoose.models.Items || mongoose.model<IItems>('Items', itemsSchema)
