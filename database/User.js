const Schema = require('mongoose').Schema
const MongoModel = require('./util/MongoModel')

class User extends MongoModel {

  constructor (dbconfig) {
    super(dbconfig, 'User', new Schema({
      name: String,
      email: String,
      avatar: String,
      titles: [{type: Number, ref: 'UserTitle'}]
    }))
  }
}

module.exports = User
