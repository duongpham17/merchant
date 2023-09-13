import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { EMAIL_SIGNUP, EMAIL_LOGIN } from '../@email/authentication';
import { asyncBlock, appError } from '../@utils/helper';
import { InjectUserToRequest } from '../@types/models';

import User from '../models/users';

import {createSecureToken} from '../middleware/authentication';

export const restrictTo = (...roles: string[]) => {
    return (req: any, res: Response, next: NextFunction) => {
        if(!roles.includes(req.user.role)){
            return next(new appError('You do not have permission to perform this action', 403))
        }
        next();
    }
};

export const protect = asyncBlock(async(req: InjectUserToRequest, res: Response, next: NextFunction) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }

    if(!token) return next(new appError('Login to access these features', 401));

    const jwt_secret:any = process.env.JWT_SECRET;

    const decodedId:any = jwt.verify(token, jwt_secret);

    const existingUser = await User.findById(decodedId.id).select(['role']);

    if(!existingUser) return next(new appError('The user belonging to this token does not exist.', 401));

    req.user = existingUser;

    next();
});

export const persist = asyncBlock(async (req: InjectUserToRequest, res: Response, next: NextFunction) => {

    const id = req.user._id;

    const user = await User.findById(id);

    if(!user) return next(new appError('please log back in for a new token', 401));

    res.status(201).json({
        status: "success",
        data: user
    });
});

export const login = asyncBlock(async(req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;

    let user = await User.findOne({email});

    const host = req.headers.referer;
    
    if(!host) return next(new appError("Host is unknown", 401))

    if(user){
        const {code, hashToken} = user.createVerifyToken();

        const confirmURL = `${host}confirm/${`${code}-${hashToken}`}`;
    
        await EMAIL_LOGIN({
            email: user.email,
            url: confirmURL,
            host,
            code,
        });
    };

    if(!user) {
        user = await User.create({ email, verified: false });

        const {code, hashToken} = user.createVerifyToken();

        const confirmURL = `confirm/${code}-${hashToken}`;
    
        await EMAIL_SIGNUP({
            email: user.email,
            url: confirmURL,
            host,
            code
        });
    };

    res.status(200).json({
        status: "success",
        message: 'sent'
    });
});

export const confirmWithEmail = asyncBlock(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.params.token;

    const [code, confirmation] = token.split("-");

    let user = await User.findOne({confirmation}).select('+code');

    if(!user) return next(new appError("User does not exist, signup again.", 401));
    
    const linkExpired = Date.now() > user.confirmation_expiration;

    if(linkExpired) return next(new appError("This confirmation code no longer exist", 401));

    const correctUser = !user || await user.correctPassword(code, user.code);

    if (!correctUser) return next(new appError("User does not exist, signup again.", 401));

    user = await User.findOneAndUpdate({confirmation}, {$unset: {code: 1, confirmation: 1, verified: 1, link_expiration_time: 1}}, {new: true});

    if(!user) return next(new appError("User does not exist, signup again.", 401));

    const cookie = createSecureToken(user._id as string);

    res.status(200).json({
        status: "success",
        data: user,
        cookie
    });
});

export const confirmWithCode = asyncBlock(async (req: Request, res: Response, next: NextFunction) => {
    const {code, email} = req.body;

    let user = await User.findOne({email}).select('+code');

    if(!user) return next(new appError("User does not exist, signup again", 401));

    const linkExpired = Date.now() > user.confirmation_expiration;

    if(linkExpired) return next(new appError("This confirmation code no longer exist", 401));

    const correctUser = !user || await user.correctPassword(code, user.code);

    if (!correctUser) return next(new appError("Invalid code", 401));

    user = await User.findOneAndUpdate({email}, {$unset: {code: 1, confirmation: 1, verified: 1, link_expiration_time: 1}}, {new: true});
    
    if(!user) return next(new appError("Invalid code", 401));

    const cookie = createSecureToken(user._id as string);

    res.status(200).json({
        status: "success",
        data: user,
        cookie
    });
});