import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IExperience extends Document {
  role: string;
  company: string;
  type: 'internship' | 'part-time' | 'club' | 'research' | 'leadership';
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  bullets: string[];
  techStack: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    role:      { type: String, required: true, trim: true },
    company:   { type: String, required: true, trim: true },
    type:      { type: String, enum: ['internship', 'part-time', 'club', 'research', 'leadership'], default: 'internship' },
    location:  { type: String, required: true, trim: true },
    startDate: { type: String, required: true },
    endDate:   { type: String },
    current:   { type: Boolean, default: false },
    bullets:   [{ type: String }],
    techStack: [{ type: String, trim: true }],
    order:     { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Experience: Model<IExperience> =
  mongoose.models.Experience || mongoose.model<IExperience>('Experience', ExperienceSchema);

export default Experience;
