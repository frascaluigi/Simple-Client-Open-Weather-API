import express from 'express'
import { getVersionResponse } from '../controllers/health'
import weather from './weather';
import auth from './auth';

const router = express.Router()

router.use('/health', getVersionResponse);
router.use('/weather', weather);
router.use('/auth', auth);

export default router
