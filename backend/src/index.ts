import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/api/v1/signup', (c) => {
  return c.text('Signup route!')
})

app.post('/api/v1/signin', (c) => {
  return c.text('Signin route!')
})

app.post('/api/v1/blog', (c) => {
  return c.text('Blog creation Route!')
})

app.put('/api/v1/blog', (c) => {
  return c.text('Blog updation Route!')
})

app.get('/api/v1/blog', (c) => {
  return c.text('Get All blogs!')
})

export default app
