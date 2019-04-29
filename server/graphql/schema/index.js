const { buildSchema } = require('graphql');

module.exports = buildSchema(
    `
type AuthData {
    userId: ID!
    userToken: String!
    tokenExpiration: Int!
}

type StoreItem {
    _id: ID!
    name: String!
    description: String!
    price:Float!
    timeCreated:Int!
}
input StoreItemInput {
    name: String!
    description: String!
    price:Float!
    timeCreated:Int!
}

type User {
    _uid: ID!
    displayName: String
    email: String!
    password: String
    profilePictureUrl: String
    permissions:String!
    timeCreated:Int
}

input UserInput {
    displayName: String
    email: String!
    password: String
    profilePictureUrl: String
    permissions:String!
    timeCreated:Int
}



type RootQuery {
    storeItems: [StoreItem!]!
    users: [User!]!
    login(email:String!,password:String!):AuthData!
}

type RootMutation {
    createStoreItem(StoreItemInput:StoreItemInput):StoreItem
    createUser(UserInput:UserInput):User
}

schema {
    query:RootQuery
    mutation:RootMutation
}
`
)