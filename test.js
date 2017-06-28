'use strict'

var assert = require('assert')
var request = require('supertest')
var restify = require('restify')
var sinon = require('sinon')
var versioning = require('./index')

describe('Middleware', function () {
  beforeEach(function () {
    this.next = sinon.spy()
  })

  it('should be a function', function () {
    assert.equal(typeof versioning, 'function')
  })

  it('should returns a function as middleware', function () {
    assert.equal(typeof versioning(), 'function')
  })

  it('should returns an invalid version error', function () {
    var req = { url: '/foo' }
    versioning()(req, null, this.next)
    assert(this.next.calledOnce)
    assert(this.next.calledWith(new restify.InvalidVersionError('This is an invalid version')))
    assert(this.next.args[0][0] instanceof restify.InvalidVersionError)
  })

  it('should returns a valid version in format v[x]', function () {
    var req = { url: '/v1/foo' }
    versioning()(req, null, this.next)
    assert(this.next.calledOnce)
    assert(this.next.calledWithExactly())
    assert.equal(req.headers['accept-version'], '1.0.0')
  })

  it('should returns a valid version in format v[x].[y]', function () {
    var req = { url: '/v1.2/foo' }
    versioning()(req, null, this.next)
    assert(this.next.calledOnce)
    assert(this.next.calledWithExactly())
    assert.equal(req.headers['accept-version'], '1.2.0')
  })

  it('should returns a valid version in format v[x].[y].[z]', function () {
    var req = { url: '/v1.2.3/foo' }
    versioning()(req, null, this.next)
    assert(this.next.calledOnce)
    assert(this.next.calledWithExactly())
    assert.equal(req.headers['accept-version'], '1.2.3')
  })

  it('should returns a valid version in format /prefix/v[x].[y].[z]', function () {
    var req = { url: '/api/v2/foo' }
    versioning({ prefix: '/api' })(req, null, this.next)
    assert(this.next.calledOnce)
    assert(this.next.calledWithExactly())
    assert.equal(req.headers['accept-version'], '2.0.0')
  })
})

describe('Restify URL without prefix', function () {
  before(function () {
    this.server = restify.createServer()
    this.server.pre(versioning())

    this.agent = request(this.server)
  })

  before(function () {
    this.server.get({ path: '/example', version: '1.0.0' }, function (req, res) {
      res.send({ message: 'accept-version: 1.0.0' })
    })

    this.server.get({ path: '/example', version: '1.2.0' }, function (req, res) {
      res.send({ message: 'accept-version: 1.2.0' })
    })

    this.server.get({ path: '/example', version: '1.2.3' }, function (req, res) {
      res.send({ message: 'accept-version: 1.2.3' })
    })
  })

  it('should be able to parse a version in format /v[x]', function (done) {
    this.agent.get('/v1/example').expect(200, function (err, res) {
      if (err) { return done(err) }
      assert.equal(res.body.message, 'accept-version: 1.0.0')
      done()
    })
  })

  it('should be able to parse a version in format /v[x].[y]', function (done) {
    this.agent.get('/v1.2/example').expect(200, function (err, res) {
      if (err) { return done(err) }
      assert.equal(res.body.message, 'accept-version: 1.2.0')
      done()
    })
  })

  it('should be able to parse a version in format /v[x].[y].[z]', function (done) {
    this.agent.get('/v1.2.3/example').expect(200, function (err, res) {
      if (err) { return done(err) }
      assert.equal(res.body.message, 'accept-version: 1.2.3')
      done()
    })
  })
})

describe('Restify URL with prefix', function () {
  before(function () {
    this.server = restify.createServer()
    this.server.pre(versioning({ prefix: '/api' }))

    this.agent = request(this.server)
  })

  before(function () {
    this.server.get({ path: '/example', version: '1.0.0' }, function (req, res) {
      res.send({ message: 'accept-version: 1.0.0' })
    })

    this.server.get({ path: '/example', version: '1.2.0' }, function (req, res) {
      res.send({ message: 'accept-version: 1.2.0' })
    })

    this.server.get({ path: '/example', version: '1.2.3' }, function (req, res) {
      res.send({ message: 'accept-version: 1.2.3' })
    })
  })

  it('should be able to parse a version in format /[prefix]/v[x]', function (done) {
    this.agent.get('/api/v1/example').expect(200, function (err, res) {
      if (err) { return done(err) }
      assert.equal(res.body.message, 'accept-version: 1.0.0')
      done()
    })
  })

  it('should be able to parse a version in format /[prefix]/v[x].[y]', function (done) {
    this.agent.get('/api/v1.2/example').expect(200, function (err, res) {
      if (err) { return done(err) }
      assert.equal(res.body.message, 'accept-version: 1.2.0')
      done()
    })
  })

  it('should be able to parse a version in format /[prefix]/v[x].[y].[z]', function (done) {
    this.agent.get('/api/v1.2.3/example').expect(200, function (err, res) {
      if (err) { return done(err) }
      assert.equal(res.body.message, 'accept-version: 1.2.3')
      done()
    })
  })
})
