# AURORAL Openhab Adapter #

Adapter to integrate Openhab platform into AURORAL

## Pre-requisites ##

Recommended software and skills:

- GIT
- Docker

## Cofiguration ##
- AURORAL NODE configuration:
    - ADAPTER_MODE: proxy
    - ADAPTER_HOST: http://<IP/DNS_of_the_adapter>
    - ADAPTER_PORT: 3002
    - USE_MAPPING: true

- enviroment file:
    - OPENHAB_URL: URL of the Openhab server
    - OPENHAB_TOKEN: [API token](https://www.openhab.org/docs/configuration/apitokens.html) of the Openhab server   
- mappings:
    - Openhab uses different semantic descriptions than AURORAL. There is a mapping file to translate the Openhab semantic to AURORAL semantic. The mapping file is located in the folder `src/mappings` and consists of three files:
        - `property.json`: mapping of Openhab semantic to AURORAL property type
        - `thingType`: mapping of Openhab thing type to AURORAL device type
        - `units.json`: mapping of Openhab unit to AURORAL unit
    - all of them already contains some mappings defined by us but you can add your own mappings (and also pull request this repository)

### Who do I talk to? ###

Developed by bAvenir

* jorge.almela@bavenir.eu
* peter.drahovsky@bavenir.eu