const axios = require('axios');

class API {
    #base;
    constructor(base){
        this.#base = base
    }

    request(path){
        return new Promise((res, rej) => {
            axios.get(this.#base+path)
            .then(response => {
              res(response)
            })
            .catch(error => {
              rej(error)
            });
        })
    }
}

module.exports = API