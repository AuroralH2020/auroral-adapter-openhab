import dotenv from 'dotenv'
import { logger } from './utils/logger'

dotenv.config()
if (
	!process.env.ADAPTER_ENV || !process.env.ADAPTER_IP
) {
	logger.error('Please provide valid .env configuration')
	process.exit()
}

export const Config = {
	HOME_PATH: process.cwd(),
	NODE_ENV: process.env.NODE_ENV!,
	IP: process.env.ADAPTER_IP!,
	PORT: process.env.ADAPTER_PORT!,
	OPENHAB_ADAPTER_URL: process.env.OPENHAB_ADAPTER_URL || '<this_adapter_url>',
	OPENHAB: {
		URL: process.env.OPENHAB_URL || 'http://localhost:8080',
		TOKEN: process.env.OPENHAB_TOKEN || 'secrettoken'
	},
	HASS: {
		URL: process.env.HASS_URL || 'http://localhost:8080',
		TOKEN: process.env.HASS_TOKEN || 'secrettoken'
	},
	AGENT: {
		URL: process.env.AGENT_URL! || 'http://localhost:81',
		TIMEOUT: process.env.AGENT_TIMEOUT || 30000
	}
}
