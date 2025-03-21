import React, { useState, useEffect, useRef } from "react";
import { database } from "../../util/firebase/firebase"; // Đảm bảo đường dẫn đúng
import { ref, onValue, push } from "firebase/database";

const PremiumChatPopup = () => {
  // State từ Firebase Chat
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // State từ Premium Chat
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const messagesEndRef = useRef(null);

  // Kiểm tra kích thước màn hình để responsive
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 640);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Kết nối và lắng nghe tin nhắn từ Firebase
  useEffect(() => {
    const messagesRef = ref(database, "messages");
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Chuyển đổi dữ liệu Firebase sang định dạng cần thiết
        const formattedMessages = Object.entries(data).map(([key, value]) => ({
          id: key,
          text: value.text,
          sender: value.sender || "user", // Mặc định là 'user' nếu không có
          timestamp: new Date(value.timestamp),
        }));
        setMessages(formattedMessages);
      }
    });

    // Thêm tin nhắn chào mừng nếu không có tin nhắn nào
    const checkAndAddWelcomeMessage = async () => {
      const snapshot = await ref(database, "messages").get();
      if (!snapshot.exists()) {
        push(ref(database, "messages"), {
          text: "👋 Xin chào! Tôi có thể giúp gì cho bạn hôm nay. Vui lòng mô tả yêu cầu của bạn chi tiết.",
          sender: "shop",
          timestamp: Date.now(),
        });
      }
    };

    checkAndAddWelcomeMessage();
  }, []);

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Gửi tin nhắn đến Firebase
  const sendMessage = () => {
    if (input.trim() !== "") {
      // Thêm tin nhắn vào Firebase
      push(ref(database, "messages"), {
        text: input,
        sender: "user",
        timestamp: Date.now(),
      });
      setInput("");

      // Giả lập tin nhắn từ nhân viên cửa hàng sau 1 giây
      setTimeout(() => {
        push(ref(database, "messages"), {
          text: "Cảm ơn bạn đã liên hệ. Nhân viên của chúng tôi sẽ phản hồi sớm nhất!",
          sender: "shop",
          timestamp: Date.now(),
        });
      }, 1000);
    }
  };

  const formatTime = (date) => {
    return `${date.getHours()}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Nút Chat */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 flex items-center justify-center rounded-full bg-[#602985] text-white shadow-lg hover:bg-gray-800 focus:outline-none transition-all">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        </button>
      )}

      {/* Modal Chat */}
      {isOpen && (
        <div
          className={`absolute ${
            isMobileView ? "inset-x-2 bottom-2" : "bottom-0 right-0"
          } bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col ${
            isMobileView ? "w-auto h-96" : "w-96 h-96"
          }`}>
          {/* Header */}
          <div className="bg-white text-black p-4 flex justify-between items-center border-b border-gray-100">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-lg bg-[#602985] flex items-center justify-center mr-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-white">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg">EMO</h3>
                <div className="text-xs text-gray-500">
                  Nhân viên trực tuyến
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto bg-white">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}>
                {message.sender === "shop" && (
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
                    <span className="text-sm">AI</span>
                  </div>
                )}
                <div
                  className={`max-w-3/4 rounded-2xl px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-black text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "user"
                        ? "text-gray-300"
                        : "text-gray-500"
                    }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
                {message.sender === "user" && (
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ml-2">
                    <span className="text-sm">Bạn</span>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-gray-100 flex items-center">
            <label className="mr-2 text-gray-500 cursor-pointer">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </label>
            <div className="relative flex-1">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Nhập tin nhắn..."
                className="w-full bg-gray-100 rounded-full px-4 py-2 pr-10 focus:outline-none text-sm"
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                <button className="text-gray-500 hover:text-gray-700 focus:outline-none">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-7.536 5.879a1 1 0 001.415 0 3 3 0 014.242 0 1 1 0 001.415-1.415 5 5 0 00-7.072 0 1 1 0 000 1.415z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <button
              onClick={sendMessage}
              className="ml-2 bg-black text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-800 focus:outline-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumChatPopup;
