import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPosition {
  _id?: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  bullets: string[];
  techStack?: string[];
  description?: string;
}

export interface IRelatedProject {
  id: string;
  title: string;
  category?: string;
  description: string;
}

export interface IExperience extends Document {
  role: string;
  company: string;
  shortName?: string;
  websiteUrl?: string;
  type: string;
  location: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  bullets: string[];
  techStack: string[];
  featured?: boolean;
  positions?: IPosition[];
  relatedProjects?: IRelatedProject[];
  status?: 'published' | 'draft' | 'archived';
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const PositionSubSchema = new Schema<IPosition>(
  {
    role:        { type: String, required: true, trim: true },
    startDate:   { type: String, required: true },
    endDate:     { type: String },
    current:     { type: Boolean, default: false },
    bullets:     [{ type: String }],
    techStack:   [{ type: String, trim: true }],
    description: { type: String },
  },
  { _id: true }
);

const RelatedProjectSubSchema = new Schema<IRelatedProject>(
  {
    id:          { type: String, required: true },
    title:       { type: String, required: true },
    category:    { type: String },
    description: { type: String },
  },
  { _id: false }
);

const ExperienceSchema = new Schema<IExperience>(
  {
    role:            { type: String, required: true, trim: true },
    company:         { type: String, required: true, trim: true },
    shortName:       { type: String, trim: true },
    websiteUrl:      { type: String, trim: true },
    type:            { type: String, default: 'internship', trim: true },
    location:        { type: String, required: true, trim: true },
    startDate:       { type: String, required: true },
    endDate:         { type: String },
    current:         { type: Boolean, default: false },
    bullets:         [{ type: String }],
    techStack:       [{ type: String, trim: true }],
    featured:        { type: Boolean, default: false },
    positions:       [PositionSubSchema],
    relatedProjects: [RelatedProjectSubSchema],
    status:          { type: String, enum: ['published', 'draft', 'archived'], default: 'published' },
    order:           { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Experience: Model<IExperience> =
  mongoose.models.Experience || mongoose.model<IExperience>('Experience', ExperienceSchema);

export default Experience;

