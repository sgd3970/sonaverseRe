import mongoose, { Schema, Document } from 'mongoose';

export interface ISeoSettings extends Document {
  site_name: string;
  site_url: string;
  default_title: {
    ko: string;
    en: string;
  };
  default_description: {
    ko: string;
    en: string;
  };
  default_keywords: {
    ko: string[];
    en: string[];
  };
  default_og_image: string;
  social_links: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    twitter?: string;
  };
  contact: {
    email: string;
    phone?: string;
  };
  updated_at: Date;
  updated_by?: string;
}

const SeoSettingsSchema = new Schema<ISeoSettings>({
  site_name: { type: String, required: true, default: 'Sonaverse' },
  site_url: { type: String, required: true, default: 'https://sonaverse.kr' },
  default_title: {
    ko: { type: String, required: true, default: 'Sonaverse - 시니어의 더 나은 일상을 위한 혁신' },
    en: { type: String, required: true, default: 'Sonaverse - Innovation for Better Senior Living' },
  },
  default_description: {
    ko: { type: String, required: true, default: '만보 워크메이트와 보듬 기저귀를 통해 시니어의 삶의 질을 향상시키는 혁신적인 솔루션을 제공합니다.' },
    en: { type: String, required: true, default: 'We provide innovative solutions to improve the quality of life for seniors through Manbo Walkmate and Bodume Diapers.' },
  },
  default_keywords: {
    ko: { type: [String], default: ['시니어테크', '워크메이트', '보행기', '기저귀', '만보', '보듬'] },
    en: { type: [String], default: ['senior tech', 'walkmate', 'walker', 'diaper', 'manbo', 'bodume'] },
  },
  default_og_image: { type: String, default: '/images/og-default.jpg' },
  social_links: {
    facebook: String,
    instagram: String,
    youtube: String,
    twitter: String,
  },
  contact: {
    email: { type: String, required: true, default: 'info@sonaverse.kr' },
    phone: String,
  },
  updated_at: { type: Date, default: Date.now },
  updated_by: String,
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Ensure only one settings document exists
SeoSettingsSchema.statics.getSeoSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const SeoSettings = mongoose.models.SeoSettings || mongoose.model<ISeoSettings>('SeoSettings', SeoSettingsSchema);

export default SeoSettings;
