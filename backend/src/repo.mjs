import db from 'sqlite';
import Promise from 'bluebird';

const DB = {
    init: () => {
        return Promise.resolve()
        // First, try to open the database
            .then(() => db.open('./database.sqlite', {Promise}))      // <=
            // Update db schema to the latest version using SQL-based migrations
            .then(() => db.migrate({force: 'last'}))                  // <=
            // Display error message if something went wrong
            .then(() => db.run("DELETE FROM Shapes"))
            .then(() => SHAPES.features.forEach((feature) => {
                db.run(`INSERT INTO Shapes(geojson) VALUES(?)`, [JSON.stringify(feature)])
            }))
            .catch((err) => console.error(err.stack));
    },
    getAll: () => {
        return db.all("SELECT * FROM Shapes", []).then((rows) => {
            return rows.map((row) => {
                let geo = JSON.parse(row.geojson);
                geo.properties.id = row.id;
                return geo;
            })
        })
    },
    get: (id) => {
        return db.get("SELECT * FROM Shapes WHERE id = ?", id).then((row) => {
            let geo = JSON.parse(row.geojson);
            geo.properties.id = row.id;
            return geo;
        })
    },

    replace: (ids, replacement) => {
        let deletes = [];
        ids.forEach((toDelete) => {
            deletes.push(db.run('DELETE FROM SHAPES WHERE id=?', toDelete));
        });
        delete replacement.properties.id;
        const jsonString = JSON.stringify(replacement);
        return Promise.all(deletes).then(() => {
            return db.run('INSERT INTO SHAPES( geojson ) VALUES ( ? )', [jsonString]);
        });
    }
};

export default DB;


const SHAPES = {
    "type": "FeatureCollection",
    "features": [
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -0.14007568359375,
                            51.5027589576403
                        ],
                        [
                            -0.12325286865234374,
                            51.5027589576403
                        ],
                        [
                            -0.12325286865234374,
                            51.512588580360244
                        ],
                        [
                            -0.14007568359375,
                            51.512588580360244
                        ],
                        [
                            -0.14007568359375,
                            51.5027589576403
                        ]
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -0.1352691650390625,
                            51.50810140697543
                        ],
                        [
                            -0.11398315429687499,
                            51.50810140697543
                        ],
                        [
                            -0.11398315429687499,
                            51.51963895991333
                        ],
                        [
                            -0.1352691650390625,
                            51.51963895991333
                        ],
                        [
                            -0.1352691650390625,
                            51.50810140697543
                        ]
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            -0.13595581054687497,
                            51.49698840879303
                        ],
                        [
                            -0.11226654052734375,
                            51.49698840879303
                        ],
                        [
                            -0.11226654052734375,
                            51.50510971251776
                        ],
                        [
                            -0.13595581054687497,
                            51.50510971251776
                        ],
                        [
                            -0.13595581054687497,
                            51.49698840879303
                        ]
                    ]
                ]
            }
        }
    ]
};