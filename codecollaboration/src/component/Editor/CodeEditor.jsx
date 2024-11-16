import { useEffect, useRef, useState } from "react";
import * as monaco from "monaco-editor";
import PropTypes from "prop-types";
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../config"; // Import Firebase Firestore configuration
import { toast } from "react-toastify";

function CodeEditor({ socket, roomId }) {
  const editorRef = useRef(null); // Reference to the Monaco Editor instance
  const containerRef = useRef(null); // Reference to the DOM element containing the editor
  const [lastModified, setLastModified] = useState(null); // State to track the last modified timestamp
  const [language, setLanguage] = useState("javascript"); // State to manage language selection

  // Initialize the room in Firestore and load or create code for the room
  const handleRoom = async () => {
    try {
      const docRef = doc(db, "code-database", roomId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // Load existing code and last modified timestamp from Firestore
        const { code, lastModified, language } = docSnap.data();
        editorRef.current.setValue(code || "// Write your code here...");
        setLanguage(language || "javascript"); // Set the language from Firestore
        setLastModified(
          lastModified ? new Date(lastModified.toDate()).toLocaleString() : "N/A"
        );
      } else {
        // Create a new document for the room if it doesn't exist
        await setDoc(docRef, {
          code: "// Write your code here...",
          language: "javascript", // Default language
          lastModified: serverTimestamp(),
        });
        setLastModified("Just now");
      }
    } catch (error) {
      console.error("Error handling room:", error);
    }
  };

  // Save the code to Firestore when the user clicks the save button
  const saveCodeToFirestore = async () => {
    try {
      const docRef = doc(db, "code-database", roomId);
      const code = editorRef.current.getValue();
      await updateDoc(docRef, {
        code,
        language, // Save the current language
        lastModified: serverTimestamp(),
      });
      setLastModified(new Date().toLocaleString());
      toast.success("Code is saved successfully!");
    } catch (error) {
      console.error("Error saving code:", error);
    }
  };

  useEffect(() => {
    // Set up Monaco environment for handling worker files
    self.MonacoEnvironment = {
      getWorker: function (moduleId, label) {
        if (label === "javascript" || label === "typescript") {
          return new Worker(
            new URL("monaco-editor/min/vs/language/typescript/ts.worker.js", import.meta.url)
          );
        }
        return new Worker(
          new URL("monaco-editor/min/vs/editor/editor.worker.js", import.meta.url)
        );
      },
    };

    // Join the room using Socket.io
    socket.emit("joinRoom", roomId);

    // Initialize the Monaco Editor
    const editorInstance = monaco.editor.create(containerRef.current, {
      value: "// Write your code here...",
      language: "javascript", // Default language
      theme: "vs-dark",
      automaticLayout: true,
      minimap: { enabled: true },
      fontSize: 20,
    });

    editorRef.current = editorInstance;

    // Load the room's code from Firestore
    handleRoom();

    // Handle changes to the editor's content
    const handleContentChange = () => {
      const code = editorInstance.getValue();
      socket.emit("codeChange", { roomId, code }); // Emit changes to other users in the room
    };

    const contentChangeDisposable = editorInstance.onDidChangeModelContent(
      handleContentChange
    );

    // Update the editor when code changes are received from the server
    socket.on("codeUpdate", ({ code }) => {
      const currentValue = editorInstance.getValue();
      if (currentValue !== code) {
        editorInstance.setValue(code);
      }
    });

    // Handle window resize to adjust the editor's layout
    const handleResize = () => {
      editorInstance.layout();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      // Clean up listeners and resources when the component unmounts
      contentChangeDisposable.dispose();
      window.removeEventListener("resize", handleResize);
      editorInstance.dispose();
      socket.off("codeUpdate");
      socket.emit("leaveRoom", roomId);
    };
  }, [socket, roomId]);

  // Handle language change
  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    setLanguage(newLanguage);
    monaco.editor.setModelLanguage(editorRef.current.getModel(), newLanguage);
    socket.emit("languageChange", { roomId, language: newLanguage });
  };

  return (
    <div className="h-screen w-full bg-gray-900 text-white flex flex-col">
      <div className="flex justify-between p-4 bg-gray-800">
        {/* Language Selector */}
        <select
          className="bg-gray-700 text-white px-4 py-2 rounded"
          value={language}
          onChange={handleLanguageChange}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          {/* Add more languages as needed */}
        </select>

        <button
          onClick={saveCodeToFirestore}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded"
        >
          Save Code
        </button>
        <div>
          <span className="text-sm text-gray-400">Last Modified: </span>
          <span className="text-sm text-white">{lastModified || "N/A"}</span>
        </div>
      </div>
      <div ref={containerRef} className="flex-1"></div>
    </div>
  );
}

CodeEditor.propTypes = {
  socket: PropTypes.object.isRequired,
  roomId: PropTypes.string.isRequired,
};

export default CodeEditor;
