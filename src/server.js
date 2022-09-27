import express from 'express'
import cors from 'cors'
import Teacher from './Router/teacher/index.js';
import Student from './Router/student/index.js';
import { NODE_ENV } from './constants.js';

const app = express();
app.use(cors({
	origin: '*',
	methods: ['GET', 'POST'],
	allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-HTTP-Method-Override', 'Accept'],
	credentials: true,
}));
app.use(express.json())


/**ROUTES */

app.use('/v1/student',Student);
app.use('/v1/teacher',Teacher);

const env = process.env.NODE_ENV ? process.env.NODE_ENV : 'development'

app.get('/',(req,res)=>res.send(`<h1>Student management System ${env} environment</h1>`))

const port = process.env.PORT || 3000

app.listen(port, ()=>console.log(`running on port ${port}`))