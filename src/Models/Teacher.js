import { Schema } from "mongoose";
import database from '../DB/index.js'

const Teacher = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    deleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default database.model('Teacher', Teacher);
