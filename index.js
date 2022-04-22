const express = require('express');
const app = express();
const fs = require('fs');
const mongodb = require('mongodb');
// const url = 'mongodb://user:password@db:27017';
const url = 'mongodb://localhost:27017';

app.get('/', (req, res) => res.sendFile(`${__dirname}/index.html`));

app.get('/init-video', (req, res) => {
    // could do with improving this but it's fine as a POC
    mongodb.MongoClient.connect(url, (error, client) => {
        if (error) {
            res.json(error);
            return;
        }
        const db = client.db('videos');
        const bucket = new mongodb.GridFSBucket(db);
        const uploadStream = bucket.openUploadStream('bigbuck');
        const videoStream = fs.createReadStream('./bigbuck.mp4');

        videoStream.pipe(uploadStream);
        res.status(200).send('\nSucess...\n');
    });
});

app.get('/mongo-video', (req, res) => {
    mongodb.MongoClient.connect(url, (error, client) => {
        if (error) {
            res.status(500).json(error);
            return;
        }

        const { range } = req.headers;
        if (!range) res.status(400).send('Requires Range Header');

        const db = client.db('videos');

        db.collection('fs.files').findOne({}, (err, video) => {
            if (!video) {
                res.status(404).send('Unable to find video. May not have been uploaded yet.');
                return;
            }

            const { length } = video;
            const start = Number(range.replace(/\D/g, ''));
            const end = length - 1;

            const contentLength = (end - start) + 1;

            const headers = {
                'Content-Range': `bytes ${start}-${end}/${length}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': contentLength,
                'Content-Type': 'video/mp4',
            };

            res.writeHead(206, headers);

            const bucket = new mongodb.GridFSBucket(db);
            const downloadStream = bucket.openDownloadStreamByName('bigbuck', {
                start, end: length
            });

            downloadStream.pipe(res);
        });
    });
});

app.listen(8000, () => console.log('Listening on port 8000'));