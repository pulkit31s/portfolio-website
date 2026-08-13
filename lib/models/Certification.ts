import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICertification extends Document {
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  category: string;
  description?: string;
  order: number;
}

const CertificationSchema = new Schema<ICertification>(
  {
    title:         { type: String, required: true, trim: true },
    issuer:        { type: String, required: true, trim: true },
    date:          { type: String, required: true },
    credentialUrl: { type: String, trim: true },
    category:      { type: String, default: 'other', trim: true },
    description:   { type: String },
    order:         { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Certification: Model<ICertification> =
  mongoose.models.Certification ||
  mongoose.model<ICertification>('Certification', CertificationSchema);

export default Certification;
