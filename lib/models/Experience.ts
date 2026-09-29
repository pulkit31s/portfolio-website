import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMetric {
  value: string;
  label: string;
  description?: string;
}

export interface IPosition {
  _id?: string;
  role: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  bullets: string[];
  techStack?: string[];
  description?: string;
  metrics?: IMetric[];
}

export interface IRelatedProject {
  id: string;
  title: string;
  category?: string;
  description: string;
}

export interface IDisplaySettings {
  showInTimeline?: boolean;
  showInStream?: boolean;
  showMetrics?: boolean;
  showRoleProgression?: boolean;
  showRelatedProjects?: boolean;
  showCTA?: boolean;
  accentColor?: string;
  promotionalLabel?: string;
  displaySide?: 'auto' | 'left' | 'right';
  nodeLabel?: string;
  roleProgressionEnabled?: boolean;
  progressionLabel?: string;
}

export interface IExperience extends Document {
  role: string;
  company: string;
  shortName?: string;
  websiteUrl?: string;
  logoUrl?: string;
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
  displaySettings?: IDisplaySettings;
  status: 'published' | 'draft' | 'archived';
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const MetricSubSchema = new Schema<IMetric>(
  {
    value:       { type: String, required: true, trim: true },
    label:       { type: String, required: true, trim: true },
    description: { type: String, trim: true },
  },
  { _id: false }
);

const PositionSubSchema = new Schema<IPosition>(
  {
    role:        { type: String, required: true, trim: true },
    startDate:   { type: String, required: true },
    endDate:     { type: String },
    current:     { type: Boolean, default: false },
    bullets:     [{ type: String }],
    techStack:   [{ type: String, trim: true }],
    description: { type: String },
    metrics:     [MetricSubSchema],
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

const DisplaySettingsSubSchema = new Schema<IDisplaySettings>(
  {
    showInTimeline:       { type: Boolean, default: true },
    showInStream:         { type: Boolean, default: true },
    showMetrics:          { type: Boolean, default: true },
    showRoleProgression:  { type: Boolean, default: true },
    showRelatedProjects:  { type: Boolean, default: true },
    showCTA:              { type: Boolean, default: true },
    accentColor:          { type: String },
    promotionalLabel:     { type: String },
    displaySide:          { type: String, enum: ['auto', 'left', 'right'], default: 'auto' },
    nodeLabel:            { type: String },
    roleProgressionEnabled: { type: Boolean, default: true },
    progressionLabel:     { type: String, default: 'Role Progression' },
  },
  { _id: false }
);

const ExperienceSchema = new Schema<IExperience>(
  {
    role:            { type: String, required: true, trim: true },
    company:         { type: String, required: true, trim: true },
    shortName:       { type: String, trim: true },
    websiteUrl:      { type: String, trim: true },
    logoUrl:         { type: String, trim: true },
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
    displaySettings: { type: DisplaySettingsSubSchema, default: () => ({}) },
    status:          { type: String, enum: ['published', 'draft', 'archived'], default: 'published' },
    order:           { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Experience: Model<IExperience> =
  mongoose.models.Experience || mongoose.model<IExperience>('Experience', ExperienceSchema);

export default Experience;
