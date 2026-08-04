import dotenv from 'dotenv'
dotenv.config()

import config from './config/config.js'
import app from './server/express.js'

// DNS fix (only if needed)
import dns from 'dns';
dns.setServers(['8.8.8.8'])

import mongoose from 'mongoose'
mongoose.Promise = global.Promise

mongoose.connect(config.mongoUri, {})
    .then(() => {
        console.log("Connected to the database!");
    })

mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${config.mongoUri}`)
})


import authRoutes from './server/routes/auth.routes.js'
import projectRoutes from "./server/routes/project.routes.js";


app.use("/auth", authRoutes)
app.use("/", projectRoutes);

app.get("/", (req, res) => {
    res.json({ message: "Welcome to User application." });
});

app.listen(config.port, (err) => {
    if (err) {
        console.log(err)
    }
    console.info('Server started on port %s.', config.port)
})
