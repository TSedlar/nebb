const Schema = require('mongoose').Schema
const MongoModel = require('./util/MongoModel')
const Promises = require('small-node-promise').Promises

class Thread extends MongoModel {

  constructor (dbconfig) {
    super(dbconfig, 'Thread', new Schema({
      category: { type: Number, ref: 'Category' },
      name: String,
      content: String,
      author: { type: Number, ref: 'User' },
      views: { type: Number, default: 0 }
    }, {
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }))
  }

  fetchTeaser (query) {
    return new Promise((resolve, reject) => {
      this.dbconfig.Comment.model
        .findOne(query)
        .populate({
          path: 'author thread',
          populate: { path: 'category' }
        })
        .sort({ created_at: -1 })
        .exec()
          .then(doc => resolve(doc))
          .catch(err => reject(err))
    })
  }

  modifyListing (comments) {
    return new Promise((resolve, reject) => {
      let promises = []
      for (let i = 0; i < comments.length; i++) {
        promises.push(new Promise((res, rej) => {
          let comment = comments[i].toObject()
          Promises.resolveMap({
            teaser: this.fetchTeaser({ thread: comment._id })
          }).then(map => {
            comment.teaser = map.teaser
            comments[i] = comment
            res()
          }).catch(err => rej(err))
        }))
      }
      Promise.all(promises)
        .then(result => resolve(comments))
        .catch(err => reject(err))
    })
  }

  modifyExtras (thread) {
    return new Promise((resolve, reject) => this.dbconfig.Comment.model
      .find({ thread: thread._id })
      .populate({
        path: 'author',
        populate: { path: 'titles' }
      })
      .sort({ created_at: 1 })
      .exec()
        .then(doc => {
          thread = thread.toObject()
          thread.comment_count = doc.length
          thread.comments = doc
          resolve(thread)
        })
        .catch(err => reject(err)))
  }
}

module.exports = Thread
