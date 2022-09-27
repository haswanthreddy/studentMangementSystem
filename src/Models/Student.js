import { Schema } from "mongoose";
import database from '../DB/index.js'

const Student = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    teacherRef: { type: Schema.Types.ObjectId, required: true },
    rollNumber: { type: Number, required: true },
    deleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default database.model('Student', Student);
