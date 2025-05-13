import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  BookOpen,
  Quote,
  Clock,
  Heart,
  Sparkles,
  BookMarked,
  Settings,
  User,
  Search,
} from "lucide-react";
import Footer from "./Footer";
import ThemeToggle from "./ThemeToggle";
import QuoteOfTheDay from "./QuoteOfTheDay";
import SearchBar from "./SearchBar";

import ChatInterface from "./ChatInterface";
import MessageInput from "./MessageInput";
import GuidancePanel from "./GuidancePanel";
import VerseReference from "./VerseReference";
import DailyWisdom from "./DailyWisdom";
import MeditationTimer from "./MeditationTimer";
import GuidedMeditation from "./GuidedMeditation";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { getGeminiResponse } from "@/lib/ai";

const Home = () => {
  const [showGuidance, setShowGuidance] = useState(false);
  const [showVerses, setShowVerses] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [showSearch, setShowSearch] = useState(false);

  // Handle URL hash for direct tab access
  React.useEffect(() => {
    if (isFirstLoad) {
      const hash = window.location.hash.replace("#", "");
      if (hash === "wisdom" || hash === "meditation" || hash === "chat") {
        setActiveTab(hash);
      } else {
        // Set default tab if no hash is present
        window.location.hash = activeTab;
      }
      setIsFirstLoad(false);
    } else {
      // Update hash when tab changes
      if (window.location.hash !== `#${activeTab}`) {
        window.location.hash = activeTab;
      }
    }
  }, [activeTab, isFirstLoad]);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "1",
      content:
        "Namaste! I am the Bhāgavatam assistant. How may I help you on your spiritual journey today?",
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

  const handleSearch = (query: string) => {
    setActiveTab("chat");
    handleSendMessage(`Search the Bhāgavatam for: ${query}`);
    setShowSearch(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <header className="flex flex-col p-2 sm:p-4 bg-orange-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-orange-800">Bhāgavatam</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(!showSearch)}
              className="text-orange-800"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="text-orange-800"
              aria-label="User profile"
            >
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowVerses(!showVerses)}
              className="md:hidden text-orange-800"
              aria-label="Toggle verses panel"
            >
              <BookOpen className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowGuidance(!showGuidance)}
              className="md:hidden text-orange-800"
              aria-label="Toggle guidance panel"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="mb-3">
            <SearchBar onSearch={handleSearch} />
          </div>
        )}

        {/* Navigation Bar */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-1">
          <Button
            variant={activeTab === "chat" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("chat")}
            className="flex items-center gap-1 whitespace-nowrap"
          >
            <Quote className="h-4 w-4" />
            Chat
          </Button>
          <Button
            variant={activeTab === "wisdom" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("wisdom")}
            className="flex items-center gap-1 whitespace-nowrap"
          >
            <BookOpen className="h-4 w-4" />
            Daily Wisdom
          </Button>
          <Button
            variant={activeTab === "meditation" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("meditation")}
            className="flex items-center gap-1 whitespace-nowrap"
          >
            <Clock className="h-4 w-4" />
            Meditation
          </Button>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar - Verse References */}
        <motion.div
          className={`${showVerses ? "flex" : "hidden"} md:flex w-full md:w-80 lg:w-96 bg-orange-50 border-r border-orange-200 absolute md:relative z-10 h-full`}
          initial={{ x: "-100%" }}
          animate={{ x: showVerses ? 0 : "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <VerseReference
            onSelectVerse={(verse) => {
              handleSendMessage(
                `Tell me about Chapter ${verse.chapter}, Verse ${verse.verse} of the Bhāgavatam`,
              );
              if (window.innerWidth < 768) {
                setShowVerses(false);
              }
            }}
          />
        </motion.div>

        {/* Center Content Area */}
        <div className="flex flex-col flex-1 overflow-hidden p-2 sm:p-4 w-full">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full mb-4 flex flex-col h-full"
            defaultValue="chat"
          >
            <TabsList className="hidden">
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

            <TabsContent
              value="chat"
              className="flex flex-col flex-1 h-full overflow-hidden"
            >
              <div className="flex flex-col flex-1">
                <ChatInterface messages={messages} isLoading={isLoading} />
                <MessageInput
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                />
              </div>
            </TabsContent>

            <TabsContent
              value="wisdom"
              className="h-full overflow-y-auto overscroll-contain pb-20"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-1 sm:p-2">
                <DailyWisdom
                  onReadMore={() => {
                    setActiveTab("chat");
                    handleSendMessage(
                      "Tell me more about Chapter 2, Verse 47 of the Bhāgavatam",
                    );
                  }}
                />

                <QuoteOfTheDay
                  onReadMore={() => {
                    setActiveTab("chat");
                    handleSendMessage(
                      "Tell me more about Chapter 6, Verse 19 of the Bhāgavatam",
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
                        icon: <Sparkles className="h-4 w-4 text-orange-600" />,
                      },
                      {
                        title: "Bhakti Yoga",
                        desc: "The path of devotion",
                        icon: <Heart className="h-4 w-4 text-orange-600" />,
                      },
                      {
                        title: "Jnana Yoga",
                        desc: "The path of knowledge",
                        icon: (
                          <BookMarked className="h-4 w-4 text-orange-600" />
                        ),
                      },
                    ].map((item) => (
                      <Button
                        key={item.title}
                        variant="outline"
                        className="justify-start h-auto p-4 border-orange-200"
                        onClick={() => {
                          setActiveTab("chat");
                          handleSendMessage(
                            `What is ${item.title} according to the Bhāgavatam?`,
                          );
                        }}
                      >
                        <div className="flex items-center gap-3 text-left">
                          <div className="flex-shrink-0 bg-orange-100 p-2 rounded-full">
                            {item.icon}
                          </div>
                          <div>
                            <h4 className="font-medium text-orange-800">
                              {item.title}
                            </h4>
                            <p className="text-sm text-slate-600">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4 space-y-4">
                  <h3 className="text-lg font-semibold text-orange-800">
                    Popular Questions
                  </h3>
                  <div className="space-y-2">
                    {[
                      "What is the purpose of life according to the Bhāgavatam?",
                      "How can I find inner peace?",
                      "What does the Bhāgavatam say about handling difficult emotions?",
                      "How to practice detachment in daily life?",
                    ].map((question, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="justify-start w-full text-left h-auto py-2 text-sm text-slate-700 hover:text-orange-800"
                        onClick={() => {
                          setActiveTab("chat");
                          handleSendMessage(question);
                        }}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="meditation"
              className="h-full overflow-y-auto overscroll-contain pb-20"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-1 sm:p-2">
                <div className="md:col-span-2 lg:col-span-1">
                  <MeditationTimer
                    onComplete={() => {
                      handleSendMessage(
                        "What are the benefits of regular meditation according to the Bhāgavatam?",
                      );
                      setActiveTab("chat");
                    }}
                  />
                </div>

                <div className="md:col-span-2 lg:col-span-1">
                  <GuidedMeditation
                    title="Bhāgavatam-Inspired Meditation"
                    description="A guided meditation based on Bhāgavatam teachings"
                    duration={180} // 3 minutes
                    steps={[
                      {
                        time: 0,
                        instruction:
                          "Sit comfortably with your spine straight and eyes closed",
                      },
                      {
                        time: 20,
                        instruction:
                          "Take deep breaths, focusing on the sensation of air entering and leaving your body",
                      },
                      {
                        time: 40,
                        instruction:
                          "Bring to mind the teaching: 'You are not this body, but the eternal soul within'",
                      },
                      {
                        time: 70,
                        instruction:
                          "Observe your thoughts without attachment, like Krishna advises Arjuna",
                      },
                      {
                        time: 100,
                        instruction:
                          "Repeat mentally: 'I am peaceful, I am balanced, I am free from attachment'",
                      },
                      {
                        time: 140,
                        instruction:
                          "Begin to deepen your breath and prepare to return to awareness",
                      },
                      {
                        time: 170,
                        instruction: "Slowly open your eyes when you're ready",
                      },
                    ]}
                    onComplete={() => {
                      handleSendMessage(
                        "What does the Bhāgavatam teach about the nature of the self?",
                      );
                      setActiveTab("chat");
                    }}
                  />
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-orange-800">
                    Meditation Techniques
                  </h3>
                  <div className="grid gap-3">
                    {[
                      {
                        title: "Breath Awareness",
                        desc: "Focus on the natural rhythm of your breath",
                      },
                      {
                        title: "Mantra Meditation",
                        desc: "Repeat a sacred sound like 'Om' or 'Aum'",
                      },
                      {
                        title: "Visualization",
                        desc: "Focus on an image of a deity or natural element",
                      },
                    ].map((item) => (
                      <Button
                        key={item.title}
                        variant="outline"
                        className="justify-start h-auto p-4 border-orange-200"
                        onClick={() => {
                          setActiveTab("chat");
                          handleSendMessage(
                            `How do I practice ${item.title} meditation according to the Bhāgavatam?`,
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

                <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-lg p-4 space-y-4">
                  <h3 className="text-lg font-semibold text-orange-800">
                    Meditation in the Bhāgavatam
                  </h3>
                  <p className="text-sm text-slate-700">
                    "When meditation is mastered, the mind is unwavering like
                    the flame of a lamp in a windless place."
                  </p>
                  <p className="text-xs text-slate-600 italic">
                    - Chapter 6, Verse 19
                  </p>

                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => {
                      setActiveTab("chat");
                      handleSendMessage(
                        "What does Chapter 6, Verse 19 of the Bhāgavatam teach about meditation?",
                      );
                    }}
                  >
                    Learn More
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Sidebar - Guidance Panel */}
        <motion.div
          className={`${showGuidance ? "flex" : "hidden"} md:flex w-full md:w-80 lg:w-96 bg-orange-50 border-l border-orange-200 absolute md:relative right-0 z-10 h-full`}
          initial={{ x: "100%" }}
          animate={{ x: showGuidance ? 0 : "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <GuidancePanel onSelectQuestion={handleSelectQuestion} />
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
