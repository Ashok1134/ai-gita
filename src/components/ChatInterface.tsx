import React, { useState, useRef, useEffect } from "react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@/components/ui/avatar";
import { AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
}

interface ChatInterfaceProps {
  messages?: Message[];
  isLoading?: boolean;
  onScrollToBottom?: () => void;
}

const ChatInterface = ({
  messages = [],
  isLoading = false,
  onScrollToBottom = () => {},
}: ChatInterfaceProps) => {
  const [chatMessages, setChatMessages] = useState<Message[]>(messages);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevMessagesLength = useRef(messages.length);
  const prevIsLoading = useRef(isLoading);

  // Update local messages when prop changes
  useEffect(() => {
    setChatMessages(messages);
  }, [messages]);

  // Scroll to bottom only when new messages are added or loading state changes
  useEffect(() => {
    if (
      messages.length > prevMessagesLength.current ||
      isLoading !== prevIsLoading.current
    ) {
      scrollToBottom();
    }
    prevMessagesLength.current = messages.length;
    prevIsLoading.current = isLoading;
  }, [messages, isLoading]);

  // Add touch events for better mobile scrolling
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    let touchStartY = 0;
    let scrollStartPos = 0;

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY;
      scrollStartPos = scrollArea.scrollTop;
    };

    scrollArea.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });

    return () => {
      scrollArea.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      onScrollToBottom();
    }
  };

  // If no messages, show welcome message
  const showWelcomeMessage = chatMessages.length === 0 && !isLoading;

  return (
    <div className="flex flex-col h-full w-full bg-background border rounded-md overflow-hidden relative">
      <div
        className="flex-1 p-4 h-full overflow-y-auto overscroll-contain"
        ref={scrollAreaRef}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="flex flex-col space-y-4 min-h-full">
          {showWelcomeMessage && (
            <div className="flex flex-col items-center justify-center h-full py-8 text-center px-4">
              <Avatar className="h-16 w-16 mb-4">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1603548746365-6ca5b2a3d8f6?w=250&q=80"
                  alt="Bhāgavatam"
                />
                <AvatarFallback>BV</AvatarFallback>
              </Avatar>
              <h2 className="text-2xl font-semibold mb-2">
                Welcome to Bhāgavatam
              </h2>
              <p className="text-muted-foreground mb-4">
                Ask any question about the teachings of the Bhāgavatam and
                receive wisdom based on its timeless principles.
              </p>
              <p className="text-sm text-muted-foreground">
                Try asking: "What does the Bhāgavatam say about duty?" or "How
                can I find inner peace?"
              </p>
            </div>
          )}

          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-2 sm:p-3 ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                {message.sender === "ai" && (
                  <div className="flex items-center mb-1">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage
                        src="https://images.unsplash.com/photo-1603548746365-6ca5b2a3d8f6?w=100&q=80"
                        alt="Bhāgavatam"
                      />
                      <AvatarFallback>BV</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium">Bhāgavatam</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <div className="text-xs opacity-70 text-right mt-1">
                  {new Date(message.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[85%] sm:max-w-[80%] rounded-lg p-3 sm:p-4 bg-muted">
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2">
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1603548746365-6ca5b2a3d8f6?w=100&q=80"
                      alt="Bhāgavatam"
                    />
                    <AvatarFallback>BV</AvatarFallback>
                  </Avatar>
                  <span className="text-xs font-medium mr-2">Bhāgavatam</span>
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
