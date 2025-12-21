import mongoose, { Schema, Model, models } from 'mongoose';

export interface IProductVariant {
    _id: mongoose.Types.ObjectId;
    product_id: mongoose.Types.ObjectId;
    category_id?: mongoose.Types.ObjectId;
    name: {
        ko: string;
        en?: string;
    };
    sku?: string;
    description: {
        ko?: string;
        en?: string;
    };
    options: {
        name_ko: string;
        name_en?: string;
        value_ko: string;
        value_en?: string;
    }[];
    thumbnail_image_id?: mongoose.Types.ObjectId;
    image_ids: mongoose.Types.ObjectId[];
    price?: number;
    sale_price?: number;
    inventory: {
        track_inventory: boolean;
        quantity?: number;
        is_in_stock: boolean;
    };
    is_active: boolean;
    is_default: boolean;
    order: number;
    created_at: Date;
    updated_at: Date;
}

const ProductVariantSchema = new Schema<IProductVariant>(
    {
        product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
        category_id: { type: Schema.Types.ObjectId, ref: 'ProductCategory' },
        name: {
            ko: { type: String, required: true },
            en: { type: String },
        },
        sku: { type: String, sparse: true, unique: true },
        description: {
            ko: String,
            en: String,
        },
        options: [
            {
                name_ko: { type: String, required: true },
                name_en: String,
                value_ko: { type: String, required: true },
                value_en: String,
            },
        ],
        thumbnail_image_id: { type: Schema.Types.ObjectId, ref: 'Image' },
        image_ids: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
        price: Number,
        sale_price: Number,
        inventory: {
            track_inventory: { type: Boolean, default: true },
            quantity: { type: Number, default: 0 },
            is_in_stock: { type: Boolean, default: true },
        },
        is_active: { type: Boolean, default: true },
        is_default: { type: Boolean, default: false },
        order: { type: Number, default: 0 },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

// Indexes
ProductVariantSchema.index({ product_id: 1, is_active: 1, order: 1 });

const ProductVariant: Model<IProductVariant> =
    models.ProductVariant || mongoose.model<IProductVariant>('ProductVariant', ProductVariantSchema);

export default ProductVariant;
