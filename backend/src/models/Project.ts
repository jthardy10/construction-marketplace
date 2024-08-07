import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
 title: string;
 description: string;
 budget: number;
 clientId: mongoose.Types.ObjectId;
 status: 'open' | 'in_progress' | 'completed';
 startDate: Date;
 endDate: Date;
 location: string;
 requiredSkills: string[];
 categories: string[];
 maxBids: number;
 milestones: {
   _id?: string;
   description: string;
   dueDate: Date;
   completed: boolean;
   paymentPercentage: number;
 }[];
}

const ProjectSchema: Schema = new Schema({
 title: { type: String, required: true },
 description: { type: String, required: true },
 budget: { type: Number, required: true },
 clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
 status: { type: String, enum: ['open', 'in_progress', 'completed'], default: 'open' },
 startDate: { type: Date, required: true },
 endDate: { type: Date, required: true },
 location: { type: String, required: true },
 requiredSkills: [{ type: String }],
 categories: [{ type: String }],
 maxBids: { type: Number, default: 10 },
 milestones: [{
   description: String,
   dueDate: Date,
   completed: { type: Boolean, default: false },
   paymentPercentage: Number
 }]
}, { timestamps: true });

export default mongoose.model<IProject>('Project', ProjectSchema);
