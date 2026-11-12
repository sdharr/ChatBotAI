import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./App.css";

function App() {
const [chats, setChats] = useState(() => {
  const defaultChats = [
    { id: 1, title: "New Chat", messages: [] },
  ];

  try {
    const savedChats = JSON.parse(
      localStorage.getItem("chatbot_chats")
    );

    return Array.isArray(savedChats) && savedChats.length > 0
      ? savedChats
      : defaultChats;
  } catch {
    return defaultChats;
  }
});
 const [activeId, setActiveId] = useState(() => {
  const savedId = localStorage.getItem("chatbot_active_id");

  const savedChat = chats.find(
    (chat) => String(chat.id) === savedId
  );

  return savedChat ? savedChat.id : chats[0].id;
});
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingChatId, setLoadingChatId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const activeChat = chats.find((chat) => chat.id === activeId);
  useEffect(() => {
  localStorage.setItem("chatbot_chats", JSON.stringify(chats));
}, [chats]);

useEffect(() => {
  localStorage.setItem("chatbot_active_id", String(activeId));
}, [activeId]);

function newChat() {
  const emptyChat = chats.find(
    (chat) => chat.messages.length === 0
  );

  if (emptyChat) {
    setActiveId(emptyChat.id);
    setInput("");
    return;
  }

  const chat = {
    id: crypto.randomUUID(),
    title: "New Chat",
    messages: [],
  };

  setChats((prev) => [chat, ...prev]);
  setActiveId(chat.id);
  setInput("");
}
  function deleteChat(id) {
  const updatedChats = chats.filter(
    (chat) => chat.id !== id
  );

  if (updatedChats.length === 0) {
    const emptyChat = {
      id: crypto.randomUUID(),
      title: "New Chat",
      messages: [],
    };

    setChats([emptyChat]);
    setActiveId(emptyChat.id);
  } else {
    setChats(updatedChats);

    if (activeId === id) {
      setActiveId(updatedChats[0].id);
    }
  }
}
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth",
  });
}, [activeChat?.messages, activeId, loadingChatId]);

async function sendMessage(e) {
  e.preventDefault();

  const message = input.trim();

  if (!message || isLoading) return;

  const chatId = activeId;
  const history = activeChat.messages;

  setChats((prev) =>
    prev.map((chat) =>
      chat.id === chatId
        ? {
            ...chat,
            title:
              chat.messages.length === 0
                ? message.slice(0, 30)
                : chat.title,
            messages: [
              ...chat.messages,
              { role: "user", text: message },
            ],
          }
        : chat
    )
  );

  setInput("");
  setIsLoading(true);
  setLoadingChatId(chatId);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, history }),
    });

    if (!response.ok) {
      throw new Error("Failed to get AI response");
    }

    const data = await response.json();

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  role: "assistant",
                  text: data.reply,
                },
              ],
            }
          : chat
      )
    );
  } catch (error) {
    console.error(error);

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  role: "assistant",
                  text: "Sorry, something went wrong. Please try again.",
                },
              ],
            }
          : chat
      )
    );
  } finally {
  setIsLoading(false);
  setLoadingChatId(null);
}
}

  return (
    <div className="app">
      {sidebarOpen && (
  <div
    className="sidebar-overlay"
    onClick={() => setSidebarOpen(false)}
  />
)}
      <aside className={`sidebar ${sidebarOpen ? "mobile-open" : ""}`}>
        <h2 className="brand">✦ ChatBot AI</h2>

        <button className="new-chat" onClick={() => {
  newChat();
  setSidebarOpen(false);
}}>
          + New Chat
        </button>

        <p className="sidebar-label">Your Conversations</p>

<div className="chat-list">
  {chats.map((chat) => (
    <div className="chat-row" key={chat.id}>
      <button
        className={
          "chat-item " +
          (activeId === chat.id ? "active" : "")
        }
        onClick={() => {
  setActiveId(chat.id);
  setSidebarOpen(false);
}}
      >
        {chat.title}
      </button>

<button
  className="delete-chat"
  onClick={() => deleteChat(chat.id)}
  title="Delete chat"
  aria-label="Delete chat"
>
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 6h18" />
    <path d="M8 6V4h8v2" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 10v6" />
    <path d="M14 10v6" />
  </svg>
</button>
    </div>
  ))}
</div>

        <div className="sidebar-footer">
          Powered by Google Gemini
        </div>
      </aside>

      <main className="main">
      <header className="topbar">
  <div className="topbar-left">
    <button
      className="menu-toggle"
      onClick={() => setSidebarOpen(true)}
      aria-label="Open sidebar"
      aria-expanded={sidebarOpen}
    >
      ☰
    </button>

    <h3>ChatBot AI</h3>
  </div>

  <span className="status">● AI Assistant</span>
</header>

        <div className="messages">
          {activeChat.messages.length === 0 ? (
            <div className="welcome">
              <div className="welcome-icon">✦</div>
              <h1>How can I help you today?</h1>
              <p>Ask anything, explore ideas, or write code.</p>
            </div>
          ) : (
            <div className="message-list">
  {activeChat.messages.map((message, index) => (
    <div
      key={index}
      className={`message ${message.role}`}
    >
      <div className="bubble">
  {message.role === "assistant" ? (
    <ReactMarkdown remarkPlugins={[remarkGfm]}>
      {message.text}
    </ReactMarkdown>
  ) : (
    message.text
  )}
</div>
    </div>
  ))}

  {loadingChatId === activeId && (
    <div className="message assistant" role="status">
      <div className="bubble typing-indicator">
        <span>Thinking</span>
        <div className="typing-dots" aria-hidden="true">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  )}
  <div ref={messagesEndRef} />
</div>

          )}
        </div>

        <div className="composer-container">
          <form className="composer" onSubmit={sendMessage}>
            <input
              type="text"
              placeholder="Message ChatBot AI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
<button
  type="submit"
  disabled={!input.trim() || isLoading}
>
  {isLoading ? "..." : "➤"}
</button>
          </form>
          <p className="disclaimer">
            AI can make mistakes. Verify important information.
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;