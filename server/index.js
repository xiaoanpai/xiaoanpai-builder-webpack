if(typeof window === 'undefined'){
    global.window = {}
}
if(typeof document === 'undefined'){
    global.document = {}
}

const express = require('express')
const { renderToString } = require('react-dom/server')
const SSR = require('../dist/search-server');

const server = (port) => {
    const app = express();
    app.use(express.static('dist'))

    app.get('/search', (req, res) => {
        const html = renderMarkup(renderToString(SSR));
        res.status(200).send(html)
    })

    app.listen(port, () => {
        console.log('server is running')
    })
}

const renderMarkup = (str) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        ${str}
    </body>
    </html>`;
}

server(process.env.port || 3000)