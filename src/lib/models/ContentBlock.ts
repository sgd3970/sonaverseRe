import mongoose, { Schema } from 'mongoose';

export interface IContentBlock {
    _id: mongoose.Types.ObjectId;
    type: 'paragraph' | 'heading' | 'image' | 'video' | 'quote' | 'list' | 'code' | 'callout' | 'divider' | 'embed' | 'table';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    content: any; // Flexible content based on type
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    style?: Record<string, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: Record<string, any>;
    order: number;
}

export const ContentBlockSchema = new Schema<IContentBlock>({
    type: {
        type: String,
        enum: ['paragraph', 'heading', 'image', 'video', 'quote', 'list', 'code', 'callout', 'divider', 'embed', 'table'],
        required: true,
    },
    content: { type: Schema.Types.Mixed, required: true },
    style: { type: Schema.Types.Mixed },
    data: { type: Schema.Types.Mixed },
    order: { type: Number, required: true },
}, { _id: true });
