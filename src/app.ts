import express, { type Request, type Response, type Application, type NextFunction } from 'express'
import cors from 'cors'
import cookieParser from "cookie-parser";
import httpStatus from "http-status";
import { PORT, REQUEST_LIMIT_NUMBER, REQUEST_LIMIT_TIME, WEB_CACHE } from './config/config';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { dbConnection } from './libs/utility/db';
import router from './routes/router';
const app: Application = express()
const corsOptions = {
    origin: [
        'http://localhost:3000',
        'https://tool-client-zeta.vercel.app',
        '*'
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};

// middlewares
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet({
    contentSecurityPolicy: false,
    xDownloadOptions: false,
}),)
const limiter = rateLimit({ windowMs: REQUEST_LIMIT_TIME, max: REQUEST_LIMIT_NUMBER });
app.use(limiter);


// Web cache validation and conditional requests in Http
app.set('etag', WEB_CACHE);


app.use('/api/v1', router)



// Middleware to handle CORS headers for unsupported routes
app.use((req: Request, res: Response, next: NextFunction) => {
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
})

// Middleware to handle 404 (Not Found) errors
app.use((req: Request, res: Response, next: NextFunction) => {
    res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: "Not Found",
        errorMessages: [
            {
                path: req.originalUrl,
                message: "API Not Found",
            },
        ],
        statusCode: httpStatus.NOT_FOUND,
    });
    next();
});


app.listen(PORT, async () => {
    await dbConnection()
    console.log(`🛢   Database has been connected successfully`);
    console.log(`Application  listening on port ${PORT}`);
})