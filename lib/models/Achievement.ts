import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IAchievement extends Document {
  title: string;
  event: string;
  year: number;
  description: string;
  rank?: string;
  international: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const AchievementSchema = new Schema<IAchievement>(
  {
    title:         { type: String, required: true, trim: true },
    event:         { type: String, required: true, trim: true },
    year:          { type: Number, required: true },
    description:   { type: String, required: true },
    rank:          { type: String },
    international: { type: Boolean, default: false },
    order:         { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Achievement: Model<IAchievement> =
  mongoose.models.Achievement || mongoose.model<IAchievement>('Achievement', AchievementSchema);

export default Achievement;
