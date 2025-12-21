import mongoose, { Schema, Model, models } from 'mongoose';

export interface IAdminUser {
    _id: mongoose.Types.ObjectId;
    email: string;
    password_hash: string;
    name: string;
    profile_image_id?: mongoose.Types.ObjectId;
    phone?: string;
    role: 'super_admin' | 'admin' | 'editor' | 'viewer';
    permissions: {
        press_releases: ('create' | 'read' | 'update' | 'delete')[];
        stories: ('create' | 'read' | 'update' | 'delete')[];
        products: ('create' | 'read' | 'update' | 'delete')[];
        inquiries: ('read' | 'update' | 'delete')[];
        analytics: ('read')[];
        settings: ('read' | 'update')[];
        users: ('create' | 'read' | 'update' | 'delete')[];
    };
    is_active: boolean;
    is_email_verified: boolean;
    email_verified_at?: Date;
    two_factor_enabled: boolean;
    two_factor_secret?: string;
    failed_login_attempts: number;
    locked_until?: Date;
    password_changed_at?: Date;
    last_login_at?: Date;
    last_login_ip?: string;
    last_activity_at?: Date;
    created_at: Date;
    updated_at: Date;
    created_by?: mongoose.Types.ObjectId;
    updated_by?: mongoose.Types.ObjectId;
    deleted_at?: Date;
}

const AdminUserSchema = new Schema<IAdminUser>(
    {
        email: { type: String, required: true, unique: true, index: true },
        password_hash: { type: String, required: true },
        name: { type: String, required: true },
        profile_image_id: { type: Schema.Types.ObjectId, ref: 'Image' },
        phone: { type: String },
        role: {
            type: String,
            enum: ['super_admin', 'admin', 'editor', 'viewer'],
            default: 'viewer',
            index: true,
        },
        permissions: {
            press_releases: [{ type: String, enum: ['create', 'read', 'update', 'delete'] }],
            stories: [{ type: String, enum: ['create', 'read', 'update', 'delete'] }],
            products: [{ type: String, enum: ['create', 'read', 'update', 'delete'] }],
            inquiries: [{ type: String, enum: ['read', 'update', 'delete'] }],
            analytics: [{ type: String, enum: ['read'] }],
            settings: [{ type: String, enum: ['read', 'update'] }],
            users: [{ type: String, enum: ['create', 'read', 'update', 'delete'] }],
        },
        is_active: { type: Boolean, default: true, index: true },
        is_email_verified: { type: Boolean, default: false },
        email_verified_at: { type: Date },
        two_factor_enabled: { type: Boolean, default: false },
        two_factor_secret: { type: String },
        failed_login_attempts: { type: Number, default: 0 },
        locked_until: { type: Date },
        password_changed_at: { type: Date },
        last_login_at: { type: Date },
        last_login_ip: { type: String },
        last_activity_at: { type: Date },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
        created_by: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
        updated_by: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
        deleted_at: { type: Date, index: true, sparse: true }, // Sparse index for soft deletes
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

// Indexes
AdminUserSchema.index({ is_active: 1, role: 1 });

const AdminUser: Model<IAdminUser> =
    models.AdminUser || mongoose.model<IAdminUser>('AdminUser', AdminUserSchema);

export default AdminUser;
