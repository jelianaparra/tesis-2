import pg from "pg";
import { connectionString } from "./config.js";

export const connect = async () => {
    return new pg.Pool(connectionString)
}