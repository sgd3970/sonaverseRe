import mongoose, { Schema, Model, models } from 'mongoose';

export interface IImage {
    _id: mongoose.Types.ObjectId;
    filename: string;
    original_filename: string;
    storage_provider: 'local' | 'vercel_blob' | 's3' | 'cloudinary';
    path: string;
    url: string;
    public_url?: string;
    mime_type: string;
    size: number;
    width: number;
    height: number;
    aspect_ratio: string;
    format: 'webp' | 'avif' | 'jpg' | 'png' | 'gif' | 'svg';
    alt_text: {
        ko?: string;
        en?: string;
    };
    caption: {
        ko?: string;
        en?: string;
    };
    category: 'hero' | 'product' | 'story' | 'press' | 'profile' | 'logo' | 'icon' | 'common';
    tags: string[];
    is_optimized: boolean;
    optimization_version?: number;
    optimization_details?: {
        original_size: number;
        compressed_size: number;
        compression_ratio: number;
        quality: number;
    };
    dominant_color?: string;
    color_palette?: string[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exif?: Record<string, any>;
    usage_count: number;
    last_used_at?: Date;
    is_public: boolean;
    requires_auth: boolean;
    created_at: Date;
    updated_at: Date;
    created_by: mongoose.Types.ObjectId;
    deleted_at?: Date;
}

const ImageSchema = new Schema<IImage>(
    {
        filename: { type: String, required: true, unique: true, index: true },
        original_filename: { type: String, required: true },
        storage_provider: {
            type: String,
            enum: ['local', 'vercel_blob', 's3', 'cloudinary'],
            required: true,
        },
        path: { type: String, required: true },
        url: { type: String, required: true },
        public_url: { type: String },
        mime_type: { type: String, required: true },
        size: { type: Number, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true },
        aspect_ratio: { type: String, required: true },
        format: {
            type: String,
            enum: ['webp', 'avif', 'jpg', 'png', 'gif', 'svg'],
            required: true,
        },
        alt_text: {
            ko: String,
            en: String,
        },
        caption: {
            ko: String,
            en: String,
        },
        category: {
            type: String,
            enum: ['hero', 'product', 'story', 'press', 'profile', 'logo', 'icon', 'common'],
            required: true,
        },
        tags: [String],
        is_optimized: { type: Boolean, default: false },
        optimization_version: { type: Number },
        optimization_details: {
            original_size: Number,
            compressed_size: Number,
            compression_ratio: Number,
            quality: Number,
        },
        dominant_color: { type: String },
        color_palette: [String],
        exif: { type: Schema.Types.Mixed },
        usage_count: { type: Number, default: 0 },
        last_used_at: { type: Date },
        is_public: { type: Boolean, default: true },
        requires_auth: { type: Boolean, default: false },
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
        created_by: { type: Schema.Types.ObjectId, ref: 'AdminUser', required: true },
        deleted_at: { type: Date, sparse: true },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

// Indexes
ImageSchema.index({ category: 1, created_at: -1 });
ImageSchema.index({ is_optimized: 1, category: 1 });
ImageSchema.index({ tags: 1 });

const Image: Model<IImage> = models.Image || mongoose.model<IImage>('Image', ImageSchema);

export default Image;
