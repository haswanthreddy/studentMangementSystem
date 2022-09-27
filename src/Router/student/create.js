import Student from '../../Models/Student.js';
import { Types } from 'mongoose';

const create = async (req, res)=> {
    try{
        const {email, id, name, rollNumber} = req.body;
        if (!(email && rollNumber && name)) {
            return res.status(400).send({ code: 400, message: "Missing required properties" })
        }

        const studentCheck = await Student.findOne({ email: email, deleted: false })
        if (studentCheck) {
            return res.status(400).send({ code: 400, message: "student already created with this email" })
        }

        const student = new Student({
            email,
            teacherRef: Types.ObjectId(id),
            rollNumber,
            name
        });

        await student.save()

        return res.status(201).send({ code:201, message:'student created successfully', data:student });
    } catch(err) {
        return res.status(404).send({ code:404, message: err.message })
    }
}


export default create