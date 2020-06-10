const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
require('dotenv').config()

const user = process.env.DB_USER
const password = process.env.DB_PASSWORD
const name = process.env.DB_NAME

let db

const mongoConnect = callback => {

    MongoClient.connect(`mongodb+srv://${user}:${password}@cluster0-xk1im.mongodb.net/${name}?retryWrites=true&w=majority`)
    .then(client => {
        console.log('Connected!')
        db = client.db()
        callback()
    })
    .catch(err => {
        console.log(err)
        throw err
    })
}

const getDb = () => {
    if(db) {
        return db
    }
    throw "No database found!"
}

exports.mongoConnect = mongoConnect
exports.getDb = getDb