import mongoose, { Schema, Model, models } from 'mongoose';

export interface IAdminSession {
    _id: mongoose.Types.ObjectId;
    user_id: mongoose.Types.ObjectId;
    token: string;
    refresh_token: string;
    ip_address: string;
    user_agent: string;
    device_type: 'desktop' | 'mobile' | 'tablet';
    browser?: string;
    os?: string;
    location?: {
        country?: string;
        city?: string;
        latitude?: number;
        longitude?: number;
    };
    expires_at: Date;
    refresh_expires_at: Date;
    created_at: Date;
    last_used_at: Date;
    revoked_at?: Date;
    revoked_reason?: string;
}

const AdminSessionSchema = new Schema<IAdminSession>(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'AdminUser', required: true, index: true },
        token: { type: String, required: true, unique: true },
        refresh_token: { type: String, required: true, unique: true },
        ip_address: { type: String, required: true },
        user_agent: { type: String, required: true },
        device_type: { type: String, enum: ['desktop', 'mobile', 'tablet'], required: true },
        browser: { type: String },
        os: { type: String },
        location: {
            country: String,
            city: String,
            latitude: Number,
            longitude: Number,
        },
        expires_at: { type: Date, required: true, index: { expires: 0 } }, // TTL Index
        refresh_expires_at: { type: Date, required: true },
        created_at: { type: Date, default: Date.now },
        last_used_at: { type: Date, default: Date.now },
        revoked_at: { type: Date },
        revoked_reason: { type: String },
    },
    {
        timestamps: false, // We handle created_at manually or via default, updated_at is mostly last_used_at
    }
);

// Indexes
AdminSessionSchema.index({ user_id: 1, created_at: -1 });

const AdminSession: Model<IAdminSession> =
    models.AdminSession || mongoose.model<IAdminSession>('AdminSession', AdminSessionSchema);

export default AdminSession;
