import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
 username: string;
 email: string;
 password: string;
 role: 'client' | 'contractor';
}

const UserSchema: Schema = new Schema({
 username: { type: String, required: true, unique: true },
 email: { type: String, required: true, unique: true },
 password: { type: String, required: true },
 role: { type: String, enum: ['client', 'contractor'], required: true }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
