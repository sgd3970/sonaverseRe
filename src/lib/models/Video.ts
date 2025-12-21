import mongoose, { Schema, Model, models } from 'mongoose';

export interface IVideo {
    _id: mongoose.Types.ObjectId;
    filename: string;
    original_filename: string;
    storage_provider: 'local' | 'vercel_blob' | 's3' | 'cloudinary' | 'youtube' | 'vimeo';
    path?: string;
    url: string;
    streaming_url?: string;
    youtube_id?: string;
    youtube_url?: string;
    vimeo_id?: string;
    mime_type?: string;
    size?: number;
    duration: number;
    width: number;
    height: number;
    aspect_ratio: string;
    format?: string;
    thumbnail_image_id?: mongoose.Types.ObjectId;
    thumbnail_url?: string;
    title: {
        ko?: string;
        en?: string;
    };
    description: {
        ko?: string;
        en?: string;
    };
    subtitles: {
        language: string;
        url: string;
        label: string;
    }[];
    category: 'product' | 'story' | 'tutorial' | 'interview' | 'event' | 'other';
    tags: string[];
    view_count: number;
    play_count: number;
    is_public: boolean;
    requires_auth: boolean;
    created_at: Date;
    updated_at: Date;
    created_by: mongoose.Types.ObjectId;
    deleted_at?: Date;
}

const VideoSchema = new Schema<IVideo>(
    {
        filename: { type: String, required: true, unique: true, index: true },
        original_filename: { type: String, required: true },
        storage_provider: {
            type: String,
            enum: ['local', 'vercel_blob', 's3', 'cloudinary', 'youtube', 'vimeo'],
            required: true,
        },
        path: String,
        url: { type: String, required: true },
        streaming_url: String,
        youtube_id: { type: String, index: true },
        youtube_url: String,
        vimeo_id: String,
        mime_type: String,
        size: Number,
        duration: { type: Number, default: 0 },
        width: { type: Number, default: 0 },
        height: { type: Number, default: 0 },
        aspect_ratio: String,
        format: String,
        thumbnail_image_id: { type: Schema.Types.ObjectId, ref: 'Image' },
        thumbnail_url: String,
        title: {
            ko: String,
            en: String,
        },
        description: {
            ko: String,
            en: String,
        },
        subtitles: [
            {
                language: String,
                url: String,
                label: String,
            },
        ],
        category: {
            type: String,
            enum: ['product', 'story', 'tutorial', 'interview', 'event', 'other'],
            default: 'other',
        },
        tags: [String],
        view_count: { type: Number, default: 0 },
        play_count: { type: Number, default: 0 },
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
VideoSchema.index({ category: 1, created_at: -1 });

const Video: Model<IVideo> = models.Video || mongoose.model<IVideo>('Video', VideoSchema);

export default Video;
