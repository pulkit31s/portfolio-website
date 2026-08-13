import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITerminalCommand extends Document {
  command: string;
  output: string;
  category?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const TerminalCommandSchema = new Schema<ITerminalCommand>(
  {
    command:  { type: String, required: true, unique: true, lowercase: true, trim: true },
    output:   { type: String, required: true },
    category: { type: String, default: 'custom' },
    order:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

const TerminalCommand: Model<ITerminalCommand> =
  mongoose.models.TerminalCommand || mongoose.model<ITerminalCommand>('TerminalCommand', TerminalCommandSchema);

export default TerminalCommand;
