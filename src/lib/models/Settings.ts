import mongoose, { Schema, Document, Model, models } from 'mongoose';

export interface ISettings extends Document {
  site_name: string;
  site_phone?: string;
  site_address?: string;
  social_links: {
    youtube?: string;
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
  updated_at: Date;
  updated_by?: string;
}

const SettingsSchema = new Schema<ISettings>({
  site_name: { type: String, required: true, default: 'Sonaverse' },
  site_phone: String,
  site_address: String,
  social_links: {
    youtube: String,
    instagram: String,
    facebook: String,
    twitter: String,
  },
  updated_at: { type: Date, default: Date.now },
  updated_by: String,
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Ensure only one settings document exists
SettingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

const Settings = (models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema)) as Model<ISettings> & {
  getSettings: () => Promise<ISettings>;
};

export default Settings;

