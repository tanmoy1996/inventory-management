import mongoose, { Document, Schema } from 'mongoose'

interface IPurchases extends Document {
  vendor: Schema.Types.ObjectId
  invoiceNo: string
  transactionDate: Date
  paymentType: 'credit' | 'cash'
  invoicePath: string
  transactionType: 'purchased' | 'returned'
  isPaid: boolean
  totalAmount: number
  grossAmount: number
  cgst: number
  sgst: number
  igst: number
  discount: number
  roundOff: number
  items: {
    _id: Schema.Types.ObjectId
    name: string
    quantity: number
    rate: number
    total: number
  }[]
}

const purchasesSchema: Schema = new Schema({
  vendor: {
    type: Schema.Types.ObjectId,
    ref: 'Vendors',
  },
  invoiceNo: {
    type: String,
    required: true,
  },
  transactionDate: {
    type: Date,
    required: true,
  },
  paymentType: {
    type: String,
    enum: ['credit', 'cash'],
    required: true,
  },
  invoicePath: {
    type: String,
    required: true,
  },
  transactionType: {
    type: String,
    enum: ['returned', 'purchased'],
    required: true,
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },  
  grossAmount: {
    type: Number,
    required: true,
  },
  cgst: {
    type: Number,
    required: true,
  },
  sgst: {
    type: Number,
    required: true,
  },
  igst: {
    type: Number,
  },
  discount: {
    type: Number,
  },
  roundOff: {
    type: Number,
  },
  items: {
    type: [Object],
    required: true,
  },
})

purchasesSchema.index({ invoiceNo: 1, transactionType: 1 }, { unique: true })

export default mongoose.models.Purchases || mongoose.model<IPurchases>('Purchases', purchasesSchema)
