import superagent from 'superagent'

export default {
    getAll: () => {
        return superagent.get('http://localhost:3001/shapes')
            .then(res => {
                return [].concat(res.body);
            })
    },
    union: (shapes) => {
        return superagent.post('http://localhost:3001/_union')
            .send({shapes})
            .then(res => {
                return res.body;
            })
    },
    intersect: (shapes) => {
        return superagent.post('http://localhost:3001/_intersect')
            .send({shapes})
            .then(res => {
                return res.body;
            })
    },
    reset: () => {
        return superagent.post('http://localhost:3001/_reset')
            .then(res => {
                return res.body;
            })
    }
}