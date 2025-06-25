import mongoose from 'mongoose';

const vaultItemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true
    },
    type: {
        type: String,
        required: [true, 'Type is required'],
        enum: ['password', 'document', 'note', 'license', 'identity']
    },
    data: {
        // For passwords
        username: String,
        password: String,
        website: String,

        // For documents
        documentType: String,
        documentNumber: String,
        issueDate: Date,
        expiryDate: Date,

        // For notes
        content: String,

        // For license keys
        productName: String,
        licenseKey: String,

        // Common fields
        notes: String
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    isEncrypted: {
        type: Boolean,
        default: false
    }
    }, 
    {
    timestamps: true
});

export default mongoose.model('VaultItem', vaultItemSchema);