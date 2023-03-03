import errorHandler from 'errorhandler'
import * as fs from 'fs'
import { Config } from '../config'

class Mapping {
    private static instance: Mapping
    static getInstance(): Mapping {
        if (!Mapping.instance) {
            Mapping.instance = new Mapping()
        }
        return Mapping.instance
    }
    public async loadFromFS(): Promise<void> {
        // Load property
        const propertyObject = JSON.parse(fs.readFileSync(Config.HOME_PATH +  '/src/mappings/property.json', 'utf8'))
        Object.entries(propertyObject).forEach(([key, value]) => {
            this.propertyMapping.set(key, value as string)
        })
        // Load thingTypes
        const typesObject = JSON.parse(fs.readFileSync(Config.HOME_PATH +  '/src/mappings/thingType.json', 'utf8'))
        Object.entries(typesObject).forEach(([key, value]) => {
            this.typeMapping.set(key, value as string)
        })
    }
    public propertyMapping: Map<string, string> = new Map<string, string>()
    public typeMapping: Map<string, string> = new Map<string, string>()
}

export const mapping = Mapping.getInstance()

