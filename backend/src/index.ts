import { Hono } from 'hono'
import { userRouter } from './routes/user'
import { blogRouter } from './routes/blog'
import { cors } from 'hono/cors'

const app = new Hono<
  {
    Bindings: {
      DATABASE_URL: string // Environment variable for the database URL
      JWT_SECRET: string // Environment variable for JWT secret
    },
  }
>()

app.use('/*', cors());

app.route('/api/v1/user', userRouter);
app.route('/api/v1/blog', blogRouter);

//Environment variables accessible in this file are being referenced from the wrangler.jsonc file

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
