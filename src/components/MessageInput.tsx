import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Mic, Send } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
}

const MessageInput = ({
  onSendMessage = () => {},
  isLoading = false,
}: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceInput = () => {
    // Toggle recording state for UI feedback
    setIsRecording(!isRecording);

    if (!isRecording) {
      // Start recording using Web Speech API
      try {
        if (
          "webkitSpeechRecognition" in window ||
          "SpeechRecognition" in window
        ) {
          const SpeechRecognition =
            (window as any).webkitSpeechRecognition ||
            (window as any).SpeechRecognition;
          const recognition = new SpeechRecognition();

          recognition.lang = "en-US";
          recognition.continuous = false;
          recognition.interimResults = false;

          recognition.onstart = () => {
            console.log("Voice recognition started");
          };

          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setMessage((prev) => (prev ? prev + " " : "") + transcript.trim());
            setIsRecording(false);
          };

          recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsRecording(false);
          };

          recognition.onend = () => {
            console.log("Voice recognition ended");
            setIsRecording(false);
          };

          recognition.start();
        } else {
          alert("Speech recognition is not supported in your browser.");
          setIsRecording(false);
        }
      } catch (error) {
        console.error("Error initializing speech recognition:", error);
        alert(
          "There was an error starting voice recognition. Please try again.",
        );
        setIsRecording(false);
      }
    } else {
      // Stop recording functionality would go here
      // For now, we'll just reset the state
      setIsRecording(false);
    }
  };

  return (
    <div className="w-full border-t bg-background p-2 sm:p-4 flex items-center gap-2">
      <div className="flex-1 relative">
        <Input
          placeholder="Ask about the Bhāgavatam..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          className="pr-10"
          aria-label="Message input"
        />
      </div>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={handleVoiceInput}
              className={
                isRecording ? "bg-red-100 text-red-500 hover:bg-red-200" : ""
              }
              disabled={isLoading}
            >
              <Mic
                className={`h-4 w-4 ${isRecording ? "animate-pulse text-red-500" : ""}`}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isRecording ? "Stop recording" : "Voice input"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Button
        onClick={handleSendMessage}
        disabled={!message.trim() || isLoading}
        className="bg-primary hover:bg-primary/90 sm:flex hidden"
      >
        <Send className="h-4 w-4 mr-2" />
        Send
      </Button>
      <Button
        onClick={handleSendMessage}
        disabled={!message.trim() || isLoading}
        className="bg-primary hover:bg-primary/90 flex sm:hidden p-2 h-10 w-10"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MessageInput;
