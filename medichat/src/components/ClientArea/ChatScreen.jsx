import Header from "./Header";
import ChatArea from "./ChatArea";
import { useState, useEffect, useCallback } from "react";
import formatPriceAsINR from "../../functions/currency_formatter";
import Message from "./Message";
import axios from "axios";
import intro from "./data/intro";

export default function ChatScreen({ session }) {
  const NEXT_PUBLIC_API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";
  const [messages, setMessages] = useState([]);
  const [msgFn, setMsgFn] = useState(null);

  function backToIntro() {
    return intro({
      setMessages,
      findMedicine,
      findSD,
      message: "Anything more?",
      session,
    });
  }

  useEffect(() => {
    setMessages((mss) => [
      ...mss,
      intro({ setMessages, findMedicine, findSD, session }),
    ]);
  }, []);

  const findSD = useCallback(() => {
    setMessages((mss) => [
      ...mss,
      {
        message: "Please upload a picture of your affected area of skin.",
        byBot: true,
        options: [
          {
            name: "Upload",
            action: (message) => {
              const input = document.createElement("input");
              input.type = "file";
              input.accept = "image/*";
              input.onchange = async (e) => {
                const files = e.target.files;
                const formData = new FormData();
                const file = files[0];
                formData.append("file[]", file);
                setMessages((mss) => [
                  ...mss,
                  {
                    message: (
                      <div className="flex flex-col items-center">
                        <img
                          src={URL.createObjectURL(file)}
                          className="w-1/2"
                        />
                      </div>
                    ),
                    byBot: false,
                  },
                  {
                    message: "Please wait while we process your image.",
                    byBot: true,
                  },
                ]);
                const resp = await fetch(`${NEXT_PUBLIC_API_BASE}/submit`, {
                  method: "POST",
                  body: formData,
                });
                const data = await resp.json();
                const { prediction } = data[0];
                setMessages((mss) => [
                  ...mss,
                  {
                    message: `What's shown in the photo looks like ${prediction}...`,
                    byBot: true,
                  },
                  {
                    message: `Please consult a physician for further diagnosis. We could be wrong!`,
                    byBot: true,
                  },
                  backToIntro(),
                ]);
              };
              input.click();
            },
          },
          {
            name: "Cancel",
            action: (message) => {
              setMessages((mss) => [...mss, { message, byBot: false }]);
              setMessages((mss) => [
                ...mss,
                { message: "No worries, let's see what's wrong?", byBot: true },
                backToIntro(),
              ]);
            },
          },
        ],
      },
    ]);
  }, []);

  const [selectedUse, setSelectedUse] = useState(null);
  const findMedicine = useCallback(async (query) => {
    const { data: uses } = await axios.get(
      `${NEXT_PUBLIC_API_BASE}/medicine_reasons`
    );
    const usesList = uses.map((use) => {
      return {
        name: use,
        action: (message) => {
          setSelectedUse((use) => {
            setMessages((mss) => [...mss, { message, byBot: false }]);
            setMessages((mss) => [
              ...mss,
              {
                message: `Okay!, Tell us the condition you need medicine for...`,
                byBot: true,
              },
            ]);
            setMsgFn("findMedicine");
            return use === message ? null : message;
          });
        },
      };
    });

    setMessages((mss) => [
      ...mss,
      {
        message: "What kind of medicine are you looking for?",
        byBot: true,
        options: [...usesList],
      },
    ]);
  }, []);

  const messageFunction = {
    findMedicine: async (query) => {
      setMessages((mss) => [...mss, { message: query, byBot: false }]);
      const { data } = await axios.get(
        `${NEXT_PUBLIC_API_BASE}/medicines?query=${query}&reason=${selectedUse}`
      );
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
      if (medicines.length === 0) {
        setMessages((mss) => [
          ...mss,
          {
            message: "Sorry, we couldn't find any medicines for your query.",
            byBot: true,
          },
        ]);
      } else {
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
      }
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
                  backToIntro(),
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

  const [disableMessageInput, setDisableMessageInput] = useState(false);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-600 lg:py-6">
      <div className="max-w-lg bg-white h-full w-full rounded-md shadow-md flex flex-col rounded-t-2xl rounded-b-2xl">
        <Header />
        <ChatArea
          messages={messages}
          disableMessageInput={(s) => {
            setDisableMessageInput(s);
          }}
        />
        <Message
          onMessage={messageFunction[msgFn || "default"]}
          disabled={disableMessageInput}
        />
      </div>
    </div>
  );
}
