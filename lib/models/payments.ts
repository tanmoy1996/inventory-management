import mongoose, { Document, Schema } from 'mongoose'

interface IPayments extends Document {
  paymentDate: Date
  amount: number
  bills: Schema.Types.ObjectId
  purchases: Schema.Types.ObjectId
}

const paymentsSchema: Schema = new Schema({
  paymentDate: {
    type: Date,
    default: Date.now,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  bills: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bills'
  },
  purchases: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Purchases'
  },
})

export default mongoose.models.Payments || mongoose.model<IPayments>('Payments', paymentsSchema)
