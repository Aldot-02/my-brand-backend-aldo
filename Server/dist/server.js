import { app } from './utils/server.js';
import mongoose from 'mongoose';
const CONNECTION = process.env.MONGODB_URL;
const PORT = process.env.PORT;
if (!CONNECTION || !PORT) {
    throw new Error('MongoDB URL or Port is not defined in the environment variables.');
}
mongoose.connect(CONNECTION)
    .then(() => app.listen(PORT, () => console.log(`Database Connected to port: ${PORT}`)))
    .catch((error) => console.error(error));
//# sourceMappingURL=server.js.map