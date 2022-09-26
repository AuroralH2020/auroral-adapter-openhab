
import { openhab } from '../connectors/openhab-connector'
import { OHThing, OHItem } from '../types/openhab-types'
import { TD } from './td-class'
import { errorHandler, logger } from '../utils'

// Set of TDs
const TDs = new Map<string, TD>()

 export const loadItems = async () => {
    try {
        const things = await openhab.getThings() as OHThing[]
        logger.debug('Request load devices: ' + things.length)
        // filter only things with a linkedItems
        for (const thing of things) {
            const filteredChannels = []
            for (const channel of thing.channels) {
                if (channel.linkedItems && channel.linkedItems.length > 0) {
                    filteredChannels.push(channel)
                }
            }
            if (filteredChannels.length > 0) {
                const td = new TD(thing.UID, thing.label)
                for (const channel of thing.channels) {
                    for (const linkedItem of channel.linkedItems) {
                        const item = await openhab.getItem(linkedItem)
                        if (item) {
                            td.addProperty(item)
                        }
                    }
                }
                TDs.set(thing.UID, td)
            }
        }
        const tds = Array.from(TDs.keys())
        // Return tds
        return tds.map(it => { 
            const tdObj = TDs.get(it) 
            return tdObj ? tdObj.returnTD() : undefined
        }).filter(it => it)
    } catch (err: unknown) {
        const error = errorHandler(err)
        logger.error(error.message)
        return []
    }
}
