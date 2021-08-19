import express from "express"
import morgan from "morgan";
import userRoutes from "./routes/user.js";

const app = express();

const port = process.env.port || 50502

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1', userRoutes);

app.listen(port, () => {
    console.log("App Listening on port " + port)
})