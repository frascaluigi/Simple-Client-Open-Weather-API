import supertest from 'supertest';
import {app} from '../app';

const request = supertest(app);

describe('Health Test', () => {
    it('should test that health route is working', async (done) => {
      const response = await request.get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body.env).toBe('test');
      done();
    })
})