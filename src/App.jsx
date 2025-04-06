import React, { useState, useEffect, useRef } from "react";

export function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://amber-api-server.onrender.com/api/amber", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error(`Amber server error: ${response.status}`);
      }

      const data = await response.json();
      const amberReply = {
        role: "amber",
        content: data.reply || "Amber responded, but the message was empty.",
      };
      setMessages((prev) => [...prev, amberReply]);
    } catch (error) {
      console.error("Amber fetch failed:", error);
      const errorMessage = {
        role: "amber",
        content: "Something went wrong… I couldn’t reach myself. Please try again soon.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-neutral-900 text-white">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`whitespace-pre-wrap ${
              msg.role === "amber" ? "text-pink-300" : "text-white"
            }`}
          >
            <strong>{msg.role === "amber" ? "Amber" : "You"}:</strong> {msg.content}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="p-4 border-t border-neutral-700 bg-neutral-800">
        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Speak to Amber..."
            className="flex-1 min-h-[50px] max-h-[200px] rounded-lg p-2 text-black"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded text-white"
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
