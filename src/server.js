import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { NODE_ENV, PRIVATE_KEY } from './constants.js';
import Student from './Models/Student.js';
import Teacher from './Models/Teacher.js';
import { Types } from 'mongoose';

const app = express();
app.use(cors({
	origin: '*',
	methods: ['GET', 'POST'],
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-HTTP-Method-Override', 'Accept'],
	credentials: true,
}));
app.use(express.json())

const authentication = async (req, res, next) => {
    try{
        const { headers: { authorization } } = req;
        if (!authorization) {
            res.status(404).send({ message: "Missing Headers"})
        }

        jwt.verify(authorization, process.env.PRIVATE_KEY, (err, decoded)=>{
            if (!err) {
                req.body.id = decoded.data
                next()
            }
            else {
                return res.status(400).send({ message: "Token might be invalid or expired"})
            }
        })

    } catch (err) {
        return res.status(400).send({ message: "Token might be invalid or expired"})
    }
}

/**Teacher */
app.use('/teacher/signup', async (req, res) => {
    try{
        const {email, password, name} = req.body;
        if (!(email && password && name)) {
            return res.status(400).send({ code: 400, message: "Missing required properties" })
        }

        const userCheck = await Teacher.findOne({email: email, deleted: false})
        if (userCheck) {
            return res.status(400).send({ code: 400, message: "An account with this email already exists" })
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = new Teacher({
            email: email,
            password: hashedPassword,
            name: name
        });

        await user.save()

        const accessToken = jwt.sign(
            { data: user._id },
            PRIVATE_KEY,
            { expiresIn: '7d' }
        )

        console.log(accessToken);

        return res.status(201).send({ code:201, message:'Account created successfully', data:accessToken });
    }catch(err) {
        return res.status(401).send({ code: 401, message: err.message})
    }
});

app.use('/teacher/login', async (req, res) => {
    try{const {email, password} = req.body;
        if (!(email && password)) {
            return res.status(400).send({ code: 400, message: "Missing required properties" })
        }

        const userCheck = await Teacher.findOne({email: email, deleted: false})
        if (!userCheck) {
            return res.status(404).send({ code: 404, message: "No account found" })
        }

        const passwordCheck = await bcrypt.compare(password, userCheck.password);

        console.log(passwordCheck,"passwordCheck");

        if (!passwordCheck) {
            return res.status(401).send({ code: 401, message: "wrong password" })
        }

        const accessToken = jwt.sign(
            { data: userCheck._id },
            process.env.PRIVATE_KEY,
            { expiresIn: '7d' }
        )

        return res.status(201).send({code:201, message:'Account created successfully', data:accessToken});
    }catch(err) {
        return res.status(401).send({ code: 401, message: err.message})
    }
})

/**Student */
app.use('/student/create', authentication, async (req, res)=> {
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
});

app.use('/student/details', authentication, async (req, res)=> {
    try{
        const { studentId, id, page = 1, limit = 30 } = req.body;

        const student = await Student.find(
            studentId ? { _id: studentId, teacherRef:id, deleted: false }  : { teacherRef: id, deleted: false }
        ).skip((page - 1) * limit).limit(limit);
        
        return res.status(201).send({ code:201, message:'student details', data: student, page, limit });
    } catch(err) {
        return res.status(404).send({ code:404, message: err.message })
    }
})

app.use('/student/update', authentication, async (req, res)=> {
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
})

app.use('/student/remove', authentication, async (req, res)=> {
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

        return res.status(201).send({ code:201, message:'student data deleted' });
    } catch(err) {
        return res.status(404).send({ code:404, message: err.message })
    }
})

const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'

app.get('/',(req,res)=>res.send(`<h1>Student management System ${env} environment</h1>`))

const port = process.env.PORT || 3000

app.listen(port, ()=>console.log(`running on port ${port}`))