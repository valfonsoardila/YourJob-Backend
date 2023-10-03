import express from 'express';
import consign from 'consign';
require('dotenv').config();
const app = express();

consign({
    cwd: __dirname
})
.include('libs/config.js')
.then('database.js')
.then('libs/middlewares.js')
.then('routes')
.then('libs/boot.js')
.into(app);




