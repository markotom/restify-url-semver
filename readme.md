Restify URL SemVer
==================
> Extract semantic version from URL for [restify](http://mcavage.me/node-restify/).

[![Build Status](https://travis-ci.org/markotom/restify-url-semver.svg?branch=master)](https://travis-ci.org/markotom/restify-url-semver)
[![npm version](https://badge.fury.io/js/restify-url-semver.svg)](http://badge.fury.io/js/restify-url-semver)

# Install

```js
$ npm install restify-url-semver --save
```

# Usage

```js
var restify = require('restify')
var versioning = require('restify-url-semver')
var server = restify.createServer()

// Add restify-url-semver middleware
server.pre(versioning({ prefix: '/api' }))

// [protocol]://[host]/api/v1/foo
server.get({ path: '/foo', version: '1.0.0' }, function (req, res, next) {
  console.log(req.headers['accept-version']) // 1.0.0
})

// [protocol]://[host]/api/v1.2/foo
server.get({ path: '/foo', version: '1.2.0' }, function (req, res, next) {
  console.log(req.headers['accept-version']) // 1.2.0
})
```

Now these formats are available:

+ `[protocol]://[host]/api/v[x]/foo`
+ `[protocol]://[host]/api/v[x].[y]/foo`
+ `[protocol]://[host]/api/v[x].[y].[z]/foo`


## License

The MIT License (MIT)

Copyright (c) 2017 Marco Godínez

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
