export type JsonType<T=any> = {
    [x: string]: T
}

export type BasicReponse<T=any> = {
    error?: string
    message?: T
}

export type KeyValue = {
    key: string,
    value: string
}

export enum CONTENT_TYPE_ENUM {
    RDFN3 = 'text/rdf+n3',
	N3 = 'text/n3', 
    NTRIPLES = 'text/ntriples', 
    RDFTTL = 'text/rdf+ttl',
    RDFNT = 'text/rdf+nt', 
    PLAIN = 'text/plain', 
    RDFTURTLE = 'text/rdf+turtle', 
    TURTLE = 'text/turtle',
	APPTURTLE = 'application/turtle', 
    APPXTURTLE = 'application/x-turtle', 
    APPXNICETURTLE = 'application/x-nice-turtle', 
    JSON = 'application/json',
	ODATAJSON = 'application/odata+json', 
    JSONLD = 'application/ld+json', 
    XTRIG = 'application/x-trig', 
    RDFXML = 'application/rdf+xml'
}
