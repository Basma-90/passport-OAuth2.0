import { Document, Schema, model } from 'mongoose';

export interface IUser extends Document {
    googleId?: string;
    githubId?: string;
    displayName: string;
    email?: string;
}

const userSchema = new Schema<IUser>({
    googleId: { type: String, unique: true, sparse: true },
    githubId: { type: String, unique: true, sparse: true },
    displayName: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
});

const userModel = model<IUser>('User', userSchema);

export default userModel;
