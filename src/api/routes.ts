/**
 * routes.js
 * Administration router interface
 * Endpoint 'api'
 * User requests information about the system configuration and local infrastructure
 * @interface
 */
// Express router
import { Router } from 'express'
// Middlewares
// Controllers
import { getProperty  } from './controllers'

const ApiRouter = Router()

ApiRouter

// AUTHENTICATION
// .get('/oh/discovery', getItems) // login

.get('/property/:oid/:pid', getProperty) 
// .put('/property/:oid/:pid', getProperty) 

export { ApiRouter }
