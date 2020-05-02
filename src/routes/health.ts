import express from 'express'
import healthController from '../controllers/HealthController'

const router = express.Router()

router.get('/', healthController.getVersionResponse)

export default router