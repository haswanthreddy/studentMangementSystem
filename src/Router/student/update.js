import Student from '../../Models/Student.js';
import { Types } from 'mongoose';

const update = async (req, res)=> {
    try{
        const {studentId, id, rollNumber, name, email} = req.body;
        if (!(studentId)) {
            return res.status(400).send({ code: 400, message: "Missing required properties" })
        }

        const studentCheck = await Student.findOne(
            { _id: studentId, techerRef: id, deleted: false },    
        );

        if (!studentCheck) {
            return res.status(400).send({ code: 400, message: "No student found" })
        }

        await Student.findOneAndUpdate(
            { _id: studentId },
            {
                name: name || studentCheck.name,
                rollNumber: rollNumber || studentCheck.rollNumber,
                email: email || studentCheck.email, 
            }
        );

        return res.status(201).send({ code:201, message:'student data updated' });
    } catch(err) {
        return res.status(404).send({ code:404, message: err.message })
    }
}

export default update