import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  category: 'technical' | 'frontend' | 'backend' | 'ml' | 'data';
  proficiency: number;
  icon?: string;
  order: number;
}

const SkillSchema = new Schema<ISkill>({
  name:        { type: String, required: true, trim: true },
  category:    { type: String, enum: ['technical', 'frontend', 'backend', 'ml', 'data'], required: true },
  proficiency: { type: Number, min: 1, max: 100, default: 80 },
  icon:        { type: String },
  order:       { type: Number, default: 0 },
});

const Skill: Model<ISkill> =
  mongoose.models.Skill || mongoose.model<ISkill>('Skill', SkillSchema);

export default Skill;
