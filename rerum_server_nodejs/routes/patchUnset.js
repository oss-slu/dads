import express from 'express'
const router = express.Router()
//This controller will handle all MongoDB interactions.
import controller from '../db-controller.js'
import auth from '../auth/index.js'
import rest from '../rest.js'

router.route('/')
    .patch(auth.checkJwt, controller.patchUnset)
    .post(auth.checkJwt, (req, res, next) => {
        if (rest.checkPatchOverrideSupport(req, res)) {
            controller.patchUnset(req, res, next)
        }
        else {
            res.statusMessage = 'Improper request method for updating, please use PATCH to remove keys from this object.'
            res.status(405)
            next(res)
        }
    }) 
    .all((req, res, next) => {
        res.statusMessage = 'Improper request method for updating, please use PATCH to remove keys from this object.'
        res.status(405)
        next(res)
    })

export default router
