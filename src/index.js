import express from "express"
import morgan from "morgan";

const app = express();

const port = process.env.port || 50502

app.use(morgan('dev'));

app.listen(port, () => {
    console.log("App Listening on port " + port)
})