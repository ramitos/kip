# dosiero

Node.js HTTP streaming static server

## api

    var file = require('dosiero')(__dirname + '/static'),
        http = require('http')
    
    var server = require('http').createServer(function (req, res) {
      file(req, res)
    }).listen(1337)

## install

    npm install dosiero
    
## test [![Build Status](https://secure.travis-ci.org/ramitos/dosiero.png?branch=master)](http://travis-ci.org/ramitos/dosiero)
    
    npm test
    

## license

> Copyright (C) 2012 Sérgio Ramos <mail@sergioramos.me> (sergioramos.me)
>         
> Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
>     
> The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
>     
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.