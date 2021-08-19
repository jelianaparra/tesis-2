import dot from 'dotenv'

dot.config();

// export const connection = {
//     port: '5432',
//     host: '172.27.35.238',
//     user: 'postgres',
//     password: 'secret',
//     database: 'control'
// }

export const connectionString = {
    connectionString: process.env.DATABASE_URL
}