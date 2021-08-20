import express from "express"
import userRoutes from "./routes/user.js";
import docRoutes from "./routes/doc.js";
import solRoutes from "./routes/solicitud.js";
import middle from "./middle/middle.js";
import { login } from "./controllers/user.js";
import cors from 'cors';

const app = express();

const port = process.env.PORT || 50502

app.use(express.json());
app.use(cors())

app.use('/api/v1/user/login', login);
app.use('/api/v1/user',middle, userRoutes);
app.use('/api/v1/doc',middle, docRoutes);
app.use('/api/v1/solicitud',middle, solRoutes);

app.listen(port, () => {
    console.log("App Listening on port " + port)
})