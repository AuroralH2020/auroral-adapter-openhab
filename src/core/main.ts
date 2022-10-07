import { logger } from '../utils'
import { AgentAPI, agent } from '../connectors/agent-connector'
import { getTd, loadItems, oidToAdapterId, TDs } from './items'

export const initLoad = async () => {
    try {
        // TBD check if openhab is loaded
        logger.debug('Retrieving devices from openHAB')
        const items = await loadItems()
        // TBD check if agent is loaded
        console.log('Monitored devices: ' + items.length)
        for (const item of items) {
            const oid = (await agent.getOidByAdapterId(item!.adapterId)).message
            if (oid) {
                console.log('OID: ' + oid + '\t' +  item!.adapterId)
                // Add to map
                oidToAdapterId.set(oid, item!.adapterId)
            } else {
                console.log('Registering device: ' +  item!.adapterId)
                // TBD register device
                const td = await getTd(item?.adapterId)
                // console.log(JSON.stringify(td))
                const response = await agent.postRegistration({ td })
                console.log(response)
                if (response.statusCode === 201) {
                    console.log('OID: ' + response.message![0].oid + '\t' +  item!.adapterId)
                    // Add to map
                    oidToAdapterId.set(response.message![0].oid, item!.adapterId)
                } else {
                    console.log('Device registration failed', item?.adapterId)
                }
            } 
        }
    } catch (err: unknown) {
        logger.warn('Error init laod')
    }
}
