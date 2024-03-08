import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerDocs from "../utils/swagger.js";
// IMPORTING ROUTES
import AuthRoute from '../Routes/AuthRoute.js';
import userRoute from '../Routes/UserRoute.js';
import BlogsRoute from '../Routes/BlogsRoute.js';
export const app = express();
swaggerDocs(app, 3000);
// MIDDLEWARES
app.use(cors({
    credentials: true,
    origin: ['https://my-brand-backend-aldo-1.onrender.com', 'http://127.0.0.1:5500', 'https://aldot.netlify.app']
}));
app.use(bodyParser.json({ limit: '30mb' }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cookieParser());
dotenv.config();
app.use('/auth', AuthRoute);
app.use('/user', userRoute);
app.use('/blog', BlogsRoute);
app.get("/", (req, res) => {
    res.send("Consider using the above link for getting my APIs");
});
//# sourceMappingURL=server.js.map