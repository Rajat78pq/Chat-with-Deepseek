import { FaBars, FaUser } from "react-icons/fa";
import { useState } from "react";
import "./App.css";

interface MessageHistory {
  role: string;
  content: string;
}

function App() {
  const [question, setQuestion] = useState("");
  const [messageHistory, setMessageHistory] = useState<MessageHistory[]>([]);

  const handelSubmit = async () => {
    console.log(question);
    try {
      console.log("fetching...");
      setMessageHistory((pre) => [...pre, { role: "user", content: question }]);
      setQuestion("");
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`,
            "HTTP-Referer": "http://localhost:5173", // Optional. Site URL for rankings on openrouter.ai.
            "X-Title": "localhost", // Optional. Site title for rankings on openrouter.ai.
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "deepseek/deepseek-r1:free",
            messages: [{ role: "user", content: question }],
          }),
        }
      );
      const data = await response.json();
      console.log(data);
      const finalAns =
        data.choices?.[0]?.message?.content || "Sorry, I don't know.";
      console.log(finalAns);
      setMessageHistory((pre) => [...pre, { role: "bot", content: finalAns }]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800 shadow-md">
        <FaBars className="text-xl" />
        <h1 className="text-lg font-semibold">ChatGPT</h1>
        <FaUser className="text-xl" />
      </div>

      {/* Chat Area */}
      <div className="flex-grow p-4 overflow-y-auto flex flex-col space-y-4">
        {messageHistory.map((message, index) => (
          <div
            key={index}
            className={`${
              message.role === "user"
                ? "bg-blue-500 self-end"
                : "bg-gray-700 self-start"
            } p-3 rounded-lg w-3/4 shadow-md`}
          >
            {message.content}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-800 flex items-center shadow-md">
        <input
          type="text"
          className="flex-grow p-2 border rounded-lg focus:outline-none bg-gray-700 text-white"
          placeholder="Type a message..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button
          className="ml-2 bg-blue-500 text-white p-2 rounded-lg"
          onClick={handelSubmit}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default App;
