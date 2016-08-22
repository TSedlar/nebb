class MongoModel {

  constructor (dbconfig, name, schema) {
    this.dbconfig = dbconfig
    this.schema = schema
    this.schema.plugin(dbconfig.iinc.plugin, { model: name, field: '_id' }) // we prefer auto_inc ids
    this.model = dbconfig.connection.model(name, schema)
  }

  promisify (func, args) {
    return new Promise((resolve, reject) => {
      args.push((err, doc) => {
        if (err) {
          reject(err)
        } else {
          resolve(doc)
        }
      })
      this.model[func].apply(this.model, args)
    })
  }

  find (query) {
    return this.promisify('find', [query])
  }

  findOne (query) {
    return this.promisify('findOne', [query])
  }

  count (query) {
    return this.promisify('count', [query])
  }

  findOneAndUpdate (filter, update, options) {
    return this.model.findOneAndUpdate(filter, update, options)
  }

  create (data) {
    return new Promise((resolve, reject) => this.findOne(data)
      .then(doc => {
        if (doc) {
          resolve(doc) // already exists
        } else {
          new this.model(data).save((mErr, mDoc) => { // eslint-disable-line new-cap
            if (mErr) {
              reject(mErr)
            } else {
              resolve(mDoc)
            }
          })
        }
      })
      .catch(err => reject(err)))
  }

  countLinks (query, childModel, childLink, parentLink) {
    return new Promise((resolve, reject) => {
      let promises = []
      this.find(query)
        .then(doc => {
          for (let i = 0; i < doc.length; i++) {
            let parentDoc = doc[i]
            promises.push(new Promise((resolve, reject) => {
              let childQuery = {}
              childQuery[childLink] = parentDoc[parentLink]
              childModel.count(childQuery)
                .then(count => resolve(count))
                .catch(err => resolve(0)) // eslint-disable-line handle-callback-err
            }))
          }
          Promise.all(promises)
            .then(result => {
              let sum = 0
              for (let i = 0; i < result.length; i++) {
                sum += result[i]
              }
              resolve(sum)
            })
        })
        .catch(err => resolve(0)) // eslint-disable-line handle-callback-err
    })
  }
}

module.exports = MongoModel
