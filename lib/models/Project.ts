import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProjectMetric {
  value: string;
  label: string;
  description?: string;
  visible?: boolean;
}

export interface IRelatedExperience {
  id: string;
  role: string;
  company: string;
}

export interface IProject extends Document {
  title: string;
  slug: string;
  shortDescription: string;
  description: string; // Long description
  techStack: string[]; // Primary technologies
  tags: string[]; // Conceptual characteristics
  status: 'Live' | 'In Development' | 'MVP' | 'Research' | 'Private' | 'Archived';
  
  liveUrl?: string;
  githubUrl?: string;
  documentationUrl?: string;
  
  highlights: string[];
  order: number;
  featured: boolean;
  featuredOrder?: number;
  
  imageUrl?: string; // Hero image
  gallery?: string[];
  videoUrl?: string;
  
  category?: string;
  
  // Case Study fields
  problem?: string;
  solution?: string;
  features?: string[];
  contributions?: string[];
  challenges?: string;
  decisions?: string;
  learnings?: string;
  
  // Architecture
  architectureClient?: string;
  architectureApi?: string;
  architectureDb?: string;
  architectureDiagram?: string;
  architectureDescription?: string;

  metrics?: IProjectMetric[];
  relatedExperiences?: IRelatedExperience[];
  
  published: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

const ProjectMetricSchema = new Schema<IProjectMetric>(
  {
    value:       { type: String, required: true, trim: true },
    label:       { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    visible:     { type: Boolean, default: true },
  },
  { _id: false }
);

const RelatedExperienceSchema = new Schema<IRelatedExperience>(
  {
    id:      { type: String, required: true },
    role:    { type: String, required: true },
    company: { type: String, required: true },
  },
  { _id: false }
);

const ProjectSchema = new Schema<IProject>(
  {
    title:               { type: String, required: true, trim: true },
    slug:                { type: String, required: true, unique: true, trim: true },
    shortDescription:    { type: String, required: true },
    description:         { type: String },
    techStack:           [{ type: String, trim: true }],
    tags:                [{ type: String, trim: true }],
    status:              { type: String, enum: ['Live', 'In Development', 'MVP', 'Research', 'Private', 'Archived'], default: 'In Development' },
    
    liveUrl:             { type: String, trim: true },
    githubUrl:           { type: String, trim: true },
    documentationUrl:    { type: String, trim: true },
    
    highlights:          [{ type: String }],
    order:               { type: Number, default: 0 },
    featured:            { type: Boolean, default: false },
    featuredOrder:       { type: Number },
    
    imageUrl:            { type: String },
    gallery:             [{ type: String }],
    videoUrl:            { type: String, trim: true },
    
    category:            { type: String, default: 'fullstack' },
    
    problem:             { type: String },
    solution:            { type: String },
    features:            [{ type: String }],
    contributions:       [{ type: String }],
    challenges:          { type: String },
    decisions:           { type: String },
    learnings:           { type: String },

    architectureClient:  { type: String, default: 'React / Next.js' },
    architectureApi:     { type: String, default: 'REST / Node.js' },
    architectureDb:      { type: String, default: 'MongoDB / Azure' },
    architectureDiagram: { type: String },
    architectureDescription: { type: String },

    metrics:             [ProjectMetricSchema],
    relatedExperiences:  [RelatedExperienceSchema],
    
    published:           { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
