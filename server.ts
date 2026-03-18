
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = 4000
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }).listen(port, (err) => {
      if (err) throw err;
      console.log("> Server started on http://localhost:4000");
    });
  }).catch(ex => {
    console.error(ex.stack)
    process.exit(1)
  })

/*
var https = require('https');
var fs = require('fs');
const next = require('next')
const { parse } = require("url");
var path = require('path');

const dev = process.env.NODE_ENV !== 'production'
const port = process.env.PORT || 3000
const app = next({ dev })
const handle = app.getRequestHandler()


const httpsOptions = {
    key: fs.readFileSync(path.resolve("./certificates/rootCAKey.pem")),
    cert: fs.readFileSync(path.resolve("./certificates/rootCACert.pem")),
    ca: [fs.readFileSync(path.resolve("./certificates/myCA.key"))]
  };
  
  app.prepare().then(() => {
    https.createServer(httpsOptions, (req, res) => {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    }).listen(port, (err) => {
      if (err) throw err;
      console.log("> Server started on https://localhost:3000");
    });
  }).catch(ex => {
    console.error(ex.stack)
    process.exit(1)
  })
*/
  export {};
