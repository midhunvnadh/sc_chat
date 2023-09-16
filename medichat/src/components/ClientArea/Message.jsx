import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
export default function Message({ onMessage, disabled = false }) {
  const [message, setMessage] = useState("");

  const submit = () => {
    if (message.trim() === "") return;
    onMessage(message.trim());
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
    const sh = e.target.scrollHeight + 5;
    e.target.style.height = `${sh > 100 ? 100 : sh}px`;
  };

  return (
    <div className="bg-white flex pt-6 py-5 px-3 relative lg:rounded-3xl">
      <form
        className="w-full h-full flex items-center justify-center border-t"
        onSubmit={(e) => {
          e.preventDefault();
          submit();
        }}
      >
        <div className="grow p-2 w-full h-full">
          <textarea
            disabled={disabled}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            className={`${
              disabled ? "cursor-not-allowed" : ""
            } rounded-lg h-full resize-none w-full px-3 hidescroll p-1 py-3 outline-0 text-xl h-32`}
            placeholder="Enter your message..."
            onKeyUp={handleKeyDown}
          ></textarea>
        </div>
        <div className="p-2 h-full align-end">
          <button
            className={`${
              message
                ? "bg-indigo-800 hover:bg-indigo-900 "
                : "bg-indigo-300 cursor-not-allowed"
            } w-16 h-16 right-5 top-0 lg:top-1/3 lg:-right-8 text-2xl shadow-xl absolute rounded-full text-white flex items-center justify-center`}
          >
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </div>
  );
}
