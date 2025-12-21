import mongoose, { Schema, Model, models } from 'mongoose';
import { ContentBlockSchema, IContentBlock } from './ContentBlock';

export interface ISonaverseStory {
    _id: mongoose.Types.ObjectId;
    slug: string;
    story_id: string;
    category: 'product_story' | 'usage' | 'health_info' | 'welfare_info' | 'company_news' | 'interview';
    category_id?: mongoose.Types.ObjectId;
    title: {
        ko: string;
        en?: string;
    };
    subtitle: {
        ko?: string;
        en?: string;
    };
    excerpt: {
        ko?: string;
        en?: string;
    };
    content: {
        ko: {
            body: string;
            blocks?: IContentBlock[];
        };
        en?: {
            body?: string;
            blocks?: IContentBlock[];
        };
    };
    thumbnail_image_id?: mongoose.Types.ObjectId;
    featured_image_id?: mongoose.Types.ObjectId;
    gallery_image_ids: mongoose.Types.ObjectId[];
    youtube_url?: string;
    youtube_video_id?: string;
    youtube_thumbnail_url?: string;
    video_ids: mongoose.Types.ObjectId[];
    related_product_ids: mongoose.Types.ObjectId[];
    related_story_ids: mongoose.Types.ObjectId[];
    tags: mongoose.Types.ObjectId[];
    is_main_story: boolean;
    main_story_order?: number;
    published_date: Date;
    is_published: boolean;
    is_featured: boolean;
    featured_order?: number;
    display_priority: number;
    published_at?: Date;
    author_name?: string;
    author_id?: mongoose.Types.ObjectId;
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

const SonaverseStorySchema = new Schema<ISonaverseStory>(
    {
        slug: { type: String, required: true, unique: true, index: true },
        story_id: { type: String, required: true },
        category: {
            type: String,
            enum: ['product_story', 'usage', 'health_info', 'welfare_info', 'company_news', 'interview'],
            required: true,
            index: true,
        },
        category_id: { type: Schema.Types.ObjectId, ref: 'Category' },
        title: {
            ko: { type: String, required: true },
            en: { type: String },
        },
        subtitle: {
            ko: String,
            en: String,
        },
        excerpt: {
            ko: String,
            en: String,
        },
        content: {
            ko: {
                body: { type: String, required: true },
                blocks: [ContentBlockSchema],
            },
            en: {
                body: String,
                blocks: [ContentBlockSchema],
            },
        },
        thumbnail_image_id: { type: Schema.Types.ObjectId, ref: 'Image' },
        featured_image_id: { type: Schema.Types.ObjectId, ref: 'Image' },
        gallery_image_ids: [{ type: Schema.Types.ObjectId, ref: 'Image' }],
        youtube_url: String,
        youtube_video_id: String,
        youtube_thumbnail_url: String,
        video_ids: [{ type: Schema.Types.ObjectId, ref: 'Video' }],
        related_product_ids: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
        related_story_ids: [{ type: Schema.Types.ObjectId, ref: 'SonaverseStory' }],
        tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
        is_main_story: { type: Boolean, default: false, index: true },
        main_story_order: Number,
        published_date: { type: Date, required: true },
        is_published: { type: Boolean, default: false, index: true },
        is_featured: { type: Boolean, default: false },
        featured_order: Number,
        display_priority: { type: Number, default: 0 },
        published_at: Date,
        author_name: String,
        author_id: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
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
SonaverseStorySchema.index({ published_date: -1, is_published: 1 });
SonaverseStorySchema.index({ is_main_story: 1, main_story_order: 1 });

const SonaverseStory: Model<ISonaverseStory> =
    models.SonaverseStory || mongoose.model<ISonaverseStory>('SonaverseStory', SonaverseStorySchema);

export default SonaverseStory;
