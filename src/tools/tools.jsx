import { KJUR } from 'jsrsasign';

export const generateVideoToken = (sdkKey, sdkSecret, topic, passWord = '', sessionKey = '', userIdentity = '', roleType = 1) => {
    console.log('generate called')
    let signature = '';
    try {
        const iat = Math.round(new Date().getTime() / 1000);
        const exp = iat + 60 * 60 *2;

        const oHeader = { alg: 'HS256', typ: 'JWT' };
        
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
    }
    catch(err) {
        console.log(err);
    }
    return signature;
};