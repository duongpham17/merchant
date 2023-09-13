import { Request } from 'express';
import { IUsers } from '../models/users'

export interface InjectUserToRequest extends Request {
    user: IUsers // or any other type
}