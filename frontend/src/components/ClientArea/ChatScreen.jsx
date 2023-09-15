import Header from "./Header";
import ChatArea from "./ChatArea";
import { useState, useEffect, useCallback } from "react";
import formatPriceAsINR from "../../functions/currency_formatter";
import Message from "./Message";
const process = import.meta.env;
import axios from "axios";
import intro from "./data/intro";

const { VITE_API_BASE: API_BASE } = process;

export default function ChatScreen() {
  const [messages, setMessages] = useState([]);
  const [msgFn, setMsgFn] = useState(null);

  useEffect(() => {
    setMessages((mss) => [...mss, intro({ setMessages, findMedicine })]);
  }, []);

  const findMedicine = useCallback(() => {
    setMessages((mss) => [
      ...mss,
      {
        message: "Carefully tell us the condition you need medicine for.",
        byBot: true,
      },
    ]);
    setMsgFn("findMedicine");
  }, []);

  const messageFunction = {
    findMedicine: async (query) => {
      setMessages((mss) => [...mss, { message: query, byBot: false }]);
      const { data } = await axios.get(`${API_BASE}/medicines?query=${query}`);
      const medicines = data.map((med, i) => {
        return {
          message: (
            <div className="font-sans">
              <div className="font-sans">{med.name}</div>
              <div className="text-green-600 font-sans">{med.description}</div>
            </div>
          ),
          byBot: true,
        };
      });
      setMessages((mss) => [
        ...mss,
        {
          message: "Here are some medicines that might help you.",
          byBot: true,
        },
        ...medicines,
        {
          message:
            "We suggest you to consult a physician before taking any medicine.",
          byBot: true,
        },
      ]);
      setMessages((mss) => [
        ...mss,
        {
          message: "Do you want to search again?",
          byBot: true,
          options: [
            {
              name: "Yes",
              action: (message) => {
                setMessages((mss) => [...mss, { message, byBot: false }]);
                findMedicine();
              },
            },
            {
              name: "No",
              action: (message) => {
                setMessages((mss) => [
                  ...mss,
                  { message, byBot: false },
                  intro({
                    setMessages,
                    findMedicine,
                    message: "Anything more?",
                  }),
                ]);
                setMsgFn(null);
              },
            },
          ],
        },
      ]);
    },
    default: (query) => {
      setMessages((mss) => [...mss, { message: query, byBot: false }]);
      if (
        query.toLowerCase().includes("Hi".toLowerCase()) ||
        query.toLowerCase().includes("Hello".toLowerCase()) ||
        query.toLowerCase().includes("Help".toLowerCase())
      ) {
      } else if (query.toLowerCase().includes("restart".toLowerCase())) {
        setMessages((mss) => []);
      } else if (query.toLowerCase().includes("start".toLowerCase())) {
        setMessages((mss) => [
          ...mss,
          { message: `Okay, started!`, byBot: true },
        ]);
      } else if (query.toLowerCase().includes("stop".toLowerCase())) {
        setMessages((mss) => [
          ...mss,
          { message: `Okay, stopped!`, byBot: true },
        ]);
      } else {
        setMessages((mss) => [
          ...mss,
          {
            message: "Sorry, I couldn't understand you. Please try again.",
            byBot: true,
          },
        ]);
      }
    },
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-600 lg:py-6">
      <div className="max-w-lg bg-white h-full w-full rounded-md shadow-md flex flex-col rounded-t-2xl rounded-b-2xl">
        <Header />
        <ChatArea messages={messages} />
        <Message onMessage={messageFunction[msgFn || "default"]} />
      </div>
    </div>
  );
}
