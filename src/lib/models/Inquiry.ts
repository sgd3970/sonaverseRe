import mongoose, { Schema, Model, models } from 'mongoose';

export interface IInquiry {
    _id: mongoose.Types.ObjectId;
    inquiry_number: string;
    inquiry_type: 'service_introduction' | 'product_inquiry' | 'quote_request' | 'demo_request' | 'technical_support' | 'partnership_proposal' | 'technical_partnership' | 'channel_partnership' | 'investment_ir' | 'press_pr' | 'recruitment' | 'complaint' | 'suggestion' | 'other';
    inquiry_type_label: {
        ko: string;
        en?: string;
    };
    inquirer: {
        name: string;
        position?: string;
        company_name?: string;
        phone_number: string;
        email: string;
        country?: string;
        language: 'ko' | 'en';
    };
    subject?: string;
    message: string;
    related_product_ids: mongoose.Types.ObjectId[];
    attached_file_ids: mongoose.Types.ObjectId[];
    status: 'pending' | 'in_progress' | 'waiting_for_customer' | 'resolved' | 'closed' | 'spam';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    assigned_to?: mongoose.Types.ObjectId;
    assigned_at?: Date;
    response?: string;
    responded_at?: Date;
    responded_by?: mongoose.Types.ObjectId;
    responses: {
        _id: mongoose.Types.ObjectId;
        content: string;
        created_by: mongoose.Types.ObjectId;
        created_at: Date;
        is_internal_note: boolean;
    }[];
    privacy_consented: boolean;
    privacy_consented_at?: Date;
    ip_address?: string;
    user_agent?: string;
    referrer?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    tags: string[];
    satisfaction_rating?: 1 | 2 | 3 | 4 | 5;
    satisfaction_comment?: string;
    created_at: Date;
    updated_at: Date;
    closed_at?: Date;
    deleted_at?: Date;
}

const InquirySchema = new Schema<IInquiry>(
    {
        inquiry_number: { type: String, required: true, unique: true },
        inquiry_type: {
            type: String,
            enum: ['service_introduction', 'product_inquiry', 'quote_request', 'demo_request', 'technical_support', 'partnership_proposal', 'technical_partnership', 'channel_partnership', 'investment_ir', 'press_pr', 'recruitment', 'complaint', 'suggestion', 'other'],
            required: true,
            index: true,
        },
        inquiry_type_label: {
            ko: { type: String, required: true },
            en: String,
        },
        inquirer: {
            name: { type: String, required: true },
            position: String,
            company_name: String,
            phone_number: { type: String, required: true },
            email: { type: String, required: true, index: true },
            country: String,
            language: { type: String, enum: ['ko', 'en'], default: 'ko' },
        },
        subject: String,
        message: { type: String, required: true },
        related_product_ids: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
        attached_file_ids: [{ type: Schema.Types.ObjectId, ref: 'File' }], // Generic File model
        status: {
            type: String,
            enum: ['pending', 'in_progress', 'waiting_for_customer', 'resolved', 'closed', 'spam'],
            default: 'pending',
            index: true,
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'urgent'],
            default: 'medium',
        },
        assigned_to: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
        assigned_at: Date,
        response: String,
        responded_at: Date,
        responded_by: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
        responses: [
            {
                content: String,
                created_by: { type: Schema.Types.ObjectId, ref: 'AdminUser' },
                created_at: { type: Date, default: Date.now },
                is_internal_note: { type: Boolean, default: false },
            },
        ],
        privacy_consented: { type: Boolean, required: true },
        privacy_consented_at: Date,
        ip_address: String,
        user_agent: String,
        referrer: String,
        utm_source: String,
        utm_medium: String,
        utm_campaign: String,
        tags: [String],
        satisfaction_rating: { type: Number, enum: [1, 2, 3, 4, 5] },
        satisfaction_comment: String,
        created_at: { type: Date, default: Date.now },
        updated_at: { type: Date, default: Date.now },
        closed_at: Date,
        deleted_at: { type: Date, sparse: true },
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    }
);

// Indexes
InquirySchema.index({ status: 1, created_at: -1 });

const Inquiry: Model<IInquiry> = models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);

export default Inquiry;
