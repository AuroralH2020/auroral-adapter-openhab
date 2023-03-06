
import { openhab } from '../connectors/openhab-connector'
import { OHThing } from '../types/openhab-types'
import { TD, wotTD } from './td-class'
import { errorHandler, HttpStatusCode, logger, MyError } from '../utils'
import { JsonType } from '../types/misc-types'

// Set of TDs
export const TDs = new Map<string, TD>()
export const oidToAdapterId = new Map<string, string>()

 export const loadItems = async () => {
    try {
        const things = await openhab.getThings() as OHThing[]
        // filter only things with a linkedItems
        for (const thing of things) {
            const filteredChannels = []
            for (const channel of thing.channels) {
                if (channel.linkedItems && channel.linkedItems.length > 0) {
                    filteredChannels.push(channel)
                }
            }
            if (filteredChannels.length > 0) {
                // console.log(JSON.stringify(thing, null, 2))
                const td = new TD(thing.UID, thing.label, thing.thingTypeUID)
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
        const result =  tds.map(it => { 
            const tdObj = TDs.get(it) 
            return tdObj ? tdObj.returnTD() : undefined
        }).filter(it => it)  as any as wotTD[]
        return result
    } catch (err: unknown) {
        const error = errorHandler(err)
        logger.error(error.message)
        return []
    }
}

export const getTd = async (adapterId: string) => {
    const td = TDs.get(adapterId)
    return td ? td.returnTD() : undefined
}

export const getPropertyValue: any = async (oid: string, propertyId: string) => {
        // console.log(oidToAdapterId.values())
        const adapterId = oidToAdapterId.get(oid)
        if (!adapterId) {
            // console.log('AdapterId not found')
            logger.error('AdapterId not found')
                throw new MyError('Item not found', HttpStatusCode.NOT_FOUND)
        }
        const td = TDs.get(adapterId)
        if (!td || !td.propertiesMap.has(propertyId)) {
            throw new MyError('OID/PID not found', HttpStatusCode.NOT_FOUND)
        } 
        const item = await openhab.getItem(propertyId)
        if (!item) {
            throw new MyError('Problem retrieving state from OH', HttpStatusCode.INTERNAL_SERVER_ERROR)
        }
        return getValueFromOHItem(item!)
}

const getValueFromOHItem = (item: JsonType) => {
    if (item.stateDescription && item.stateDescription.pattern) {
        const patternArray = (item.stateDescription.pattern as string).split(' ')
        if (patternArray.length > 1) {
            return item.state.split(' ')[0]
        }
    }
    // TBD
    return JSON.parse(item.state)
}
