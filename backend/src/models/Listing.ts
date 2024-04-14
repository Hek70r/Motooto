import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IListing extends Document {
    title: string;
    description: string;
    car: {
        brand: mongoose.Types.ObjectId;
        carModel: string;
        year: number;
        mileage: number;
        engineType: "diesel" | "gasoline" | "electric" | "hybrid";
        engineSize: number;
        price: number;
    };
    images: string[];
    seller: mongoose.Types.ObjectId;
    likedByUsers: mongoose.Types.ObjectId[];
}

const listingSchema: Schema<IListing> = new Schema({
        title: { type: String, required: true },
        description: { type: String, required: true },
        car: {
            brand: { type: mongoose.Schema.ObjectId, ref: 'Brand', required: true },
            carModel: { type: String, required: true },
            year: { type: Number, required: true },
            mileage: { type: Number, required: true },
            engineType: { type: String, enum: ["diesel", "gasoline", "electric", "hybrid"], required: true },
            engineSize: { type: Number, required: true },
            price: { type: Number, required: true },
        },
        images: [{ type: String, required: false }],
        seller: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
        likedByUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    },
    { timestamps: true }
);

const Listing = mongoose.model<IListing>('Listing', listingSchema);
export default Listing;
