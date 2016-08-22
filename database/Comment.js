const Schema = require('mongoose').Schema
const MongoModel = require('./util/MongoModel')

class Comment extends MongoModel {

  constructor (dbconfig) {
    super(dbconfig, 'Comment', new Schema({
      thread: { type: Number, ref: 'Thread' },
      author: { type: Number, ref: 'User' },
      content: String
    }, {
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }))
  }
}

module.exports = Comment
