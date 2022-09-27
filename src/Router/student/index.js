import { Router } from "express";
import create from "./create.js";
import details from "./details.js";
import remove from "./remove.js";
import update from './update.js';
import jwt from 'jsonwebtoken';

const router = Router();

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

router.post('/create', authentication, create);
router.post('/details', authentication, details);
router.post('/remove', authentication, remove);
router.post('/update', authentication, update);


export default router;