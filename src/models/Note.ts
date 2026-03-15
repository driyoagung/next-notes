import mongoose, { Document, Model, Schema } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for this note.'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide the content of this note.'],
    },
    category: {
      type: String,
      enum: ['Personal', 'Work', 'Ideas', 'Other'],
      default: 'Other',
    },
  },
  {
    timestamps: true,
  }
);

// Mongoose model caching to prevent OverwriteModelError in Next.js development
const Note: Model<INote> = mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema);

export default Note;
