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
import { getItems } from './controllers'

const ApiRouter = Router()

ApiRouter

// AUTHENTICATION
.get('/oh/discovery', getItems) // login

export { ApiRouter }
