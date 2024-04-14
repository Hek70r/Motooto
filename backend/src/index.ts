import express, {NextFunction, Request, Response} from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user";
import brandRouter from "./routes/brand";
import listingRouter from "./routes/listing";
import {brandsUpdater} from "./services/brandsUpdater";
import { FRONTEND_URL, PORT } from './constans/constans';
dotenv.config();

const app = express();

//  <----------- Parsing the request data from url-encoded format to JSON ----------->
app.use(bodyParser.urlencoded({ extended: false}));
app.use(express.json());

//  <----------- Middlewares ----------->
app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', FRONTEND_URL);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use("/api", userRouter);
app.use("/api/brands", brandRouter);
app.use("/api/listings", listingRouter);

// Nie uÅ¼ywaÄ czÄsto, powoduje wykonanie bardzo wielu zapytaÅ do bazy danych, aktualizujÄc marki aut
// brandsUpdater();

app.get("/", (req, res) => res.send("Express on Vercel"));

//  <----------- Connecting to the database and starting the app to listen ----------->
const MONGODB_URI = process.env["MONGODB_URI"];

if (MONGODB_URI != undefined) {
    mongoose
        .connect(MONGODB_URI)
        .then(() => {
            console.log("Connected to the database successfully!");

            app.listen(PORT, () => {
                console.log(`App listening at http://localhost:${PORT}`);
            });
        })
        .catch((error) => {
            console.log("Error has occured when trying to connect to the database!", error);
        })
}

module.exports = app;