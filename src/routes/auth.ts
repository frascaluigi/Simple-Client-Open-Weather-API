import express, { Request, Response } from 'express'

const router = express.Router()

router.get('/session', (req:Request, res:Response) => {
    const session = {auth: req.isAuthenticated()}
    res.status(200).send(session)
})

router.get('/signout', (req:Request, res:Response) => {
    req.logout();
})

export default router