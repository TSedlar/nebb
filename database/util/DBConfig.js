const mongoose = require('mongoose')

const UserTitleSchema = require('../UserTitle')
const UserSchema = require('../User')
const CategorySchema = require('../Category')
const ThreadSchema = require('../Thread')
const CommentSchema = require('../Comment')

export class DBConfig {

  constructor (database) {
    mongoose.connect(database)
    this.connection = mongoose.connection
    this.iinc = require('mongoose-auto-increment')
    this.iinc.initialize(this.connection)
    this.UserTitle = new UserTitleSchema(this)
    this.User = new UserSchema(this)
    this.Category = new CategorySchema(this)
    this.Thread = new ThreadSchema(this)
    this.Comment = new CommentSchema(this)
  }

  printEntries (model) {
    return new Promise((resolve, reject) => {
      model.find({}, (err, doc) => {
        if (err) {
          reject(err)
        } else {
          console.log(doc)
          resolve()
        }
      })
    })
  }

  printAllEntries () {
    let models = [this.UserTitle, this.User, this.Category, this.Thread, this.Comment]
    let promises = []
    for (let i = 0; i < models.length; i++) {
      promises.push(this.printEntries(models[i]))
    }
    return Promise.all(promises)
  }
}

module.exports = DBConfig
