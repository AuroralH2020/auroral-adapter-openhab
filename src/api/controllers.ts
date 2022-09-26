// Controller common imports
import { expressTypes } from '../types/index'
import { HttpStatusCode } from '../utils/http-status-codes'
import { logger, errorHandler } from '../utils'
import { responseBuilder } from '../utils/response-builder'

// Imports
import { loadItems } from '../core/items'
import { Property } from '../core/td-class'

// Controllers

type wotTD = { 
        adapterId: string, 
        name: string, 
        properties: { [x: string]: Property } 
}

type getItemsCtrl = expressTypes.Controller<{}, {}, {}, (wotTD | undefined)[], any>

export const getItems: getItemsCtrl = async (_req, res) => {
    try {
        const items = await loadItems()
        return responseBuilder(HttpStatusCode.OK, res, null, items)
	} catch (err) {
        const error = errorHandler(err)
        logger.error(error.message)
        return responseBuilder(error.status, res, error.message)
	}
}
