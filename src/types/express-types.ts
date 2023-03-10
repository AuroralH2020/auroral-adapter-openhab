import { NextFunction, Request, Response } from 'express'

export interface CustomRequestObject<P extends {} = {}, B extends {} = {}, Q extends {} = {} > extends Request {
	params: P,
	body: B,
	query: Q
}

export interface CustomResponseObject<L extends {} = {}> extends Response {
	locals: L
}

type ControllerReturnType<T> = ApiResponse<T> | Promise<ApiResponse<T>> | ReturnType<NextFunction>

// For now lets just agree to use the interface, latter we can maybe create factory for controllers or something like that
export interface Controller<ReqParams extends {} = {}, ReqBody extends {} = {}, ReqQuery extends {} = {}, Result = null, ResLocals extends {} = {}> {
	(req: CustomRequestObject<ReqParams, ReqBody, ReqQuery>, res: CustomResponseObject<ResLocals>, next: NextFunction): ControllerReturnType<Result>
}

export interface ControllerWithoutResponse<ReqParams extends {} = {}, ReqBody extends {} = {}, ReqQuery extends {} = {}, Result = null, ResLocals extends {} = {}> {
	(req: CustomRequestObject<ReqParams, ReqBody, ReqQuery>, res: CustomResponseObject<ResLocals>, next: NextFunction): any
}

export type ApiResponse<T> = Response<{
    error: boolean,
	statusCode: number,
	statusCodeReason?: string | null,
	contentType: string,
    message?: T
}>
