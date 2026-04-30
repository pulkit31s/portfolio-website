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
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, required: true },
    techStack:   [{ type: String, trim: true }],
    liveUrl:     { type: String, trim: true },
    githubUrl:   { type: String, trim: true },
    highlights:  [{ type: String }],
    order:       { type: Number, default: 0 },
    featured:    { type: Boolean, default: false },
    imageUrl:    { type: String },
  },
  { timestamps: true }
);

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project;
