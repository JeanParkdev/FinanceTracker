import mongoose from 'mongoose';


const transactionSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    isRecurring: {
        type: Boolean,
        default: false,
    },
    recurringFreq: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
        default: null,
    },
    description: {
        type: String,
        default: null,
    },
});

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;