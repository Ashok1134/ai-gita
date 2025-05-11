import React, { useState } from "react";
import { motion } from "framer-motion";
import { Menu, BookOpen, Quote, Clock } from "lucide-react";

import ChatInterface from "./ChatInterface";
import MessageInput from "./MessageInput";
import GuidancePanel from "./GuidancePanel";
import VerseReference from "./VerseReference";
import DailyWisdom from "./DailyWisdom";
import MeditationTimer from "./MeditationTimer";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { getGeminiResponse } from "@/lib/ai";

const Home = () => {
  const [showGuidance, setShowGuidance] = useState(false);
  const [showVerses, setShowVerses] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "1",
      content:
        "Namaste! I am the Bhagavad Gita AI assistant. How may I help you on your spiritual journey today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    // Add user message
    const newUserMessage = {
      id: Date.now().toString(),
      content: message,
      sender: "user" as const,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      // Get response from Gemini AI
      const aiResponseText = await getGeminiResponse(message);

      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: aiResponseText,
        sender: "ai" as const,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error("Error getting AI response:", error);

      // Add error message
      const errorResponse = {
        id: (Date.now() + 1).toString(),
        content:
          "I apologize, but I'm having trouble connecting to my knowledge base right now. Please try again later.",
        sender: "ai" as const,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectQuestion = (question: string) => {
    handleSendMessage(question);
    // On mobile, close the guidance panel after selecting a question
    if (window.innerWidth < 768) {
      setShowGuidance(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-orange-100 shadow-sm">
        <h1 className="text-2xl font-bold text-orange-800">Bhagavad Gita AI</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowVerses(!showVerses)}
            className="md:hidden"
          >
            <BookOpen className="h-5 w-5 text-orange-800" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowGuidance(!showGuidance)}
            className="md:hidden"
          >
            <Menu className="h-5 w-5 text-orange-800" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Verse References */}
        <motion.div
          className={`${showVerses ? "flex" : "hidden"} md:flex w-full md:w-80 lg:w-96 bg-orange-50 border-r border-orange-200`}
          initial={{ x: "-100%" }}
          animate={{ x: showVerses ? 0 : "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <VerseReference
            onSelectVerse={(verse) => {
              handleSendMessage(
                `Tell me about Chapter ${verse.chapter}, Verse ${verse.verse} of the Bhagavad Gita`,
              );
              if (window.innerWidth < 768) {
                setShowVerses(false);
              }
            }}
          />
        </motion.div>

        {/* Center Content Area */}
        <div className="flex flex-col flex-1 overflow-hidden p-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full mb-4"
          >
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <Quote className="h-4 w-4" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="wisdom" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Daily Wisdom
              </TabsTrigger>
              <TabsTrigger
                value="meditation"
                className="flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                Meditation
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex flex-col flex-1 h-full">
              <div className="flex flex-col flex-1">
                <ChatInterface messages={messages} isLoading={isLoading} />
                <MessageInput
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                />
              </div>
            </TabsContent>

            <TabsContent value="wisdom" className="h-full">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <DailyWisdom
                  onReadMore={() => {
                    setActiveTab("chat");
                    handleSendMessage(
                      "Tell me more about Chapter 2, Verse 47 of the Bhagavad Gita",
                    );
                  }}
                />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-orange-800">
                    Key Teachings
                  </h3>
                  <div className="grid gap-3">
                    {[
                      {
                        title: "Karma Yoga",
                        desc: "The path of selfless action",
                      },
                      { title: "Bhakti Yoga", desc: "The path of devotion" },
                      { title: "Jnana Yoga", desc: "The path of knowledge" },
                    ].map((item) => (
                      <Button
                        key={item.title}
                        variant="outline"
                        className="justify-start h-auto p-4 border-orange-200"
                        onClick={() => {
                          setActiveTab("chat");
                          handleSendMessage(
                            `What is ${item.title} according to the Bhagavad Gita?`,
                          );
                        }}
                      >
                        <div className="text-left">
                          <h4 className="font-medium text-orange-800">
                            {item.title}
                          </h4>
                          <p className="text-sm text-slate-600">{item.desc}</p>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar - Guidance Panel */}
        <motion.div
          className={`${showGuidance ? "flex" : "hidden"} md:flex w-full md:w-80 lg:w-96 bg-orange-50 border-l border-orange-200`}
          initial={{ x: "100%" }}
          animate={{ x: showGuidance ? 0 : "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <GuidancePanel onSelectQuestion={handleSelectQuestion} />
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
