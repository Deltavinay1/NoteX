import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { decode, sign, verify } from 'hono/jwt'
import { signinInput, signupInput } from "@dkashyap27/notion-common"

export const userRouter = new Hono<
    {
        Bindings: {
            DATABASE_URL: string // Environment variable for the database URL
            JWT_SECRET: string // Environment variable for JWT secret
        },
        Variables: {
            userId: string
        }
    }
>();

userRouter.post('/signup', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body = await c.req.json()
    const { success } = signupInput.safeParse(body);
    if(!success) {
        c.status(411);
        return c.json({ error: "Invalid inputs" });
    }

    try {
        const user = await prisma.user.create({
            data: {
                username: body.username,
                password: body.password,
                name: body.name,
            }
        });
        const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
        return c.json({ jwt });
    } catch (e) {
        c.status(403);
        return c.json({ error: "Error while signing up" });
    }
})

userRouter.post('/signin', async (c) => {
    const prisma = new PrismaClient({
        datasourceUrl: c.env?.DATABASE_URL,
    }).$extends(withAccelerate());

    const body = await c.req.json();
    const { success } = signinInput.safeParse(body);
    if(!success) {
        c.status(411);
        return c.json({ error: "Invalid inputs" });
    }

    try {
        const user = await prisma.user.findFirst({
            where: {
                username: body.username,
                password: body.password,
            }
        })

        if (!user) {
            c.status(403);
            return c.json({ error: "Invalid credentials" });
        }
        const jwt = await sign({ id: user.id }, c.env.JWT_SECRET);
        return c.json({ jwt });

    } catch (e) {
        c.status(411);
        return c.text("Could not sign in user");
    }
})