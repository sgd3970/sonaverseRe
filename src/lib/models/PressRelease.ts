import mongoose, { Schema, Model, models } from 'mongoose';

export interface IPressRelease {
    _id: mongoose.Types.ObjectId;
    slug: string;
    press_id: string;
    title: {
        ko: string;
        en?: string;
    };
    press_name: {
        ko: string;
        en?: string;
    };
    excerpt: {
        ko?: string;
        en?: string;
    };
    content: {
        ko: string;
        en?: string;
    };
    thumbnail_image_id?: mongoose.Types.ObjectId;
    featured_image_id?: mongoose.Types.ObjectId;
    gallery_image_ids: mongoose.Types.ObjectId[];
    external_url?: string;
    pdf_file_id?: mongoose.Types.ObjectId;
    category_id?: mongoose.Types.ObjectId;
    tags: mongoose.Types.ObjectId[];
    published_date: Date;
    is_published: boolean;
    is_featured: boolean;
    featured_order?: number;
    published_at?: Date;
    unpublished_at?: Date;
    view_count: number;
    like_count: number;
    share_count: number;
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
    version: number;
    is_latest_version: boolean;
    created_at: Date;
    updated_at: Date;
    created_by: mongoose.Types.ObjectId;
    updated_by?: mongoose.Types.ObjectId;
    deleted_at?: Date;
}

const PressReleaseSchema = new Schema<IPressRelease>(
    {
        slug: { type: String, required: true, unique: true, index: true },
        press_id: { type: String, required: true },
        title: {
            ko: { type: String, required: true },
            en: { type: String },
        },
        press_name: {
            ko: { type: String, required: true },
            en: { type: String },
        },
        excerpt: {
            ko: String,
            en: String,
        },
        content: {
            ko: { type: String, required: true },
            en: String,
        },
        thumbnail_image_id: { type: Schema.Types.ObjectId, ref: 'Image' },
        featured_image_id: { type: Schema.Types.ObjectId, ref: 'Image' },
        gallery_image_ids: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
        external_url: String,
        pdf_file_id: { type: Schema.Types.ObjectId, ref: 'File' }, // Assuming File model exists or generic
        category_id: { type: Schema.Types.ObjectId, ref: 'Category' },
        tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
        published_date: { type: Date, required: true },
        is_published: { type: Boolean, default: false, index: true },
        is_featured: { type: Boolean, default: false, index: true },
        featured_order: Number,
        published_at: Date,
        unpublished_at: Date,
        view_count: { type: Number, default: 0 },
        like_count: { type: Number, default: 0 },
        share_count: { type: Number, default: 0 },
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
        version: { type: Number, default: 1 },
        is_latest_version: { type: Boolean, default: true },
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
PressReleaseSchema.index({ published_date: -1, is_published: 1 });

const PressRelease: Model<IPressRelease> =
    models.PressRelease || mongoose.model<IPressRelease>('PressRelease', PressReleaseSchema);

export default PressRelease;
