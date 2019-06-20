import express from 'express';
import DB from './repo.mjs';
import Promise from 'bluebird';
import bodyParser from 'body-parser';
import Turf from 'turf';

const app = express();
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const port = process.env.PORT || 3001;

app.get('/shapes', async (req, res, next) => {
    try {
        DB.getAll().then((body) => res.send(body));
    } catch (err) {
        next(err);
    }
});

app.post('/_union', async (req, res, next) => {
    try {
        const [f1, f2] = await Promise.all(req.body.shapes.map(s => DB.get(s)));
        let u = Turf.union(f1, f2);
        await DB.replace(req.body.shapes, u);
        res.send(u);
    } catch (err) {
        next(err);
    }
});

app.post('/_intersect', async (req, res, next) => {
    try {
        const [f1, f2] = await Promise.all(req.body.shapes.map(s => DB.get(s)));
        let u = Turf.intersect(f1, f2);
        await DB.replace(req.body.shapes, u);
        res.send(u);
    } catch (err) {
        next(err);
    }
});
app.post('/_reset', async (req, res, next) => {
    try {
        await DB.init();
        res.send();
    } catch (err) {
        next(err);
    }
});

Promise.resolve()
    .then(() => DB.init())
    .catch((err) => console.error(err.stack))
    .finally(() => app.listen(port));


