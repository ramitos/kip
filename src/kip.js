var Negotiator = require('negotiator').Negotiator,
    interpolate = require('util').format,
    Monitor = require('./monitor'),
    ignored = require('./ignored'),
    parse = require('./parsers'),
    Cache = require('./cache'),
    finish = require('./finish'),
    moment = require('moment'),
    mime = require('mime'),
    Map = require('./map'),
    path = require('path'),
    url = require('url'),
    fs = require('fs')

var is = Object()

module.exports = function () {
  var opts = Object()
  var root = '.'
    
  if(typeof arguments[0] === 'object') opts = arguments[0]
  else { root = arguments[0]; opts = arguments[1] }
  
  return kip(parse.root(root), parse.options(opts))
}

var kip = function (root, opts) {
  var monitor = Monitor(root)
  var cache = Cache(opts.cache, root, monitor)
  var igfiles = Object()
  var filter = Object()
  var which = Object()
  var map = Map(root, monitor)
  
  ignored(root, igfiles, monitor)
  
  which.file = function () {
    return path.join(root, decodeURI(url.parse(arguments[0]).pathname))
  }
  
  which.encoding = function (req) {
    var negotiator = new Negotiator(req)
    return negotiator.preferredEncoding(Array('gzip', 'deflate', 'compress', 'identity'))
  }
    
  filter.method = function (req, res) {
    var allowed = req.method.match(/get/i) || req.method.match(/head/i)
    if(allowed) return true
    res.setHeader('Allow', 'GET, HEAD')
    finish(res, 405)
    return false
  }
  
  filter.ignored = function (file, res) {
    var ignored = igfiles[file]
    if(!ignored) return true
    finish(res, 403)
    return false
  }
  
  return function (req, res, next) {
    var file = which.file(req.url)
    var stat = map[file]
    if(!stat) return next()
    if(!filter.method(req)) return
    if(!filter.ignored(file)) return
    
    var cetag = req.headers['if-none-match']
    var mtime = moment(stat.mtime).valueOf()
    var headers = Object()
    var cmatch = Object()
    
    var setag = [stat.ino, stat.size, mtime].join('-').toString()
    var cmtime = moment(req.headers['if-modified-since'])
    
    res.setHeader('Last-Modified', moment(stat.mtime).toDate().toUTCString())
    res.setHeader('Date', moment().toDate().toUTCString())
    res.setHeader('ETag', setag)
        
    if(!is.modified(cmtime, cetag, setag, mtime)) return finish(res, 304)
    
    var ctype = mime.lookup(file)
    var charset = mime.charsets.lookup(ctype, 'UTF-8')
    var encoding = which.encoding(req)
    
    res.setHeader('Expires', moment().add('s', opts.maxage).toDate().toUTCString())
    res.setHeader('Cache-Control', interpolate('max-age=%s, private', opts.maxage))
    res.setHeader('Content-Type', ctype + (charset ? '; charset=' + charset : ''))
    res.setHeader('Content-Encoding', encoding)
    res.setHeader('Vary', 'Accept-Encoding')
    
    if(req.method === 'HEAD') return finish(res, 200)
    
    var cached = cache.get(encoding, file)
    if(cached) finish.cached(res, cached)
    else finish.send(res, cache, file, encoding)
  }
}

is.modified = function (cmtime, cetag, setag, mtime) {
  return (cmtime || cetag) && (!cetag || cetag === setag) && (!cmtime || cmtime >= mtime)
}