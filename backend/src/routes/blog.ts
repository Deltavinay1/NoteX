import { Hono } from 'hono'
import { verify } from 'hono/jwt';
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { auth } from 'hono/utils/basic-auth';
import { createBlogInput, updateBlogInput } from '@dkashyap27/notion-common';


export const blogRouter = new Hono<
    {
        Bindings: {
            DATABASE_URL: string // Environment variable for the database URL
            JWT_SECRET: string // Environment variable for JWT secret
        },
        Variables: {
            userId: string // This will hold the user ID from the JWT token
        }
    }
>();

blogRouter.use('/*', async (c, next) => {
    try {
        const authHeader = c.req.header("Authorization") || "";
        const user = await verify(authHeader, c.env.JWT_SECRET);

        if (user) {
            //pass the authorId to the context for further use
            c.set("userId", user.id as string);
            return await next();
        }
        else {
            c.status(403);
            return c.json({ error: "Unauthorized" });
        }
    } catch (e) {
        c.status(403);
        return c.json({
            message: "You are not logged in."
        })
    }
})

blogRouter.post('/', async (c) => {
    const body = await c.req.json();
    const { success } = createBlogInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({ error: "Invalid inputs" });
    }
    const authorId = c.get("userId");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blog = await prisma.blog.create({
        data: {
            title: body.title,
            content: body.content,
            author: {
                connect: {
                    id: Number(authorId) // Ensure body contains authorId
                }
            }
        }
    })

    return c.json({
        id: blog.id,
    })
})

blogRouter.put('/', async (c) => {
    const body = await c.req.json();
    const { success } = updateBlogInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({ error: "Invalid inputs" });
    }
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const blog = await prisma.blog.update({
        where: {
            id: body.id
        },
        data: {
            title: body.title,
            content: body.content,
        }
    })

    return c.json({
        id: blog.id
    })
})


// Pagination to be added 
blogRouter.get('/bulk', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL,
        }).$extends(withAccelerate());

        const blogs = await prisma.blog.findMany({
            select: {
                content: true,
                title: true,
                id: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        });
        return c.json({
            blogs
        });
    } catch (e) {
        c.status(411);
        return c.json({
            message: "Error while fetching blogs"
        })
    }
})

blogRouter.get('/:id', async (c) => {
    const id = await c.req.param("id");
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    try {
        const blog = await prisma.blog.findFirst({
            where: {
                id: Number(id)
            },
            select: {
                id : true,
                title: true,
                content: true,
                author: {
                    select: {
                        name: true
                    }
                }
            }
        })

        return c.json(blog);
    } catch (e) {
        c.status(411);
        return c.json({
            message: "Error while fetching blog"
        })
    }
})
