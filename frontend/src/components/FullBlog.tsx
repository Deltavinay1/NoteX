import type { Blog } from "../hooks"
import { Appbar } from "./Appbar"
import { Avatar } from "./BlogCard"

export const FullBlog = ({ blog }: { blog: Blog }) => {
    return <div>
        <Appbar />
        <div className="flex justify-center">
            <div className="grid grid-cols-12 pt-200 px-10 w-full max-w-screen-xl pt-20">
                <div className="col-span-8">
                    <div className="text-5xl font-extrabold">
                        {blog.title}
                    </div>
                    <div className="text-slate-500 text-sm pt-2">
                        Posted on 2023-10-01
                    </div>
                    <div className="pt-4">
                        {blog.content}
                    </div>
                </div>
                <div className="col-span-4">
                    <div className="text-slate-600 text-lg">
                        Author
                    </div>
                    <div className="flex w-full">
                        <div className="pr-4 flex flex-col justify-center">
                            <Avatar size="big" name={blog.author.name || "Anonymous"} />
                        </div>
                        <div>
                            <div className="text-lg font-bold">
                                {blog.author.name || "Anonymous"}
                            </div>
                            <div className="text-slate-500 text-sm pt-2">
                                Randon catch phrase about the author's ability to grab the reader's attention.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}