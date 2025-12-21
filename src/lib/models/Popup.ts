import mongoose, { Schema, Model, models } from 'mongoose';

export interface IPopup {
    _id: mongoose.Types.ObjectId;
    popup_id: string;
    title: {
        ko: string;
        en?: string;
    };
    content: {
        ko: string;
        en?: string;
    };
    button_text: {
        ko?: string;
        en?: string;
    };
    button_link?: string;
    image_id?: mongoose.Types.ObjectId;
    background_color?: string;
    text_color?: string;
    position: 'center' | 'top' | 'bottom' | 'left' | 'right';
    size: 'small' | 'medium' | 'large' | 'fullscreen';
    start_date: Date;
    end_date?: Date;
    is_active: boolean;
    is_published: boolean;
    display_priority: number;
    target_audience?: {
        roles?: string[];
        locales?: string[];
    };
    view_count: number;
    click_count: number;
    created_at: Date;
    updated_at: Date;
    created_by: mongoose.Types.ObjectId;
    updated_by?: mongoose.Types.ObjectId;
    deleted_at?: Date;
}

const PopupSchema = new Schema<IPopup>(
    {
        popup_id: { type: String, required: true, unique: true },
        title: {
            ko: { type: String, required: true },
            en: String,
        },
        content: {
            ko: { type: String, required: true },
            en: String,
        },
        button_text: {
            ko: String,
            en: String,
        },
        button_link: String,
        image_id: { type: Schema.Types.ObjectId, ref: 'Image' },
        background_color: String,
        text_color: String,
        position: {
            type: String,
            enum: ['center', 'top', 'bottom', 'left', 'right'],
            default: 'center',
        },
        size: {
            type: String,
            enum: ['small', 'medium', 'large', 'fullscreen'],
            default: 'medium',
        },
        start_date: { type: Date, required: true },
        end_date: Date,
        is_active: { type: Boolean, default: true },
        is_published: { type: Boolean, default: false },
        display_priority: { type: Number, default: 0 },
        target_audience: {
            roles: [String],
            locales: [String],
        },
        view_count: { type: Number, default: 0 },
        click_count: { type: Number, default: 0 },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
        created_by: { type: Schema.Types.ObjectId, ref: 'AdminUser', required: true },
        updated_by: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
        deleted_at: { type: Date, sparse: true },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

// Indexes
PopupSchema.index({ is_active: 1, is_published: 1, start_date: 1, end_date: 1 });
PopupSchema.index({ display_priority: 1 });

const Popup: Model<IPopup> = models.Popup || mongoose.model<IPopup>('Popup', PopupSchema);

export default Popup;

