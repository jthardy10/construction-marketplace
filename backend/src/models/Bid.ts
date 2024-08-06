import mongoose, { Document, Schema } from 'mongoose';

export interface IBid extends Document {
  projectId: mongoose.Types.ObjectId;
  contractorId: mongoose.Types.ObjectId;
  amount: number;
  proposal: string;
  status: 'pending' | 'accepted' | 'rejected';
}

const BidSchema: Schema = new Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  contractorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  proposal: { type: String, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model<IBid>('Bid', BidSchema);
