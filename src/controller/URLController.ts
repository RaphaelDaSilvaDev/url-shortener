import { config } from '../config/Contants'
import { Request, Response } from 'express'
import shortId from 'shortid'
import { URLModel } from '../database/model/url'

export class URLController {
    public async shorten(request: Request, response: Response): Promise<void> {
        const { originURL } = request.body
        const url = await URLModel.findOne({ originURL })
        if (url) {
            response.json(url)
            return
        }
        const hash = shortId.generate()
        const shortURL = `${config.API_URL}/${hash}`
        const newurl = await URLModel.create({
            hash,
            shortURL,
            originURL
        })
        response.json(newurl)
    }

    public async redirect(request: Request, response: Response): Promise<void> {
        const { hash } = request.params
        const url = await URLModel.findOne({ hash })

        if (url) {
            response.redirect(url.originURL)
            return
        }

        response.status(400).json({ error: 'URL not found' })
    }
}