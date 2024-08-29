import mongoose, { Document, Schema } from 'mongoose'

interface IClients extends Document {
  name: string
  address: {
    street: string
    state: string
    pinCode: string
  }
  phoneNo: string
  gstNo: string
  bankDetails: {
    bankName: string
    bankBranch: string
    bankAccountNo: string
    bankIFSCCode: string
  }
}

const clientsSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: Object,
  },
  phoneNo: {
    type: String,
  },
  gstNo: {
    type: String,
  },
  bankDetails: {
    type: Object,
  },
})

clientsSchema.index({ name: 1, gstNo: 1 }, { unique: true })

export default mongoose.models.Clients || mongoose.model<IClients>('Clients', clientsSchema)
