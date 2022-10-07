import errorHandler from 'errorhandler'
import stoppable from 'stoppable'
import { mapping } from './core/auroralMapping'
import { app } from './app'
import { Config } from './config'
import { logger, errorHandler as eH } from './utils'
import { initLoad } from './core/main'

/**
 * Error Handler. Provides full stack - only in dev
 */
if (Config.NODE_ENV === 'development') {
  app.use(errorHandler())
}

/**
 * Bootstrap app
 * Initialize gateway
 */
async function bootstrap () {
  try {
    logger.info('##############################################')
    logger.info('##############################################')
    logger.info('Starting AURORAL Openhab adapter!!')
    await mapping.loadFromFS()
    logger.info('##############################################')
    logger.info('##############################################')
  } catch (err: unknown) {
    const error = eH(err)
    logger.error(error.message)
    logger.error('Adapter was stopped due to errors...')
    logger.info('##############################################')
    logger.info('##############################################')
    process.exit(1)
  }
}

/*
  WEB SERVER lifecycle
  Start server
  Connection manager wrapping to end connections gracefully
  Control kill signals
  Control HTTP server errors
*/
function startServer() {
  return stoppable(app.listen(app.get('port'), app.get('ip'), () => {
    // Server started
    logger.info(
      `  App is running at ${app.get('ip')}:${app.get('port')} in ${app.get('env')} mode`)
      initLoad()
    logger.info(`  App root path is ${Config.HOME_PATH}`)
    logger.info('  Press CTRL-C to stop\n')
    bootstrap()
  }), 3000)
}

// App
const server = startServer()

// gracefully shut down server
function shutdown() {
  server.stop((err) => {
    if (err) {
      logger.error(err)
      process.exitCode = 1
    }
    logger.info('BYE!')
    process.exit()
  }) // decorated by stoppable module to handle keep alives 
}

// quit on ctrl-c when running docker in terminal
process.on('SIGINT', () => {
  logger.info('Got SIGINT (aka ctrl-c in docker). Graceful shutdown ')
  shutdown()
})

// quit properly on docker stop
process.on('SIGTERM', () => {
  logger.info('Got SIGTERM (docker container stop). Graceful shutdown ')
  shutdown()
})

// eslint-disable-next-line import/no-default-export
export default server
