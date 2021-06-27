const express = require('express')
const BulbController = require('magic-hue-controller')
const BULBS = ['192.168.2.108', '192.168.2.112']
const app = express()

app.use(express.static(__dirname + '/public'))
const bulbs = BULBS.map((ip) => new BulbController(ip))

app.get('/changeColor', (req, res) => {
    let color = req.query.color
    let brightness = req.query.brightness
    bulbs.forEach((bulbController) => {
        bulbController.isOnline().then(async (status) => {
            if (status) {
                await bulbController.sendPower(true)
                await bulbController.sendRGB(
                    color
                        .split(',')
                        .map((c) => {
                            return c - ((10 - brightness) / 10) * 255 < 0
                                ? 0
                                : c - ((10 - brightness) / 10) * 255
                        })
                        .join(',')
                )
            } else {
                console.log('offline')
            }
        })
    })
    res.send('done')
})

app.get('/changeWarm', (req, res) => {
    let brightness = req.query.brightness
    bulbs.forEach((bulbController) => {
        bulbController.isOnline().then(async (status) => {
            if (status) {
                await bulbController.sendPower(true)
                await bulbController.sendWarmLevel((255 * brightness) / 10)
            } else {
                console.log('offline')
            }
        })
    })
    res.send('done')
})

module.exports = { app }
