import Student from '../../Models/Student.js';
import { Types } from 'mongoose';

const details = async (req, res)=> {
    try{
        const { studentId, id, page = 1, limit = 30 } = req.body;

        const student = await Student.find(
            studentId ? { _id: studentId, teacherRef:id, deleted: false }  : { teacherRef: id, deleted: false }
        ).skip((page - 1) * limit).limit(limit);
        
        return res.status(201).send({ code:201, message:'student details', data: student, page, limit });
    } catch(err) {
        return res.status(404).send({ code:404, message: err.message })
    }
}

export default details