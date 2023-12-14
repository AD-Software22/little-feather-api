import { NextFunction, Request, Response } from 'express'
import * as admin from 'firebase-admin'

import ErrorResponse from './interfaces/ErrorResponse'

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404)
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`)
  next(error)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
  err: Error,
  req: Request,
  res: Response<ErrorResponse>,
  next: NextFunction
) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500
  res.status(statusCode)
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  })
}
export const authenticateFirebaseToken = (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const { authorization } = req.headers

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const idToken = authorization.split('Bearer ')[1]

  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      req.firebaseUserId = decodedToken.uid
      return next()
    })
    .catch((error) => {
      console.error('Firebase authentication error:', error)
      return res.status(401).json({ error: 'Unauthorized' })
    })
}
