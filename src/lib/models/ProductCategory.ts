import mongoose, { Schema, Model, models } from 'mongoose';

export interface IProductCategory {
    _id: mongoose.Types.ObjectId;
    product_id: mongoose.Types.ObjectId;
    name: {
        ko: string;
        en?: string;
    };
    slug: string;
    description: {
        ko?: string;
        en?: string;
    };
    icon?: string;
    color?: string;
    image_id?: mongoose.Types.ObjectId;
    order: number;
    is_active: boolean;
    created_at: Date;
    updated_at: Date;
}

const ProductCategorySchema = new Schema<IProductCategory>(
    {
        product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
        name: {
            ko: { type: String, required: true },
            en: { type: String },
        },
        slug: { type: String, required: true },
        description: {
            ko: String,
            en: String,
        },
        icon: String,
        color: String,
        image_id: { type: Schema.Types.ObjectId, ref: 'Image' },
        order: { type: Number, default: 0 },
        is_active: { type: Boolean, default: true },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

// Indexes
ProductCategorySchema.index({ product_id: 1, order: 1 });
ProductCategorySchema.index({ slug: 1, is_active: 1 });

const ProductCategory: Model<IProductCategory> =
    models.ProductCategory || mongoose.model<IProductCategory>('ProductCategory', ProductCategorySchema);

export default ProductCategory;
