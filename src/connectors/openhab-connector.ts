import got, { Method, Headers } from 'got'
import { Config } from '../config'
import { logger, errorHandler } from '../utils'
import { OHThing, OHItem } from '../types/openhab-types'

// CONSTANTS 

const openhabApi = got.extend({
  prefixUrl: Config.OPENHAB.URL + '/rest',
  responseType: 'json',
  isStream: false,
  headers: {
    'Authorization': 'Bearer ' + Config.OPENHAB.TOKEN
  },
  retry: 2, // Retries on failure N times
  throwHttpErrors: true, // If true 4XX and 5XX throw an error
  decompress: true // accept-encoding header gzip
})

export const openhab = {
  getThings: async (): Promise<OHThing[]> => {
    try {
        const response = await openhabApi.get('things')
        return response.body as unknown as OHThing[]
    } catch (err: unknown) {
        const error =  errorHandler(err)
        logger.error(error.message)
        return []
    }
  },
  getThing: async (thingId: string): Promise<OHThing | null> => {
    try {
        const response = await openhabApi.get('things/' + thingId)
        // console.log(response.body)
        return response.body as unknown as OHThing
    } catch (err: unknown) {
        const error =  errorHandler(err)
        logger.error(error.message)
        return null
    }
  },
  getItems: async (): Promise<OHItem[]> => {
    try {
        const response = await openhabApi.get('items')
        return response.body as unknown as OHItem[]
    } catch (err: unknown) {
        const error =  errorHandler(err)
        logger.error(error.message)
        return []
    }
  },
  getItem: async (itemId: string): Promise<OHItem  | null> => {
    try {
        const response = await openhabApi.get('items/' + itemId)
        // console.log(response.body)
        return response.body as unknown as OHItem
    } catch (err: unknown) {
        const error =  errorHandler(err)
        logger.error(error.message)
        return null
    }
  },
  postItem: async (itemId: string, value: any) => {
    try {
        const response = await openhabApi.post('items/' + itemId, { json: { state: value } })
        return response.body
    } catch (err: unknown) {
        const error =  errorHandler(err)
        logger.error(error.message)
        return []
    }
  }
}
