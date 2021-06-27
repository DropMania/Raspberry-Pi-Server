const express = require('express')
const cheerio = require('cheerio')
const fetch = require('node-fetch')
const moment = require('moment')
let app = express()

const PAGES = [
    {
        url: 'https://mein-mmo.de/ps5-kaufen-februar-2021-4-welle-start/',
        selector: '.gp-entry-content p',
        matchStr: 'Update:'
    },
    {
        url: 'https://www.gamepro.de/artikel/ps5-4-welle-aktueller-stand,3364341.html',
        selector: '.article-content p',
        matchStr: 'Update,'
    }
]
app.use(express.static(__dirname))
moment.locale('German')

app.get('/get', async (req, res) => {
    let response = []
    for (page of PAGES) {
        let pageResult = await getResponse(
            page.url,
            page.selector,
            page.matchStr
        )
        response = [...response, ...pageResult]
    }
    response.sort((a, b) => {
        return b.time - a.time
    })
    res.send(response)
})

async function getResponse(page, selector, matchStr) {
    let r = await fetch(page)
    let html = await r.text()
    let $ = cheerio.load(html)

    return $(selector)
        .toArray()
        .filter((el) => $(el).text().includes(matchStr))
        .map((el) => ({
            content: $(el).not('strong').text(),
            title: $(el).children('strong').text(),
            time: moment(
                $(el).children('strong').text(),
                'DD. MMMM, HH:mm',
                'de'
            ),
            html: $(el).html()
        }))
}
module.exports = { app }
