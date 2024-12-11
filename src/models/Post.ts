//models/Post.ts
import { Schema, model, models } from 'mongoose';

const PostSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
}, { timestamps: true });

const Post = models.Post || model('Post', PostSchema);
export default Post;