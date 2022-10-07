// export const AgentAPI = (name: string) => `Hello ${name}`; 

import got, { Method, Headers, Response } from 'got'
import { Config } from '../config'
import { JsonType } from '../types/misc-types'
import { Thing } from '../types/wot-types'

const ApiHeader = { 
    'Content-Type': 'application/json; charset=utf-8',
    Accept: 'application/json',
    simple: 'false' 
}

export interface GenericResponse<T=any> {
    error?: string
    message?: T
    statusCode: number
}

export type AgentInfo = {
    agid: string
    cid: string
    nodes: string[]
    organisation: string
    partners: string[]
    registrations: string
    last_partners_update: string
    last_configuration_update: string
    last_privacy_update: string
}

type ItemStatus = 'Enabled' | 'Disabled' 
type ItemType = 'Device' | 'Service' 
type HealthCheckType = 'OK' | 'Error' 

export class AgentAPI {
    private  callApi
    constructor(agentUrl: string, timeout: number) {
        this.callApi = got.extend({
            prefixUrl: agentUrl + '/',
            responseType: 'json',
            isStream: false,
            throwHttpErrors: false, // If true 4XX and 5XX throw an error
            timeout: { 
                response: timeout
            }, 
            decompress: true // accept-encoding header gzip
        })
    }
    private request = async (endpoint: string, method: Method, json?: any, headers?: Headers, searchParams?: any): Promise<GenericResponse> => {
        const response = await this.callApi(endpoint, { method, json, headers, searchParams }) as unknown as Response<GenericResponse>
        return response.body
    }
    // Authentification
    public login = async (oid: string): Promise<GenericResponse<string>> => {
        return this.request('api/login', 'GET', { oid })
    }
    public logout = async (oid: string): Promise<GenericResponse<string>> => {
        return this.request('api/logout', 'GET', { oid })
    }
    // Registry
    public postRegistration =  async (items: { td: any, avatar?: string }[] | { td: any, avatar?: string }): Promise<GenericResponse<{ name: string, oid: string, password: string, error: string }[]>> => {
        return  this.request('api/registration', 'POST', items, { ...ApiHeader })
    }
    public getRegistrations =  async (): Promise<GenericResponse<string[]>> => {
        return  this.request('api/registration', 'GET', undefined, { ...ApiHeader })
    }
    public putRegistration =  async (items: { td: Thing, avatar?: string }[]): Promise<GenericResponse<{ oid: string, error: string }[]>> => {
        return  this.request('api/registration', 'PUT', items, { ...ApiHeader })
    }
    public getRegistration = async (oid: string): Promise<GenericResponse<{ type: ItemType, adapterId: string, name: string, privacy: string, status: ItemStatus, events?: string[], properties?: string[], actions?: string[] }>> => {
        return this.request(`api/registration/${oid}`, 'GET', undefined, { ...ApiHeader })
    }
    public getOidByAdapterId = async (adapterId: string): Promise<GenericResponse<string>> => {
        return this.request(`api/registration/oid/${adapterId}`, 'GET', undefined, { ...ApiHeader })
    }
    public deleteRegistration = async (oids: string[]): Promise<GenericResponse<{ oid: string, statusCode: number, error?: string}>> => {
        return this.request('api/registration', 'POST', { oids }, { ...ApiHeader })
    }
    // Neighbourhood Discovery
    public getMyOrgNodes = async (): Promise<GenericResponse<{ cid: string, agid: string, company: string}[]>> => {
        return this.request('api/discovery/nodes/organisation', 'GET', undefined, { ...ApiHeader })
    }
    public getNodesInOrg = async (cid: string): Promise<GenericResponse<{ cid: string, agid: string, company: string}[]>> => {
        return this.request(`api/discovery/nodes/organisation/${cid}`, 'GET', undefined, { ...ApiHeader })
    }
    public getNodesInCommunity = async (ctid: string): Promise<GenericResponse<{ cid: string, agid: string, company: string }[]>> => {
        return this.request(`api/discovery/nodes/community/${ctid}`, 'GET', undefined, { ...ApiHeader })
    }
    public getMyOrgItems = async (): Promise<GenericResponse<{ oid: string, cid: string, name: string, dataAccess: string,  company: string }[]>> => {
        return this.request('api/discovery/items/organisation', 'GET', undefined, { ...ApiHeader })
    }
    public getItemsInContract = async (ctid: string): Promise<GenericResponse<{ oid: string, cid: string, name: string, dataAccess: string,  company: string }[]>> => {
        return this.request(`api/discovery/items/contract/${ctid}`, 'GET', undefined, { ...ApiHeader })
    }
    public getItemsInContractWithPrivacy = async (ctid: string, oid: string): Promise<GenericResponse<{ oid: string, cid: string, name: string, dataAccess: string,  company: string }[]>> => {
        return this.request(`api/discovery/items/contract/${ctid}/origin/${oid}`, 'GET', undefined, { ...ApiHeader })
    }
    // Local Semantic Discovery
    public getLocalTD = async (oid: string): Promise<GenericResponse<Thing>> => {
        return this.request(`api/discovery/local/td/${oid}`, 'GET', undefined, { ...ApiHeader })
    }
    public sparqlLocal = async (query: string): Promise<GenericResponse<any>> => {
        return this.request('api/discovery/local/semantic', 'POST', query, { ...ApiHeader })
    }
    // Remote Semantic Discovery
    public getRemoteTD = async (agid: string, oids: string[]): Promise<GenericResponse<{ oid: string, success: boolean, td?: Thing }[]>> => {
        return this.request(`api/discovery/remote/td/${agid}`, 'GET', undefined, { ...ApiHeader }, { oids: oids.join(',') })
    }
    public sparqlRemote = async (query: string, agids: string[]): Promise<GenericResponse<any>> => {
        return this.request('api/discovery/remote/semantic', 'POST', query, { ...ApiHeader }, { agids: agids.join(',') })
    }
    public sparqlCommunity = async (query: string, commId: string): Promise<GenericResponse<any>> => {
        return this.request(`api/discovery/remote/semantic/community/${commId}`, 'POST', query, { ...ApiHeader })
    }
    public sparqlMyorganisation = async (query: string): Promise<GenericResponse<any>> => {
        return this.request('api/discovery/remote/semantic/community/myorganisation', 'POST', query, { ...ApiHeader })
    }
    // Consumption
    public readProperty = async (oid: string, remoteOid: string, pid: string, queryParams?: JsonType): Promise<GenericResponse<JsonType>> => {
        return this.request(`api/properties/${oid}/${remoteOid}/${pid}`, 'GET', undefined, { ...ApiHeader }, queryParams ? queryParams : undefined)
    }
    public writeProperty = async (oid: string, remoteOid: string, pid: string, body: JsonType, queryParams?: JsonType): Promise<GenericResponse<JsonType>> => {
        return this.request(`api/properties/${oid}/${remoteOid}/${pid}`, 'PUT', body, { ...ApiHeader }, queryParams ? queryParams : undefined)
    }
    public getEventChannels = async (oid: string, remoteOid: string): Promise<GenericResponse<string[]>> => {
        return this.request(`api/events/remote/channels/${oid}/${remoteOid}`, 'GET', undefined, { ...ApiHeader })
    }
    public getEventChannelStatus = async (oid: string, remoteOid: string, eid: string): Promise<GenericResponse<string>> => {
        return this.request(`api/events/remote/${oid}/${remoteOid}/${eid}`, 'GET', undefined, { ...ApiHeader })
    }
    public subscribeEventChannel = async (oid: string, remoteOid: string, eid: string): Promise<GenericResponse<string>> => {
        return this.request(`api/events/remote/${oid}/${remoteOid}/${eid}`, 'PUT', undefined, { ...ApiHeader })
    }
    public unsubscribeEventChannel = async (oid: string, remoteOid: string, eid: string): Promise<GenericResponse<string>> => {
        return this.request(`api/events/remote/${oid}/${remoteOid}/${eid}`, 'DELETE', undefined, { ...ApiHeader })
    }
    public createEventChannel = async (oid: string, eid: string, body: JsonType): Promise<GenericResponse<string>> => {
        return this.request(`api/events/local/${oid}/${eid}`, 'POST', body, { ...ApiHeader })
    }
    public removeEventChannel = async (oid: string, eid: string): Promise<GenericResponse<string>> => {
        return this.request(`api/events/local/${oid}/${eid}`, 'DELETE', undefined, { ...ApiHeader })
    }
    public sendEventToChannel = async (oid: string, eid: string, body: JsonType): Promise<GenericResponse<string>> => {
        return this.request(`api/events/local/${oid}/${eid}`, 'PUT', body, { ...ApiHeader })
    }
    // Colaboration
    public getPartners = async (): Promise<GenericResponse<string[]>> => {
        return this.request('api/collaboration/partners', 'GET', undefined, { ...ApiHeader })
    }
    public getPartnerInfo = async (cid: string): Promise<GenericResponse<{ nodes: string[], name: string }>> => {
        return this.request(`api/collaboration/partners/${cid}`, 'GET', undefined, { ...ApiHeader })
    }
    public getPartnerContract = async (cid: string): Promise<GenericResponse<{ ctid: string, cid: string, items: string[] }>> => {
        return this.request(`api/collaboration/contracts/${cid}`, 'GET', undefined, { ...ApiHeader })
    }
    public getMyCommunities = async (): Promise<GenericResponse<{ description: string, name: string, commId: string }[]>> => {
        return this.request('api/collaboration/communities', 'GET', undefined, { ...ApiHeader })
    }
    // Admin
    public getAgentInfo = async (): Promise<GenericResponse<AgentInfo>> => {
        return this.request('api/agent/info', 'GET', undefined, { ...ApiHeader })
    }
    public getHealthCheck = async (): Promise<GenericResponse<{Redis: HealthCheckType, Gateway: HealthCheckType, NodeApp: HealthCheckType}>> => {
        return this.request('api/agent/health', 'GET', undefined, { ...ApiHeader })
    }
    public exportRegistrations = async (): Promise<GenericResponse<JsonType>> => {
        return this.request('api/agent/export', 'GET', undefined, { ...ApiHeader })
    }
    public importRegistrations = async (body: JsonType): Promise<GenericResponse<JsonType>> => {
        return this.request('api/agent/import', 'POST', body, { ...ApiHeader })
    }
}

export const agent = new AgentAPI(Config.AGENT.URL, Number(Config.AGENT.TIMEOUT))
