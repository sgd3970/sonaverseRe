import mongoose, { Schema, Document } from 'mongoose';

// 연혁 항목 인터페이스
export interface IHistoryItem {
  text: {
    ko: string;
    en: string;
  };
  order: number;
}

// 연혁 문서 인터페이스
export interface IHistory extends Document {
  year: number;
  title: {
    ko: string;
    en: string;
  };
  subtitle: {
    ko: string;
    en: string;
  };
  items: IHistoryItem[];
  badge_color: string;
  text_color: string;
  position: 'left' | 'right';
  order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

const HistoryItemSchema = new Schema({
  text: {
    ko: { type: String, required: true },
    en: { type: String, default: '' },
  },
  order: { type: Number, default: 0 },
}, { _id: false });

const HistorySchema = new Schema<IHistory>({
  year: { type: Number, required: true, unique: true },
  title: {
    ko: { type: String, required: true },
    en: { type: String, default: '' },
  },
  subtitle: {
    ko: { type: String, default: '' },
    en: { type: String, default: '' },
  },
  items: [HistoryItemSchema],
  badge_color: { type: String, default: '#0b3877' },
  text_color: { type: String, default: '#ffffff' },
  position: { type: String, enum: ['left', 'right'], default: 'right' },
  order: { type: Number, default: 0 },
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  deleted_at: { type: Date },
}, {
  collection: 'histories',
  timestamps: false,
});

// 인덱스
// year는 unique: true로 인덱스가 자동 생성되므로 별도로 생성하지 않음
HistorySchema.index({ order: 1 });
HistorySchema.index({ is_active: 1 });

export default mongoose.models.History || mongoose.model<IHistory>('History', HistorySchema);

