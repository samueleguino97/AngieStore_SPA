
var firebaseAdmin = require("firebase-admin");
const database = firebaseAdmin.database();
const bcrpyt = require('bcryptjs');
const rootRef = database.ref('/')
const storeItemsRef = database.ref('/storeItems');
const usersRef = database.ref('/users')

module.exports = {
    storeItems: async () => {
        try {
            const snapshot = await storeItemsRef.once('value')
            return Object.values(snapshot.val())
        } catch (e) {
            throw e
        }
    },
    users: async () => {
        try {
            const snapshot = await usersRef.once('value')
            return Object.values(snapshot.val());
        } catch (e) {
            throw e
        }
    },
    createUser: async (args) => {
        try {
            const data = args.UserInput;
            const hassedPass = await bcrpyt.hash(data.password, 12)
            const fbUserCreation = await firebaseAdmin.auth().createUser({
                email: data.email,
                emailVerified: false,
                password: data.password,
                displayName: data.displayName,
                photoURL: data.profilePictureUrl,
                disabled: false
            });
            const user = {
                _uid: fbUserCreation.uid,
                displayName: data.displayName?data.displayName:null,
                email: data.email,
                password: hassedPass,
                profilePictureUrl: data.profilePictureUrl?data.profilePictureUrl:null,
                permissions: data.permissions,
                timeCreated: Date.now(),
            }

            await usersRef.child(user._uid).set(user)
            return { ...user, password: null }
        } catch (error) {
            throw error
        }


    },
    createStoreItem: async (args,req) => {
        if(!req.isAuth){
            throw Error('Permission Denied')
        }
        try {
            const data = args.StoreItemInput;
            const storeItem = {
                _id: rootRef.push().key,
                name: data.name,
                description: data.description,
                price: (+data.price),
                timeCreated: Date.now(),
            }
            await storeItemsRef.child(storeItem._id).set(storeItem)
            return result.val(storeItem)
        } catch (error) {
            throw error
        }
    },
    login: async ({ email, password},req) => {
        try {
            const fbUser = await firebaseAdmin.auth().getUserByEmail(email);
            const dbUser = await usersRef.child(fbUser.uid).once('value')

            if (!fbUser.uid) {
                throw Error('incorrect/email');
            }
            const passwordIsCorrect = await bcrpyt.compare(password, dbUser.val().password);
            
            if (!passwordIsCorrect) {
                throw Error('incorrect/password')
            }
            const customToken = await firebaseAdmin.auth().createCustomToken(fbUser.uid,{userToken:fbUser});
            return { userId: fbUser.uid, userToken: customToken, tokenExpiration: 1 }
        } catch (e) {
            throw e
        }
        

    }
}