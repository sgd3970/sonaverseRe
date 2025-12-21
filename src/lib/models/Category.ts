import mongoose, { Schema, Model, models } from 'mongoose';

export interface ICategory {
    _id: mongoose.Types.ObjectId;
    name: {
        ko: string;
        en?: string;
    };
    slug: string;
    description: {
        ko?: string;
        en?: string;
    };
    type: 'press' | 'story' | 'product' | 'faq';
    parent_id?: mongoose.Types.ObjectId;
    level: number;
    path: string;
    icon?: string;
    color?: string;
    image_id?: mongoose.Types.ObjectId;
    order: number;
    is_active: boolean;
    is_visible_in_menu: boolean;
    item_count: number;
    created_at: Date;
    updated_at: Date;
    created_by?: mongoose.Types.ObjectId;
    updated_by?: mongoose.Types.ObjectId;
}

const CategorySchema = new Schema<ICategory>(
    {
        name: {
            ko: { type: String, required: true },
            en: { type: String },
        },
        slug: { type: String, required: true, unique: true, index: true },
        description: {
            ko: String,
            en: String,
        },
        type: {
            type: String,
            enum: ['press', 'story', 'product', 'faq'],
            required: true,
        },
        parent_id: { type: Schema.Types.ObjectId, ref: 'Category' },
        level: { type: Number, default: 0 },
        path: { type: String, default: '' },
        icon: { type: String },
        color: { type: String },
        image_id: { type: Schema.Types.ObjectId, ref: 'Image' },
        order: { type: Number, default: 0 },
        is_active: { type: Boolean, default: true },
        is_visible_in_menu: { type: Boolean, default: false },
        item_count: { type: Number, default: 0 },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
        created_by: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
        updated_by: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

// Indexes
CategorySchema.index({ type: 1, parent_id: 1, order: 1 });
CategorySchema.index({ is_active: 1, is_visible_in_menu: 1 });
CategorySchema.index({ path: 1 });

const Category: Model<ICategory> =
    models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
