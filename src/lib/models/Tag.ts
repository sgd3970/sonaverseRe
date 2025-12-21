import mongoose, { Schema, Model, models } from 'mongoose';

export interface ITag {
    _id: mongoose.Types.ObjectId;
    name: {
        ko: string;
        en?: string;
    };
    slug: string;
    type: 'press' | 'story' | 'product' | 'general';
    color?: string;
    icon?: string;
    usage_count: number;
    related_tag_ids: mongoose.Types.ObjectId[];
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
    created_by?: mongoose.Types.ObjectId;
}

const TagSchema = new Schema<ITag>(
    {
        name: {
            ko: { type: String, required: true },
            en: { type: String },
        },
        slug: { type: String, required: true, unique: true, index: true },
        type: {
            type: String,
            enum: ['press', 'story', 'product', 'general'],
            default: 'general',
        },
        color: { type: String },
        icon: { type: String },
        usage_count: { type: Number, default: 0 },
        related_tag_ids: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
        is_active: { type: Boolean, default: true, index: true },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
        created_by: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

// Indexes
TagSchema.index({ type: 1, usage_count: -1 });

const Tag: Model<ITag> = models.Tag || mongoose.model<ITag>('Tag', TagSchema);

export default Tag;
