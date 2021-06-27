const express = require('express')
const app = express()
require('dotenv').config()
const fs = require('fs')
const log = require('./logger')

let apps = fs.readdirSync(__dirname + '/apps')
let jobs = fs.readdirSync(__dirname + '/jobs')
let logs = fs.readdirSync(__dirname + '/logs')
log('start', {})

app.get('/', (req, res) => {
    res.send(
        ['logs', ...apps]
            .map((module) => {
                return `
            <div class="link-to-app">
                <a href="/${module}">
                    <button>${module}</button>
                </a>
            </div>`
            })
            .join('')
    )
})
apps.forEach((module) => {
    app.use(`/${module}`, require(`./apps/${module}`).app)
})
jobs.forEach((job) => {
    require(`./jobs/${job}/index`).init()
})

app.get('/logs', (req, res) => {
    res.send(
        logs
            .map((log) => {
                return `
            <div class="link-to-log">
                <a href="/logs/${log.split('.')[0]}">
                    <button>${log.split('.')[0]}</button>
                </a>
            </div>`
            })
            .join('')
    )
})

app.get('/logs/:log', (req, res) => {
    let logfile = req.params.log
    let json = fs.readFileSync(`${__dirname}/logs/${logfile}.json`)

    res.send(json.toString())
})

app.listen(process.env.PORT || 80)

console.log('server started!')
