import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'

const app = new Hono<
  {
    Bindings: {
      DATABASE_URL: string // Environment variable for the database URL
      JWT_SECRET: string // Environment variable for JWT secret
    },
    Variables: {
      userId: string
    }
  }
>()

//Environment variables accessible in this file are being referenced from the wrangler.jsonc file

//Middleware to decode JWT
app.use("/api/v1/blog/*", async (c, next) => {
  const header = c.req.header("Authorization") || "";
  const token = header.split(" ")[1];

  const response = await verify(token, c.env.JWT_SECRET);
  if (response.id) {
    await next();
  } else {
    c.status(403);
    return c.json({ error: "Unauthorized" });
  }
})

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.post('/api/v1/signup', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  const body = await c.req.json()

  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password
      }
    });
    const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({ jwt });
  } catch (e) {
    c.status(403);
    return c.json({ error: "Error while signing up" });
  }
})

app.post('/api/v1/signin', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const user = await prisma.user.findUnique({
    where: {
      email: body.email
    }
  });

  if (!user) {
    c.status(403);
    return c.json({ error: "User not found" });
  }

  const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
  return c.json({ jwt });
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

app.get('/api/v1/blog/:id', (c) => {
  return c.text('Get a specific blog!')
})

export default app
