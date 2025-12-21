import mongoose, { Schema, Model, models } from 'mongoose';

export interface IProductImage {
    _id: mongoose.Types.ObjectId;
    product_id: mongoose.Types.ObjectId;
    variant_id?: mongoose.Types.ObjectId;
    image_id: mongoose.Types.ObjectId;
    type: 'hero' | 'thumbnail' | 'feature' | 'gallery' | 'detail' | 'lifestyle';
    alt_text: {
        ko?: string;
        en?: string;
    };
    caption: {
        ko?: string;
        en?: string;
    };
    order: number;
    is_primary: boolean;
    created_at: Date;
    updated_at?: Date;
}

const ProductImageSchema = new Schema<IProductImage>(
    {
        product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
        variant_id: { type: Schema.Types.ObjectId, ref: 'ProductVariant' },
        image_id: { type: Schema.Types.ObjectId, ref: 'Image', required: true },
        type: {
            type: String,
            enum: ['hero', 'thumbnail', 'feature', 'gallery', 'detail', 'lifestyle'],
            default: 'gallery',
        },
        alt_text: {
            ko: String,
            en: String,
        },
        caption: {
            ko: String,
            en: String,
        },
        order: { type: Number, default: 0 },
        is_primary: { type: Boolean, default: false },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

// Indexes
ProductImageSchema.index({ product_id: 1, type: 1, order: 1 });

const ProductImage: Model<IProductImage> =
    models.ProductImage || mongoose.model<IProductImage>('ProductImage', ProductImageSchema);

export default ProductImage;
