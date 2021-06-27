const express = require('express')
const app = express()
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')
const port = new SerialPort('/dev/ttyUSB0')
const parser = port.pipe(new Readline({ delimiter: '\r\n' }))
const execa = require('execa');
require('serialport')
let currentTemp
parser.on('data', (data) => {
    currentTemp = data
})
app.get('/get', async (req, res) => {
    let roomTemp = {TEMP:'0',HUM:'0'}
    try{
        roomTemp = JSON.parse(currentTemp) 
    }catch(e){}
    let piTemp = execa.commandSync('/opt/vc/bin/vcgencmd measure_temp')
        .stdout
        .split('=')[1]
        .split('\'')[0]
    res.send({...roomTemp, PI: piTemp})
})
app.use(express.static(__dirname))
module.exports = { app }
