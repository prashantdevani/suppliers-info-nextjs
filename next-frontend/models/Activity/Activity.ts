import mongoose from "mongoose";

export interface Activity extends mongoose.Document {
    id: Number,
    title: String,
    price: Number,
    currency: '$',
    rating: Number,
    specialOffer: Boolean,
    supplierId: Number
}

/* PetSchema will correspond to a collection in your MongoDB database. */
const ActivitySchema = new mongoose.Schema<Activity>({
    id: {
        type: Number,
        required: [true, "Please provide a id for this activity."],
    },
    title: {
        type: String,
        required: [true, "Please provide the activity title"],
        maxlength: [60, "Activity's title cannot be more than 60 characters"],
    },
    price: {
        type: Number,
        required: [true, "Please specify the price of activity."],
    },
    currency: {
        type: String,
    },
    rating: {
        type: Number,
    },
    supplierId: {
        type: Number,
    }
});

export default mongoose.models.Activity || mongoose.model<Activity>("Activity", ActivitySchema);