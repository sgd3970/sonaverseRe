import mongoose, { Schema, Model, models } from 'mongoose';

export interface INotification {
    _id: mongoose.Types.ObjectId;
    notification_id: string;
    type: 'inquiry' | 'system' | 'success' | 'warning' | 'error' | 'info';
    title: {
        ko: string;
        en?: string;
    };
    message: {
        ko: string;
        en?: string;
    };
    icon?: string;
    link?: string;
    is_read: boolean;
    read_at?: Date;
    target_user_id?: mongoose.Types.ObjectId;
    target_role?: string[];
    metadata?: {
        inquiry_id?: mongoose.Types.ObjectId;
        press_id?: mongoose.Types.ObjectId;
        story_id?: mongoose.Types.ObjectId;
        product_id?: mongoose.Types.ObjectId;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        [key: string]: any;
    };
    priority: 'low' | 'medium' | 'high' | 'urgent';
    expires_at?: Date;
    created_at: Date;
    created_by?: mongoose.Types.ObjectId;
}

const NotificationSchema = new Schema<INotification>(
    {
        notification_id: { type: String, required: true, unique: true },
        type: {
            type: String,
            enum: ['inquiry', 'system', 'success', 'warning', 'error', 'info'],
            required: true,
            index: true,
        },
        title: {
            ko: { type: String, required: true },
            en: String,
        },
        message: {
            ko: { type: String, required: true },
            en: String,
        },
        icon: String,
        link: String,
        is_read: { type: Boolean, default: false, index: true },
        read_at: Date,
        target_user_id: { type: Schema.Types.ObjectId, ref: 'AdminUser', index: true },
        target_role: [String],
        metadata: { type: Schema.Types.Mixed },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'urgent'],
            default: 'medium',
        },
        expires_at: Date,
        created_at: { type: Date, default: Date.now },
        created_by: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
    },
    {
        timestamps: false,
    }
);

// Indexes
NotificationSchema.index({ target_user_id: 1, is_read: 1, created_at: -1 });
NotificationSchema.index({ type: 1, created_at: -1 });
NotificationSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

const Notification: Model<INotification> = 
    models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;

