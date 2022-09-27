import Student from '../../Models/Student.js';
import { Types } from 'mongoose';

const remove = async (req, res)=> {
    try{
        const {studentId, id} = req.body;
        if (!(studentId)) {
            return res.status(400).send({ code: 400, message: "Missing required properties" })
        }

        const student = await Student.findOneAndUpdate(
            { _id: studentId, techerRef: id, deleted: false },
            { deleted: true },
            { new: true }
        )
        if (!student) {
            return res.status(400).send({ code: 400, message: "No student found" })
        }

        return res.status(201).remove({ code:201, message:'student data deleted' });
    } catch(err) {
        return res.status(404).send({ code:404, message: err.message })
    }
}

export default remove