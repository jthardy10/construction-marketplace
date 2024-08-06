import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  budget: number;
  clientId: mongoose.Types.ObjectId;
  status: 'open' | 'in_progress' | 'completed';
}

const ProjectSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['open', 'in_progress', 'completed'], default: 'open' }
}, { timestamps: true });

export default mongoose.model<IProject>('Project', ProjectSchema);
