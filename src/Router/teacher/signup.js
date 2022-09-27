import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Teacher from '../../Models/Teacher.js';
import { PRIVATE_KEY } from '../../constants.js';


const signup = async (req, res) => {
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
}

export default signup
