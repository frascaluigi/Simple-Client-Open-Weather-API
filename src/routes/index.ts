import express from 'express';
import health from './health';
import weather from './weather';

const router = express.Router()

router.use('/health', health);
router.use('/weather', weather);
//router.use('/auth', auth);

export default router
