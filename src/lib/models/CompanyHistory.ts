import mongoose, { Schema, Model, models } from 'mongoose';

export interface ICompanyHistory {
    _id: mongoose.Types.ObjectId;
    year: number;
    month?: number;
    day?: number;
    quarter?: 1 | 2 | 3 | 4;
    date?: Date;
    title: {
        ko: string;
        en?: string;
    };
    description: {
        ko?: string;
        en?: string;
    };
    content: {
        ko?: string;
        en?: string;
    };
    event_type: 'founding' | 'award' | 'certification' | 'product_launch' | 'partnership' | 'funding' | 'milestone' | 'other';
    category?: string;
    icon?: string;
    image_id?: mongoose.Types.ObjectId;
    image_ids: mongoose.Types.ObjectId[];
    related_press_release_ids: mongoose.Types.ObjectId[];
    related_story_ids: mongoose.Types.ObjectId[];
    external_links: {
        title: string;
        url: string;
    }[];
    order: number;
    is_active: boolean;
    is_major_event: boolean;
    highlight_color?: string;
    created_at: Date;
    updated_at: Date;
    created_by: mongoose.Types.ObjectId;
    updated_by?: mongoose.Types.ObjectId;
}

const CompanyHistorySchema = new Schema<ICompanyHistory>(
    {
        year: { type: Number, required: true },
        month: Number,
        day: Number,
        quarter: { type: Number, enum: [1, 2, 3, 4] },
        date: Date,
        title: {
            ko: { type: String, required: true },
            en: String,
        },
        description: {
            ko: String,
            en: String,
        },
        content: {
            ko: String,
            en: String,
        },
        event_type: {
            type: String,
            enum: ['founding', 'award', 'certification', 'product_launch', 'partnership', 'funding', 'milestone', 'other'],
            required: true,
        },
        category: String,
        icon: String,
        image_id: { type: Schema.Types.ObjectId, ref: 'Image' },
        image_ids: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
        related_press_release_ids: [{ type: Schema.Types.ObjectId, ref: 'PressRelease' }],
        related_story_ids: [{ type: Schema.Types.ObjectId, ref: 'SonaverseStory' }],
        external_links: [
            {
                title: String,
                url: String,
            },
        ],
        order: { type: Number, default: 0 },
        is_active: { type: Boolean, default: true },
        is_major_event: { type: Boolean, default: false },
        highlight_color: String,
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
        created_by: { type: Schema.Types.ObjectId, ref: 'AdminUser', required: true },
        updated_by: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

// Indexes
CompanyHistorySchema.index({ year: -1, month: -1, day: -1 });
CompanyHistorySchema.index({ is_active: 1, order: 1 });

const CompanyHistory: Model<ICompanyHistory> =
    models.CompanyHistory || mongoose.model<ICompanyHistory>('CompanyHistory', CompanyHistorySchema);

export default CompanyHistory;
