class Controller {

    constructor (){
        this.axios = require('axios').default;
        this.promiseRetry = require('promise-retry');
        this.url = `http://${process.env.HOSTNAME}:${process.env.PORT}/api/`;
        this.remoteResourceUrl1 = `${this.url}resource1`;
        this.remoteResourceUrl2 = `${this.url}resource2`;
    }

    _attemptUpdateRemoteAPI(url, body) {
        return this.promiseRetry({ retries: 3 }, (retry, number) => {
            return this.axios.put(url, body, {validateStatus: false}).catch(retry);
        }).then((response) => {
            if (response.status === 200) {
                return response.data;
            } else if (url === this.remoteResourceUrl1){
                return Promise.reject('Error 1');
            } else if (url === this.remoteResourceUrl2){
                return Promise.reject('Error 2');
            }
        });
    }

    updateRemoteApi(res) {
        let value1 = Math.floor(Math.random() * 1000) + 1;
        let value2 = Math.floor(Math.random() * 1000) + 1;

        this._attemptUpdateRemoteAPI(
            this.remoteResourceUrl1, { action: 'update', value: value1 }
        ).then(() => this._attemptUpdateRemoteAPI(
                this.remoteResourceUrl2, { action: 'update', value: value2 }
        )).then(
            (data) => res.send(data),
            (err) => {
                res.json({ statusCode: 400, type: 'error', message: 'Request failed' });
                if (err == 'Error 2'){
                    this._attemptUpdateRemoteAPI(this.remoteResourceUrl1, { action: 'rollback' });
                }
            }
        );
    }

}

module.exports = Controller;