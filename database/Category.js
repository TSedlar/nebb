const Schema = require('mongoose').Schema
const MongoModel = require('./util/MongoModel')
const Promises = require('small-node-promise').Promises

class Category extends MongoModel {

  constructor (dbconfig) {
    super(dbconfig, 'Category', new Schema({
      icon: String,
      icon_color: String,
      name: String,
      description: String
    }, {
      timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    }))
  }

  fetchTeaser (query) {
    return new Promise((resolve, reject) => {
      this.dbconfig.Thread.model
        .findOne(query)
        .populate('author')
        .sort({ created_at: -1 })
        .exec()
          .then(doc => resolve(doc))
          .catch(err => reject(err))
    })
  }

  modifyExtras (categories) {
    return new Promise((resolve, reject) => {
      let promises = []
      for (let i = 0; i < categories.length; i++) {
        promises.push(new Promise((res, rej) => {
          let category = categories[i].toObject()
          Promises.resolveMap({
            topic_count: this.dbconfig.Thread.count({ category: category._id }),
            comment_count: this.dbconfig.Thread.countLinks({
              category: category._id
            }, this.dbconfig.Comment, 'thread', '_id'),
            teaser: this.fetchTeaser({ category: category._id })
          }).then(map => {
            category.topic_count = map.topic_count
            category.comment_count = map.comment_count
            category.teaser = map.teaser
            categories[i] = category
            res()
          }).catch(err => rej(err))
        }))
      }
      Promise.all(promises)
        .then(result => resolve(categories))
        .catch(err => reject(err))
    })
  }
}

module.exports = Category
