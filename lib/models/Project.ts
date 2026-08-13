import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  highlights: string[];
  order: number;
  featured: boolean;
  imageUrl?: string;
  category?: string;
  architectureClient?: string;
  architectureApi?: string;
  architectureDb?: string;
  architectureDiagram?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title:               { type: String, required: true, trim: true },
    description:         { type: String, required: true },
    techStack:           [{ type: String, trim: true }],
    liveUrl:             { type: String, trim: true },
    githubUrl:           { type: String, trim: true },
    highlights:          [{ type: String }],
    order:               { type: Number, default: 0 },
    featured:            { type: Boolean, default: false },
    imageUrl:            { type: String },
    category:            { type: String, default: 'fullstack' },
    architectureClient:  { type: String, default: 'React / Next.js' },
    architectureApi:     { type: String, default: 'REST / Node.js' },
    architectureDb:      { type: String, default: 'MongoDB / Azure' },
    architectureDiagram: { type: String },
  },
  { timestamps: true }
);

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
