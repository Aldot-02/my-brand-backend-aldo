import express, { Application } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import swaggerDocs from "../utils/swagger";
import { Request, Response } from 'express';

// IMPORTING ROUTES
import AuthRoute from '../Routes/AuthRoute';
import userRoute from '../Routes/UserRoute';
import BlogsRoute from '../Routes/BlogsRoute';

export const app: Application = express();
swaggerDocs(app, 3000);

// MIDDLEWARES
app.use(cors({
    credentials: true,
    origin: ['https://my-brand-backend-aldo-1.onrender.com', 'http://127.0.0.1:5500', 'https://aldot.netlify.app']
}));
app.use(bodyParser.json({ limit: '30mb'}));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));
app.use(cookieParser());

dotenv.config();

app.use('/auth', AuthRoute);
app.use('/user', userRoute);
app.use('/blog', BlogsRoute);
app.get("/", (req: Request, res: Response) => {
    res.send("Consider using the above link for getting my APIs");
});