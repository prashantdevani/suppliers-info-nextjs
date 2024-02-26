import mongoose from "mongoose";

export interface Supplier extends mongoose.Document {
    id: Number,
    name: String,
    address: String,
    zip: String,
    city: String,
    country: String,
}

/* PetSchema will correspond to a collection in your MongoDB database. */
const SupplierSchema = new mongoose.Schema<Supplier>({
    id: {
        type: Number,
        required: [true, "Please provide a id for this activity."],
    },
    name: {
        type: String,
        required: [true, "Please provide the supplier name"],
        maxlength: [60, "supplier's name cannot be more than 60 characters"],
    },
    address: {
        type: String,
        required: [true, "Please specify the address of supplier."],
    },
    zip: {
        type: String,
    },
    city: {
        type: String,
    },
    country: {
        type: String,
    }
});

export default mongoose.models.Supplier || mongoose.model<Supplier>("Supplier", SupplierSchema)