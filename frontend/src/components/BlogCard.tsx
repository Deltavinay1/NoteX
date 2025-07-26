import { Link } from "react-router-dom";

interface BlogCardProps {
    id: number;
    authorName: string;
    title: string;
    content: string;
    publishedDate: string;
}

export const BlogCard = ({ authorName, title, content, publishedDate, id }: BlogCardProps) => {
    return <Link to={`/blog/${id}`}>
        <div className="p-4 border-b border-slate-200 pb-2 w-screen max-w-screen-md cursor-pointer">
            <div className="flex">
                <Avatar name={authorName} />
                <div className="font-extralight pl-2 pr-2 text-sm flex justify-center flex-col">{authorName}</div>
                <div className="flex justify-center flex-col">
                    <Circle />
                </div>
                <div className="pl-2 font-thin text-slate-500 text-sm flex justify-center flex-col">
                    {publishedDate}
                </div>
            </div>
            <div className="text-xl font-bold pt-2">
                {title}
            </div>
            <div className="text-md font-thin ">
                {content.length > 100 ? content.slice(0, 150) + '...' : content}
            </div>
            <div className="text-slate-400 text-xs font-thin pt-2">
                {`${Math.ceil(content.length / 1000)} min read`}
            </div>
        </div>
    </Link>
}

export function Circle() {
    return <div className="h-1 w-1 rounded-full bg-slate-500">

    </div>
}

export function Avatar({ name, size = "small" }: { name: string, size?: string }) {
    return <div className={`relative inline-flex items-center justify-center ${size === "small" ? "w-6 h-6" : "w-10 h-10"} overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600`}>
        <span className={`${size === "small" ? "text-xs" : "text-md"} text-gray-600 dark:text-gray-300`}>
            {name.split(' ').map(n => n[0].toUpperCase()).join('')}
        </span>
    </div>
}