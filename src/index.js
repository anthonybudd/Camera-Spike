require('dotenv').config();
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
app.use('/static', express.static(path.join(__dirname, 'ui')))

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
app.get('/api/v1/frames/:year/:month/:day', async (req, res) => {
    let after  = req.query.after? Number(req.query.after) : false;
    let before = req.query.before? Number(req.query.before) : false;
    let count  = req.query.count? Number(req.query.count) : 200;
    let files  = fs.readdirSync(`/frames/${req.params.year}/${req.params.month}/${req.params.day}`);

    const extractUnix = (filePath) => (Number(path.basename(filePath).split('--')[1].split('.')[0]));

    if (after) {
        files = files
            .filter((f) => (extractUnix(f) > after))
            .sort((a, b) => (a > b))
            .slice(0, count);
    } else if (before) {
        files = files
            .filter((f) => (extractUnix(f) < before))
            .sort((a, b) => (a < b))
            .slice(-count);
    } else {
        files = files.slice(0, count);
    }

    return res.json(files);
});


/** 
 * GET /api/v1/frames/:year/:month/:day/:unix
 * 
 * Returns a single image based on date path and unix timestamp.
 */
app.get('/api/v1/frames/:year/:month/:day/:unix', async (req, res) => {
    try {
        glob(`/frames/${req.params.year}/${req.params.month}/${req.params.day}/*--${req.params.unix}*`, {}, (err, files) => {
            if (err) throw err;

            let file = files[0];
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
