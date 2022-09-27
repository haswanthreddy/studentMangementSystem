import mongoose from 'mongoose';
import { URI } from '../constants.js'

mongoose.connect(URI, (err) => {
	if (err) {
		console.log('mongo connection err', err);
	} else {
		console.log('database connected');
	}
});

export default mongoose;