const express = require('express')
const mongoose = require('mongoose')
const DBConfig = require('./database/util/DBConfig')

const server = express()
const bodyParser = require('body-parser')

console.log('Connected to express..')

let dbconfig = new DBConfig('mongodb://localhost/nebb-db')

mongoose.connection.on('connected', () => {
  mongoose.connection.db.dropDatabase()
  let TestSchema = require('./test-schema')
  TestSchema.create(dbconfig)
    .then(result => {})
    .catch(err => console.log(err))
})

server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: false }))

server.use(require('connect-livereload')())
server.use(express.static('.'))
server.use(express.static('dist/public'))

server.get('/', (req, res) => {
  res.sendFile('index.html')
})

// Begin API methods

server.post(
  '/api/categories/get',
  (req, res) => dbconfig.Category.model
    .find({})
    .sort({ created_at: -1 })
    .exec()
      .then(doc => dbconfig.Category.modifyExtras(doc))
      .then(doc => res.json(doc))
      .catch(err => res.status(500).send(err))
)

server.post(
  '/api/categories/name',
  (req, res) => dbconfig.Category.model
    .findOne({ _id: req.body.category })
    .select('name')
    .exec()
      .then(doc => res.json(doc))
      .catch(err => res.status(500).send(err))
)

server.post(
  '/api/thread-listing/get',
  (req, res) => dbconfig.Thread.model
    .find({ category: req.body.category })
    .populate('author')
    .exec()
      .then(doc => dbconfig.Thread.modifyListing(doc))
      .then(doc => res.json(doc))
      .catch(err => res.status(500).send(err))
)

server.post(
  '/api/thread/get',
  (req, res) => dbconfig.Thread.model
    .findOne({ category: req.body.category, _id: req.body.thread })
    .populate({
      path: 'author',
      populate: { path: 'titles' }
    })
    .exec()
      .then(doc => dbconfig.Thread.modifyExtras(doc))
      .then(doc => res.json(doc))
      .catch(err => res.status(500).send(err))
)

server.post(
  '/api/thread/view',
  (req, res) => dbconfig.Thread.model
    .findOneAndUpdate({ category: req.body.category, _id: req.body.thread }, { $inc: { views: 1 } })
      .then(doc => res.json({ success: true, views: doc.views }))
      .catch(err => res.status(500).json({ success: false, err: err }))
)

server.post(
  '/api/thread/comments/latest',
  (req, res) => dbconfig.Comment.model
    .findOne({ category: req.body.category, thread: req.body.thread })
    .sort({ created_at: -1 })
    .exec()
      .then(doc => res.json({ success: true, views: doc.views }))
      .catch(err => res.status(500).json({ success: false, err: err }))
)

module.exports = server
