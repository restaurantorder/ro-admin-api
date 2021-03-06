'use strict';

const APIController = require('../../ro-express-helper/controller/APIController');
const RealmRestaurantController = require('../../ro-realm/controller/RealmRestaurantController');
const RealmMenuController = require('../../ro-realm/controller/RealmMenuController');
const RealmVoiceDeviceController = require('../../ro-realm/controller/RealmVoiceDeviceController');

const Authorization = require('../../ro-express-helper/middleware/Authorization');

class RestaurantController extends APIController {
    constructor () {
        super();
        this.realmController = new RealmRestaurantController();
        this.realmMenuController = new RealmMenuController();
        this.realmVoiceDeviceController = new RealmVoiceDeviceController();
        this.authorization = new Authorization();
        this.getRestaurants = this.getRestaurants.bind(this);
        this.getRestaurant = this.getRestaurant.bind(this);
        this.postRestaurant = this.postRestaurant.bind(this);
        this.putRestaurant = this.putRestaurant.bind(this);
        this.deleteRestaurant = this.deleteRestaurant.bind(this);
    };
    getRestaurants (req, res) {
        let validQueryParams = this.requestValidator.validRequestData(req.query, [
            {name: 'accountId', type: 'string'}
        ]);
        let that = this;
        this.handleRequest(validQueryParams, function () {
            let authorization = that.authorization.request(req.accountId, 'Account', req.query.accountId);
            if (authorization && !authorization.error) {
                return that.realmController.getRestaurantsByAccountId(req.query.accountId) || {error: 'can not get restaurants (accountId: ' + req.query.accountId + ')'};
            } else {
                return authorization;
            }
        }, res, req);
    };
    getRestaurant (req, res) {
        let validParams = this.requestValidator.validRequestData(req.params, [
            {name: 'restaurantId', type: 'string'}
        ]);
        let that = this;
        this.handleRequest(validParams, function () {
            let authorization = that.authorization.request(req.accountId, 'Restaurant', req.params.restaurantId);
            if (authorization && !authorization.error) {
                return that.realmController.getRestaurantById(req.params.restaurantId) || {error: 'can not get restaurant (restaurantId: ' + req.params.restaurantId + ')'};
            } else {
                return authorization;
            }
        }, res, req);
    };
    postRestaurant (req, res) {
        let validBody = this.requestValidator.validRequestData(req.body, [
            {name: 'name', type: 'string'},
            {name: 'accountId', type: 'string'},
            {name: 'street', type: 'string'},
            {name: 'postCode', type: 'string'},
            {name: 'city', type: 'string'},
            {name: 'country', type: 'string'}
        ]);
        let that = this;
        this.handleRequest(validBody, function () {
            let authorization = that.authorization.request(req.accountId, 'Account', req.body.accountId);
            if (authorization && !authorization.error) {
                return that.realmController.createRestaurant(req.body) || {error: 'can not create restaurant (accountId: ' + req.body.accountId + ')'};
            } else {
                return authorization;
            }
        }, res, req);
    };
    putRestaurant (req, res) {
        let validParams = this.requestValidator.validRequestData(req.params, [
            {name: 'restaurantId', type: 'string'}
        ]);
        let that = this;
        this.handleRequest(validParams, function () {
            let authorization = that.authorization.request(req.accountId, 'Restaurant', req.params.restaurantId);
            if (authorization && !authorization.error) {
                return that.realmController.updateRestaurant(req.params.restaurantId, req.body) || {error: 'can not update restaurant (restaurantId: ' + req.params.restaurantId + ')'};
            } else {
                return authorization;
            }
        }, res, req);
    };
    deleteRestaurant (req, res) {
        let validParams = this.requestValidator.validRequestData(req.params, [
            {name: 'restaurantId', type: 'string'}
        ]);
        let that = this;
        this.handleRequest(validParams, function () {
            let authorization = that.authorization.request(req.accountId, 'Restaurant', req.params.restaurantId);
            if (authorization && !authorization.error) {
                let restaurantId = req.params.restaurantId;
                // delete menus
                let menus = that.realmMenuController.getMenuByRestaurantId(restaurantId);
                if (menus && menus.length) {
                    menus.forEach((menu) => {
                        that.realmMenuController.deleteMenu(menu.id);
                    });
                }

                // delete voice devices
                let voiceDevices = that.realmVoiceDeviceController.getVoiceDevicesByRestaurantId(restaurantId);
                if (voiceDevices && voiceDevices.length) {
                    voiceDevices.forEach((voiceDevice) => {
                        that.realmVoiceDeviceController.deleteVoiceDevice(voiceDevice.id);
                    });
                }
                return that.realmController.deleteRestaurant(restaurantId) || {error: 'can not delete restaurant (restaurantId: ' + restaurantId + ')'};
            } else {
                return authorization;
            }
        }, res, req);
    };
}
module.exports = RestaurantController;
