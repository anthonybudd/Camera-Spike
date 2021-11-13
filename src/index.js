require('dotenv').config();
const basicAuth = require('express-basic-auth');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const glob = require('glob');
const path = require('path');
const fs = require('fs');


console.log('************************************');
console.log(`* CameraSpike Server`);
console.log('*');
console.log('*');


////////////////////////////////////////////////
// Express
const app = express();
app.use(cors({
    origin: '*',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.get('/_readiness', (req, res) => res.send('healthy'))
app.get('/api/v1/_healthcheck', (req, res) => res.json({ status: 'ok' }));
app.use(morgan('[:date[iso]] HTTP/:http-version :status :method :url :response-time ms'));
app.use('/static', express.static(path.join(__dirname, 'ui')));
const users = {};
users[process.env.USERNAME] = process.env.PASSWORD;

////////////////////////////////////////////////
// Routes


/**
 * GET /
 * 
 * Returns the front-end UI.
 */
app.get('/', async (req, res) => {
    return res.send(
        fs.readFileSync(path.resolve(__dirname, './ui/index.html'), 'utf8')
    );
});


/**
 * GET /api/v1/frames/:year/:month/:day
 * 
 * Returns an array of frame paths for a specific date.
 */
app.get('/api/v1/frames/:year/:month/:day', [ basicAuth({ users })], async (req, res) => {
    try {
        const after  = req.query.after? Number(req.query.after) : false;
        const before = req.query.before? Number(req.query.before) : false;
        const count  = req.query.count? Number(req.query.count) : 10;
        let files  = fs.readdirSync(`/frames/${req.params.year}/${req.params.month}/${req.params.day}`);

        const extractUnix = (filePath) => (Number(path.basename(filePath).split('--')[1].split('.')[0]));

        if (after) {
            files = files
                .filter((f) => (extractUnix(f) > after))
                .sort((a, b) => (a > b))
                .slice(-count);
        } else if (before) {
            files = files
                .filter((f) => (extractUnix(f) < before))
                .sort((a, b) => (a < b))
                .slice(-count);
        } else {
            files = files
                .sort((a, b) => (a > b))
                .slice(0, count);
        }

        return res.json(
            files.map((f) => (`/api/v1/frames/${req.params.year}/${req.params.month}/${req.params.day}/${f}`))
        );
    } catch (error) {
        console.error(error);
        return res.json([]);
    }
});


/** 
 * GET /api/v1/frames/:year/:month/:day/:frame
 * 
 * Returns a single image based on date path and unix timestamp.
 */
app.get('/api/v1/frames/:year/:month/:day/:frame', async (req, res) => {
    try {
        glob(`/frames/${req.params.year}/${req.params.month}/${req.params.day}/${req.params.frame}`, {}, (err, files) => {
            if (err) throw err;

            const file = files[0];
            if (!file) return res.status(404).send('Image not found');

            fs.readFile(file, (err, data) => {
                if (err) throw err;  
                res.writeHead(200, {'Content-Type': 'image/jpeg'});
                res.end(data); 
            });
        })
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error');
    }
});


/** 
 * GET /api/v1/frames/:year/:month/:day/unix/:unix
 * 
 * Returns a single image based on date path and unix timestamp.
 */
app.get('/api/v1/frames/:year/:month/:day/unix/:unix', async (req, res) => {
    try {
        glob(`/frames/${req.params.year}/${req.params.month}/${req.params.day}/*--${req.params.unix}*`, {}, (err, files) => {
            if (err) throw err;

            const file = files[0];
            if (!file) return res.status(404).send('Image not found');

            fs.readFile(file, (err, data) => {
                if (err) throw err;  
                res.writeHead(200, {'Content-Type': 'image/jpeg'});
                res.end(data); 
            });
        })
    } catch (error) {
        console.error(error);
        return res.status(500).send('Error');
    }
});


const PORT = (process.env.PORT || 80);
app.listen(PORT, () => console.log(`* Server is running on port http://127.0.0.1:${PORT}`));
module.exports = app;
