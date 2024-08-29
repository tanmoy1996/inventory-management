import mongoose, { Document, Schema } from 'mongoose'

interface IUsers extends Document {
  name: string
  email: string
  password: string
}

const usersSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
})
usersSchema.index({ email: 1 }, { unique: true })

export default mongoose.models.Users || mongoose.model<IUsers>('Users', usersSchema)
