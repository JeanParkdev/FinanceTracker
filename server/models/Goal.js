import mongoose from "mongoose";

const goalSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    targetAmount: {
        type: Number,
        required: true,
    },
    currentAmount: {
        type: Number,
        default: 0,
    },
    targetDate: {
        type: Date,
        required: true,
    },
    isComplete: {
        type: Boolean,
        default: false,
    },
    notes: {
        type: String,
        trim: true, 
        default: null,
    },
});

const Goal = mongoose.model('Goal', goalSchema);
export default Goal;