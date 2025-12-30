import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ViewPaste() {
  const { id } = useParams();
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPaste() {
      try {
        const res = await fetch(`${API_BASE_URL}/api/pastes/${id}`);
        if (!res.ok) throw new Error("Paste not found");

        const data = await res.json();
        setContent(data.content);
      } catch {
        setError("Paste not found or expired");
      }
    }

    fetchPaste();
  }, [id]);

  if (error)
    return (
      <div>
        <h2>{error}</h2>
      </div>
    );

  return (
    <div>
      <h1>Paste</h1>
      <pre>{content}</pre>
    </div>
  );
}

export default ViewPaste;
