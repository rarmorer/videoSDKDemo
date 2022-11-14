require('dotenv').config();
const KJUR = require('KJUr')

const middleware = {};

middleware.generateToken = async(req, res, next) => {
    console.log(req.body)
    try {
        let signature = '';
        const iat = Math.round(new Date().getTime() / 1000);
        const exp = iat + 60 * 60 * 2;

        const oHeader = { alg: 'HS256', typ: 'JWT' };
        const {sdkKey, topic, passWord, userIdentity, sessionKey, roleType} = req.body
        const oPayload = {
            app_key: sdkKey,
            iat,
            exp,
            tpc: topic,
            pwd: passWord,
            user_identity: userIdentity,
            session_key: sessionKey,
            role_type: roleType,
        };
        const sHeader = JSON.stringify(oHeader);
        const sPayload = JSON.stringify(oPayload);
        signature = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, sdkSecret);
        res.locals.token = signature;
        return next();
    }
    catch(err) {
        return next({err})
    }
}


module.exports = middleware;