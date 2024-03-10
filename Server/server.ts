import { app } from './utils/server';
import mongoose from 'mongoose';

const CONNECTION: string | undefined = process.env.MONGODB_URL;
const PORT: string | undefined = process.env.PORT;

if (!CONNECTION || !PORT) {
    throw new Error('MongoDB URL or Port is not defined in the environment variables.');
}

mongoose.connect(CONNECTION)
    .then(() => app.listen(PORT, () => console.log(`Database Connected to port: ${PORT}`)))
    .catch((error: Error) => console.error(error));
