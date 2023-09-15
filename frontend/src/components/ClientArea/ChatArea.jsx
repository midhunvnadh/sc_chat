import { Button, Typography } from "@material-tailwind/react";
import { motion } from "framer-motion";
import { useEffect, useState, useRef, useCallback } from "react";
import { ThreeDots } from "react-loader-spinner";
import moment from "moment";

export default function ChatArea({ messages }) {
  const containerRef = useRef(null);
  return (
    <div
      className="grow bg-white rounded-b-2xl p-2 overflow-y-scroll"
      ref={containerRef}
    >
      {messages.map(({ message, options, byBot = true }, i) => {
        return (
          <ChatMessage
            message={message}
            options={options}
            index={i}
            key={`message-${i}`}
            byBot={byBot}
            containerRef={containerRef}
          />
        );
      })}
    </div>
  );
}

function ChatMessage({
  message,
  options,
  byBot = true,
  index: i,
  containerRef,
}) {
  const [mounted, setMounted] = useState(!byBot);
  const [allOptions, setOptions] = useState(options);

  const scrollToBottom = useCallback(() => {
    if (containerRef?.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [containerRef]);

  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }, 1000);
    setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => {
      setMounted(false);
    };
  }, [scrollToBottom]);

  const now = moment();
  const formattedTime = now.format("h:mm A");
  return (
    <div className={`flex items-center flex-col`}>
      <div className={`py-3 w-full`}>
        {mounted ? (
          <motion.div
            initial={{ y: 50, opacity: -1 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: { transitionDuration: 3000 },
            }}
            className={`chat-bubble-wrapper w-full flex ${
              byBot ? "justify-start" : "justify-end"
            } flex-wrap`}
          >
            <div
              className={`${
                byBot
                  ? "bg-white left"
                  : "bg-gradient-to-r from-indigo-900 to-indigo-500 right"
              } shadow-xl py-3 px-5 rounded-3xl relative chat-bubble`}
            >
              <span
                className={`select-none ${byBot ? "text-left" : "text-right"}`}
              >
                <Typography
                  variant="paragraph"
                  className={`font-medium text-lg ${
                    byBot ? "text-indigo-900" : "text-gray-50"
                  }`}
                >
                  {message}
                </Typography>
                <div
                  className={`flex hidden items-center justify-end ${
                    byBot ? "text-gray-300" : "text-white"
                  }`}
                >
                  <Typography
                    className="inline-block"
                    color="teal"
                    variant="small"
                  >
                    {formattedTime}
                  </Typography>
                </div>
              </span>
            </div>
            {(allOptions || []).length > 0 && (
              <div className="py-3 flex flex-wrap w-full">
                {allOptions.map(({ name, action }, j) => {
                  return (
                    <div key={`option-${name}-${i}-${j}`} className="p-1">
                      <Button
                        variant="gradient"
                        color="indigo"
                        onClick={() => {
                          action(name);
                          setOptions([]);
                        }}
                      >
                        {name}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        ) : (
          <div
            className={`bg-white shadow-xl p-2 rounded-md relative chat-bubble w-16 flex items-center justify-center rounded-3xl`}
          >
            <ThreeDots
              height="20"
              width="20"
              radius="8"
              color="#ccc"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClassName=""
              visible={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}
