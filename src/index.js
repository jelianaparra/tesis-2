import express from "express"
import morgan from "morgan";
import userRoutes from "./routes/user.js";
import docRoutes from "./routes/doc.js";
import middle from "./middle/middle.js";

const app = express();

const port = process.env.port || 50502

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/doc',middle, docRoutes);

app.listen(port, () => {
    console.log("App Listening on port " + port)
})