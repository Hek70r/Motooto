import mongoose, { Document, Schema } from 'mongoose';


export interface IUser extends Document {
    username: string;
    email: string;
    phoneNumber: string;
    password: string;
    isAdmin: boolean;
    listings: mongoose.Types.ObjectId[];
    likedListings: mongoose.Types.ObjectId[];
    themeMode: 'light' | 'dark';
    resetToken: string | null;
    resetTokenExpiration: Date | null;
}

const userSchema: Schema<IUser> = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: false, unique: true, default: null },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    listings: [{ type: mongoose.Schema.ObjectId, ref: 'Listing' }],
    likedListings: [{ type: mongoose.Schema.ObjectId, ref: 'Listing' }],
    themeMode: { type: String, enum: ['light', 'dark'], default: 'light' },
    resetToken: { type: String, default: null },
    resetTokenExpiration: { type: Date, default: null },
});

const User = mongoose.model<IUser>('User', userSchema);
export default User;
