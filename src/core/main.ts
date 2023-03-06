import { logger } from '../utils'
import { AgentAPI, agent } from '../connectors/agent-connector'
import { getTd, loadItems, oidToAdapterId, TDs } from './items'

export const initLoad = async () => {
    try {
        // TBD check if openhab is loaded
        logger.debug('Retrieving devices from openHAB')
        const items = await loadItems()
        // TBD check if agent is loaded
        logger.info('Monitored devices: ' + items.length)
        for (const item of items) {
            const oid = (await agent.getOidByAdapterId(item!.adapterId)).message
            if (oid) {
                logger.debug('OID: ' + oid + '\t' +  item!.adapterId)
                // Add to map
                oidToAdapterId.set(oid, item!.adapterId)
            } else {
                logger.debug('Registering device: ' +  item!.adapterId)
                // register device
                const td = await getTd(item?.adapterId)
                // console.log(JSON.stringify(td, null, 2))
                const response = await agent.postRegistration({ td })
                logger.debug('Response: ' + JSON.stringify(response, null, 2))
                if (response.statusCode === 201) {
                    logger.debug('OID: ' + response.message![0].oid + '\t' +  item!.adapterId)
                    // Add to map
                    oidToAdapterId.set(response.message![0].oid, item!.adapterId)
                } else {
                    logger.error('Device registration failed: ' + String(item?.adapterId))
                }
            } 
        }
    } catch (err: unknown) {
        logger.warn('Error init laod')
    }
}
