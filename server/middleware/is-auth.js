
var firebaseAdmin = require("firebase-admin");
module.exports = async (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        req.isAuth = false;
        return next()
    }
    const customToken = authHeader.split(" ")[1];
    if (!customToken || customToken === '') {
        req.isAuth = false;
        return next()
    }
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(customToken);
    if(!decodedToken){
        req.isAuth=false
        return next()
    }
    req.isAuth = true;
    next()
        



}