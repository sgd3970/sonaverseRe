import mongoose, { Schema, Model, models } from 'mongoose';

export interface IProduct {
    _id: mongoose.Types.ObjectId;
    slug: string;
    product_id: string;
    sku?: string;
    type: 'manbo' | 'bodume' | 'accessory' | 'other';
    name: {
        ko: string;
        en?: string;
    };
    subtitle: {
        ko?: string;
        en?: string;
    };
    short_description: {
        ko?: string;
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
    hero_image_id?: mongoose.Types.ObjectId;
    thumbnail_image_id?: mongoose.Types.ObjectId;
    gallery_image_ids: mongoose.Types.ObjectId[];
    video_ids: mongoose.Types.ObjectId[];
    category_id?: mongoose.Types.ObjectId;
    subcategory_ids: mongoose.Types.ObjectId[];
    tags: mongoose.Types.ObjectId[];
    features: {
        ko: string[];
        en?: string[];
    };
    specifications: {
        key: string;
        value_ko: string;
        value_en?: string;
        unit?: string;
        order: number;
    }[];
    pricing: {
        retail_price?: number;
        sale_price?: number;
        discount_rate?: number;
        currency: string;
        tax_included: boolean;
        pricing_note_ko?: string;
        pricing_note_en?: string;
    };
    inventory: {
        track_inventory: boolean;
        quantity?: number;
        is_in_stock: boolean;
        low_stock_threshold?: number;
        allow_backorder: boolean;
    };
    purchase_options: {
        min_quantity: number;
        max_quantity?: number;
        requires_login: boolean;
        available_roles?: string[];
        purchase_link?: string;
    };
    shipping: {
        requires_shipping: boolean;
        weight?: number;
        weight_unit?: string;
        dimensions?: {
            length: number;
            width: number;
            height: number;
            unit: string;
        };
    };
    related_product_ids: mongoose.Types.ObjectId[];
    related_story_ids: mongoose.Types.ObjectId[];
    view_count: number;
    like_count: number;
    review_count: number;
    average_rating: number;
    seo: {
        meta_title_ko?: string;
        meta_title_en?: string;
        meta_description_ko?: string;
        meta_description_en?: string;
        keywords_ko?: string[];
        keywords_en?: string[];
        og_image_id?: mongoose.Types.ObjectId;
        canonical_url?: string;
    };
    display_order: number;
    is_active: boolean;
    is_featured: boolean;
    is_new: boolean;
    is_best: boolean;
    sales_start_at?: Date;
    sales_end_at?: Date;
    version: number;
    created_at: Date;
    updated_at: Date;
    created_by: mongoose.Types.ObjectId;
    updated_by?: mongoose.Types.ObjectId;
    deleted_at?: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        slug: { type: String, required: true, unique: true, index: true },
        product_id: { type: String, required: true, unique: true },
        sku: { type: String, sparse: true },
        type: {
            type: String,
            enum: ['manbo', 'bodume', 'accessory', 'other'],
            required: true,
            index: true,
        },
        name: {
            ko: { type: String, required: true },
            en: { type: String },
        },
        subtitle: {
            ko: String,
            en: String,
        },
        short_description: {
            ko: String,
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
        hero_image_id: { type: Schema.Types.ObjectId, ref: 'Image' },
        thumbnail_image_id: { type: Schema.Types.ObjectId, ref: 'Image' },
        gallery_image_ids: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
        video_ids: [{ type: Schema.Types.ObjectId, ref: 'Video' }],
        category_id: { type: Schema.Types.ObjectId, ref: 'Category', index: true },
        subcategory_ids: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
        tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
        features: {
            ko: [String],
            en: [String],
        },
        specifications: [
            {
                key: String,
                value_ko: String,
                value_en: String,
                unit: String,
                order: Number,
            },
        ],
        pricing: {
            retail_price: Number,
            sale_price: Number,
            discount_rate: Number,
            currency: { type: String, default: 'KRW' },
            tax_included: { type: Boolean, default: true },
            pricing_note_ko: String,
            pricing_note_en: String,
        },
        inventory: {
            track_inventory: { type: Boolean, default: true },
            quantity: { type: Number, default: 0 },
            is_in_stock: { type: Boolean, default: true },
            low_stock_threshold: Number,
            allow_backorder: { type: Boolean, default: false },
        },
        purchase_options: {
            min_quantity: { type: Number, default: 1 },
            max_quantity: Number,
            requires_login: { type: Boolean, default: false },
            available_roles: [String],
            purchase_link: String,
        },
        shipping: {
            requires_shipping: { type: Boolean, default: true },
            weight: Number,
            weight_unit: String,
            dimensions: {
                length: Number,
                width: Number,
                height: Number,
                unit: String,
            },
        },
        related_product_ids: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
        related_story_ids: [{ type: Schema.Types.ObjectId, ref: 'SonaverseStory' }],
        view_count: { type: Number, default: 0 },
        like_count: { type: Number, default: 0 },
        review_count: { type: Number, default: 0 },
        average_rating: { type: Number, default: 0 },
        seo: {
            meta_title_ko: String,
            meta_title_en: String,
            meta_description_ko: String,
            meta_description_en: String,
            keywords_ko: [String],
            keywords_en: [String],
            og_image_id: { type: Schema.Types.ObjectId, ref: 'Image' },
            canonical_url: String,
        },
        display_order: { type: Number, default: 0 },
        is_active: { type: Boolean, default: true, index: true },
        is_featured: { type: Boolean, default: false },
        is_new: { type: Boolean, default: false },
        is_best: { type: Boolean, default: false },
        sales_start_at: Date,
        sales_end_at: Date,
        version: { type: Number, default: 1 },
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
ProductSchema.index({ type: 1, is_active: 1, display_order: 1 });
ProductSchema.index({ is_featured: 1, display_order: 1 });

const Product: Model<IProduct> =
    models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
