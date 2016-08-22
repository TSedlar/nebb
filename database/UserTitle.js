const Schema = require('mongoose').Schema
const MongoModel = require('./util/MongoModel')

class UserTitle extends MongoModel {

  constructor (dbconfig) {
    super(dbconfig, 'UserTitle', new Schema({
      name: String,
      color: String
    }))
  }
}

module.exports = UserTitle
