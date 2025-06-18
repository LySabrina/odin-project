import { useState } from "react";
import "./App.css";
import CV from "./components/CV.jsx";
import Sidebar from "./components/Sidebar.jsx";
import "./index.css";
function App() {
  const [preview, setPreview] = useState(false);

  return (
    <>
      <Sidebar setPreview={setPreview} />
      <CV preview={preview} />
    </>
  );
}

export default App;
