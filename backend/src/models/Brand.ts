import mongoose, { Document, Schema } from 'mongoose';

export interface IBrand {
    name: string;
    carModels: string[];
}

const brandSchema: Schema<IBrand> = new Schema({
    name: {type: String, required: true },
    carModels: [{ type: String }]
});

const Brand = mongoose.model<IBrand>('Brand', brandSchema);
export default Brand;
