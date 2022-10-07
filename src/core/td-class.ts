// Thing Description Class
import { OHItem, OHType, OHProperty, OHSemantics } from '../types/openhab-types'
import { logger } from '../utils'
import { mapping } from './auroralMapping'

export type wotTD = { 
    adapterId: string, 
    '@context': string[]
    title: string, 
    properties: { [x: string]: WotProperty } 
    '@type': string
    security: string[]
    securityDefinitions: any
}

export type WotProperty = {
    title: string
    type?: string
    monitors: string
    measures?: string
    forms?: { 
        op: string[],
        href: string
    }[]
    // To Be Updated
    readOnly?: boolean
}

export type Property = {
    pid: string
    name: string
    type?: string
    monitors: string
    measures?: string
    form: { 
        op: string[],
        href: string
    }
    // To Be Updated
    readOnly?: boolean
    link?: string
    tags?: string[]
    category?: string
    pattern?: string
}

export class TD {
    readonly adapterId: string
    public type: string
    public name: string
    public oid: string | undefined 
    public propertiesMap = new Map<string, Property>()
   
    // Creating event channel
    constructor(adapterId: string, name: string, thingTypeUID?: string) {
        this.adapterId = adapterId
        this.name = name
        this.type = 'Device'
        // Get type using auroral mapping
        if (thingTypeUID) {
            const auroralMapping = mapping.typeMapping.get(thingTypeUID)
            this.type = auroralMapping ? auroralMapping : 'Device'
        } 
    }

    public addProperty(item: OHItem) {
        if (this.propertiesMap.has(item.name)) {
            logger.debug('Property already exists')
        } else {
            const prop: Property = {
                pid: item.name,
                name: item.name,
                category: item.category,
                monitors: 'NA',
                link: item.link,
                form: {
                    op: [
                        'readproperty'
                    ],
                    href: 'http://192.168.0.150:8080/rest/items/' + item.name + '/state'
                }
            }
            // Extract semantics
            const semantics: Set<OHSemantics> = new Set(item.type.split(':') as OHSemantics[]) // We need only unique
            if (item.label) {
                semantics.add(item.label as OHSemantics)
            }
            if (item.category) {
                semantics.add(item.category)
            }
            prop.tags = item.tags.concat(Array.from(semantics))
            // console.log(prop.tags)
            // TBD PETER
            for (const it of semantics) {
                if (mapping.propertyMapping.has(it)) {
                    prop.monitors = mapping.propertyMapping.get(it)!
                }
                if (it in OHType) {
                    prop.type = it.toLowerCase()
                }
            }
            // readonly?
            prop.readOnly = true // For now all read only
            // Extract pattern
            if (item.stateDescription && item.stateDescription.options && item.stateDescription.options.length > 0) {
                prop.pattern = item.stateDescription.pattern
            }
            // Extract measures from pattern
            if (prop.pattern) {
                if (prop.pattern.includes('%unit%')) {
                    const stateArray = item.state.split(' ')
                    prop.measures = stateArray.length > 0 ? stateArray[1] : undefined
                }
            }
            this.propertiesMap.set(item.name, prop)
        }
    }

    // Extract valid property according WoT standard
    public getWoTProperties(): { [x: string]: WotProperty } {
        const properties: {[x: string]: WotProperty} = {}
        // console.log(this.propertiesMap.keys())
        for (const key of this.propertiesMap.keys()) {
            const prop = this.propertiesMap.get(key)
            if (prop) {
                properties[key] = {
                    title: prop.name,
                    type: prop.type, 
                    monitors: prop.monitors,
                    measures: prop.measures,
                    forms: [{ 
                        op: prop.form.op,
                        href: prop.form.href
                    }]
                }
            }
        }
        return properties
    }

    // Return valid TD according WoT standard
    public returnTD (): wotTD {
        return {
            adapterId: this.adapterId,
            '@context': [
                'https://www.w3.org/2019/wot/td/v1',
                'https://w3c.github.io/wot-discovery/context/discovery-context.jsonld'
            ], 
            title: this.name,
            '@type': this.type,
            security: ['nosec_sc'],
            securityDefinitions: {
                'nosec_sc': {
                    'scheme': 'nosec'
                  }
            },
            properties: this.getWoTProperties(),
            
        }
    }
}
