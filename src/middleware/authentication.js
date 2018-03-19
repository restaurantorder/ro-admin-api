const AuthApiInterface = require('../library/AuthApiInterface');

module.exports = (req, res, next) => {
    let authApi = new AuthApiInterface();
    let accessToken = req.header('Access-Token');
    let date = new Date();
    console.log(date + ' # ACCESS-TOKEN ' + accessToken + ' # ' + req.header('Authorization'));
    if (!accessToken) {
        res.status(401).json({
            error: {
                type: 'ACCESS_TOKEN_MISSING',
                msg: 'Please send a valid access-token in the request header.'
            }
        });
    } else {
        authApi.access(accessToken).then(resp => {
            req.accountId = resp.accountId;
            next();
        }).catch((err) => {
            // default error
            let error = {
                type: 'ACCESS_TOKEN_INVALID',
                msg: 'Please send a valid access-token in the request header.'
            };
            let body = err.response.data;
            if (body && body.error) {
                error = body.error;
            }
            res.status(401).json({
                error: error
            });
        });
    }
};