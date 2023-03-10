// Controller common imports
import { expressTypes } from '../types/index'
import { logger, errorHandler, MyError, responseBuilder } from '../utils'

// Imports
import { Property } from '../core/td-class'
import { getPropertyValue } from '../core/items'

// Controllers

type wotTD = { 
        adapterId: string, 
        name: string, 
        properties: { [x: string]: Property } 
}

type getPropertyController = expressTypes.ControllerWithoutResponse<{ oid: string, pid: string }, {}, {}, any, {}>
// TBD fix typing
export const getProperty: getPropertyController = async (req, res) => {
        try {
                const { oid, pid } = req.params
                const value = await getPropertyValue(oid, pid)
                logger.debug(`Property ${pid} of ${oid} is ${value}`)
                res.status(200).json(value)
        } catch (err) {
                const error = errorHandler(err)
                logger.error(error.message)
                res.status(200).json({ 'error': error.message })
                return responseBuilder(error.status, res, error.message)
        }
}
