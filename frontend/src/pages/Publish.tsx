import axios from "axios"
import { Appbar } from "../components/Appbar"
import { BACKEND_URL } from "../config"
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Publish = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  return <div>
    <Appbar />
    <div className="flex justify-center w-full pt-8">
      <div className="max-w-screen-lg w-full">
        <input onChange={(e) => {
          setTitle(e.target.value);
        }} type="text" className="w-full  bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-full p-2.5 focus:outline-none" placeholder="Title" />
        <div className="mt-4">
          <TextEditor onChange={(e) => {
            setContent(e.target.value);
          }} />
        </div>
        <button onClick={async () => {
          const response = await axios.post(`${BACKEND_URL}/api/v1/blog`, {
            title,
            content,
          }, {
            headers: {
              Authorization: localStorage.getItem("token")
            }
          })
          navigate(`/blog/${response.data.id}`);
        }} type="submit" className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2">
          Publish blog
        </button>
      </div>
    </div>
  </div>
}

function TextEditor({ onChange }: { onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void }) {
  return (
    <form>
      <div className="w-full mb-4 border border-gray-200 rounded-lg bg-gray-50">
        <textarea onChange={onChange} id="editor" rows={10} className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:outline-none block w-full p-2.5" placeholder="Write a blog..." required ></textarea>
      </div>

    </form>


  )
}