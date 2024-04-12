import express from 'express';
import cors from 'cors';
import { dbConnnect } from './config/dbConfig.js';
import usersRoute from './routes/usersRoute.js';
import { configDotenv } from 'dotenv';
import postsRoute from './routes/postsRoute.js';
import commentsRoute from './routes/commentsRoute.js';
import likesRoute from './routes/likesRoute.js';

configDotenv();

dbConnnect();



const app = express();
app.use(cors())
app.use(express.json());


app.use("/api/users", usersRoute);
app.use("/api/posts", postsRoute);
app.use("/api/comments", commentsRoute);
app.use("/api/likes", likesRoute);

app.use((req, res, next) => {
    const error = new Error(`404 not found: ${req.originalUrl}`)
    error.status = 404;
    next(error)
})

app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message,
            stack: err.stack
        }
    })
})


const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})