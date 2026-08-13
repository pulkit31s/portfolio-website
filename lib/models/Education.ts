import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEducation extends Document {
  degree: string;
  branch: string;
  institution: string;
  location: string;
  startYear: number;
  endYear?: number;
  current: boolean;
  cgpa?: number;
  percentage?: number;
  coursework: string[];
  order: number;
}

const EducationSchema = new Schema<IEducation>(
  {
    degree:      { type: String, required: true, trim: true },
    branch:      { type: String, required: true, trim: true },
    institution: { type: String, required: true, trim: true },
    location:    { type: String, trim: true },
    startYear:   { type: Number, required: true },
    endYear:     { type: Number },
    current:     { type: Boolean, default: false },
    cgpa:        { type: Number },
    percentage:  { type: Number },
    coursework:  [{ type: String, trim: true }],
    order:       { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Education: Model<IEducation> =
  mongoose.models.Education || mongoose.model<IEducation>('Education', EducationSchema);

export default Education;
