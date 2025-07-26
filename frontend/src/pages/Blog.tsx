import { Appbar } from "../components/Appbar";
import { FullBlog } from "../components/FullBlog";
import { Spinner } from "../components/Spinner";
import { useBlog } from "../hooks";
import { useParams } from "react-router-dom";

export const Blog = () => {
    const { id } = useParams();
    const { loading, blog } = useBlog(
        {
            id: parseInt(id || "1")
        }
    );
    if (loading || !blog) {
        return <div>
            <Appbar />
            <Spinner />
        </div>
    }
    return <div>
        <FullBlog blog={blog} />
    </div>
}