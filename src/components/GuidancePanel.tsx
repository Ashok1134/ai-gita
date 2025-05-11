import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GuidancePanelProps {
  onSelectQuestion: (question: string) => void;
  isOpen?: boolean;
  onToggle?: () => void;
}

const GuidancePanel = ({
  onSelectQuestion = () => {},
  isOpen = true,
  onToggle = () => {},
}: GuidancePanelProps) => {
  const [expanded, setExpanded] = useState<string | null>("common-questions");

  const commonQuestions = [
    "What is the main message of the Bhagavad Gita?",
    "How can I find inner peace according to the Gita?",
    "What does Krishna say about duty (dharma)?",
    "How to overcome fear and anxiety?",
    "What is karma yoga?",
    "How to practice detachment?",
  ];

  const categories = [
    {
      name: "Self-Knowledge",
      teachings: [
        "Understanding the eternal soul (Atman)",
        "Difference between body and soul",
        "The nature of consciousness",
      ],
    },
    {
      name: "Karma Yoga",
      teachings: [
        "The path of selfless action",
        "Working without attachment to results",
        "Performing duty without desire",
      ],
    },
    {
      name: "Bhakti Yoga",
      teachings: [
        "The path of devotion",
        "Surrendering to the divine",
        "Loving service to God",
      ],
    },
    {
      name: "Jnana Yoga",
      teachings: [
        "The path of knowledge",
        "Discriminating between real and unreal",
        "Transcending illusion through wisdom",
      ],
    },
  ];

  const handleQuestionClick = (question: string) => {
    onSelectQuestion(question);
    if (window.innerWidth < 768) {
      onToggle();
    }
  };

  const handleTeachingClick = (teaching: string) => {
    onSelectQuestion(`Tell me about ${teaching} in the Bhagavad Gita`);
    if (window.innerWidth < 768) {
      onToggle();
    }
  };

  return (
    <div
      className={`bg-slate-50 border-l border-slate-200 h-full overflow-y-auto transition-all duration-300 ${isOpen ? "w-full md:w-[350px]" : "w-0 overflow-hidden"}`}
    >
      <div className="p-4 flex justify-between items-center border-b border-slate-200">
        <h2 className="text-lg font-medium text-slate-800">Guidance</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="md:hidden"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="p-4">
        <Accordion
          type="single"
          collapsible
          value={expanded || undefined}
          onValueChange={(value) => setExpanded(value)}
        >
          <AccordionItem value="common-questions">
            <AccordionTrigger className="text-slate-700 hover:text-slate-900">
              Common Questions
            </AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 mt-2">
                {commonQuestions.map((question, index) => (
                  <li key={index}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left text-slate-600 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-md text-sm"
                      onClick={() => handleQuestionClick(question)}
                    >
                      {question}
                    </Button>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="categories">
            <AccordionTrigger className="text-slate-700 hover:text-slate-900">
              Categories of Teachings
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 mt-2">
                {categories.map((category, index) => (
                  <div
                    key={index}
                    className="border-t border-slate-200 pt-2 first:border-0 first:pt-0"
                  >
                    <h3 className="font-medium text-slate-800 mb-2">
                      {category.name}
                    </h3>
                    <ul className="space-y-1">
                      {category.teachings.map((teaching, idx) => (
                        <li key={idx}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-left text-slate-600 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-md text-sm"
                            onClick={() => handleTeachingClick(teaching)}
                          >
                            {teaching}
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {!isOpen && (
        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
          className="fixed top-1/2 right-0 transform -translate-y-1/2 bg-white border-slate-200 border-r-0 rounded-r-none h-24"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default GuidancePanel;
