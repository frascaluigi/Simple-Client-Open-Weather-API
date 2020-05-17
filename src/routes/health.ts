import express from 'express';
import healthController from '../controllers/HealthController';

const router = express.Router();

/**
 * @swagger
 * /health:
 *  get:
 *    tags:
 *      - Health
 *    name: Health
 *    summary: simple endpoint to check if the servers responds
 *    produces:
 *      - application/json
 *    responses:
 *      '200':
 *        description: Server is up and running and returns an object with some information
 */
router.get('/', healthController.getVersionResponse);

export default router;
