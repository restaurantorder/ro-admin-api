'use strict';

const ParentRealmController = require('../../ro-realm/ParentRealmController');
const RequestValidator = require('./RequestValidator');

class APIController {
    constructor () {
        this.requestValidator = new RequestValidator();
        this.realmController = new ParentRealmController();
    };
    handleRequest (requestValid, databaseCallback, res) {
        if (requestValid) {
            let result = databaseCallback();
            result = this.realmController.formatRealmObj(result);
            this.handleResponse(res, result);
        } else {
            res.sendStatus(400);
        };
    };
    handleResponse (res, jsonObject) {
        if (jsonObject) {
            res.json(jsonObject);
        } else {
            res.sendStatus(500);
        }
    };
}
module.exports = APIController;