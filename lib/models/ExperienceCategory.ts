import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExperienceCategory extends Document {
  name: string;
  slug: string;
  description?: string;
  color: string;
  bg?: string;
  isActive: boolean;
  showInFilters: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceCategorySchema = new Schema<IExperienceCategory>(
  {
    name:          { type: String, required: true, trim: true },
    slug:          { type: String, required: true, unique: true, lowercase: true, trim: true },
    description:   { type: String, default: '' },
    color:         { type: String, default: '#00d4ff' },
    bg:            { type: String, default: 'rgba(0,212,255,0.1)' },
    isActive:      { type: Boolean, default: true },
    showInFilters: { type: Boolean, default: true },
    order:         { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ExperienceCategory: Model<IExperienceCategory> =
  mongoose.models.ExperienceCategory ||
  mongoose.model<IExperienceCategory>('ExperienceCategory', ExperienceCategorySchema);

export default ExperienceCategory;
