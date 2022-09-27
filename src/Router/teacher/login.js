import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Teacher from '../../Models/Teacher.js';


const login = async (req, res) => {
    try{
        const {email, password} = req.body;
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
}

export default login
