import { Schema, model } from 'mongoose';

const articleSchema = new Schema(
  {
    title: { type: String, required: true, minlength: 3, maxlength: 48, trim: true },
    description: { type: String, required: true, minlength: 100, maxlength: 4000 },
    imageUrl: { type: String, required: true },
    imagePublicId: { type: String, required: true, select: false },
    publicationDate: { type: Date, required: true, index: true },
    authorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    authorName: { type: String, required: true, minlength: 4, maxlength: 50 },
    viewsCount: { type: Number, default: 0, min: 0, index: true },
    category: { type: String, enum: ['popular', 'general'], default: 'general' },
  },
  { timestamps: true, versionKey: false },
);

articleSchema.index({ authorId: 1, publicationDate: -1 });
articleSchema.index({ viewsCount: -1, publicationDate: -1 });
export const Article = model('Article', articleSchema);
