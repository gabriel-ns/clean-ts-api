import request from 'supertest'
import app from '../config/app'

describe('NoCache middleware', () => {
  test('Should disable cache', async () => {
    app.get('/test_no_cache', (req, res) => {
      res.send()
    })

    await request(app)
      .get('/test_no_cache')
      .expect('cache-control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
      .expect('pragma', 'no-cache')
      .expect('expires', '0')
      .expect('surrogate-control', 'no-store')
  })
})
