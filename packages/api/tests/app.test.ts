import request from 'supertest';
import { createApp } from '../src/app';

describe('PariConnect API', () => {
  const app = createApp();

  it.skip('creates a check-in and returns 201', async () => {
    const response = await request(app).post('/api/checkin').send({
      parentId: 'parent-test',
      mood: 'happy'
    });
    expect(response.status).toBe(201);
  });
});
