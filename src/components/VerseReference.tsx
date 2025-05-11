import React from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Search } from "lucide-react";
import { Input } from "./ui/input";

interface Verse {
  chapter: number;
  verse: number;
  text: string;
  translation: string;
}

interface VerseReferenceProps {
  onSelectVerse?: (verse: Verse) => void;
}

const VerseReference = ({ onSelectVerse = () => {} }: VerseReferenceProps) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedChapter, setSelectedChapter] = React.useState<number | null>(
    null,
  );

  // Sample verses - in a real app, this would come from an API or database
  const sampleVerses: Verse[] = [
    {
      chapter: 2,
      verse: 47,
      text: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
      translation:
        "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.",
    },
    {
      chapter: 2,
      verse: 48,
      text: "योगस्थः कुरु कर्माणि सङ्गं त्यक्त्वा धनञ्जय।",
      translation:
        "Perform your duty equipoised, O Arjuna, abandoning all attachment to success or failure.",
    },
    {
      chapter: 2,
      verse: 55,
      text: "प्रजहाति यदा कामान्सर्वान्पार्थ मनोगतान्।",
      translation:
        "When one gives up all varieties of desire for sense gratification, which arise from mental concoction, and when the mind finds satisfaction in the self alone, then one is said to be in pure transcendental consciousness.",
    },
    {
      chapter: 2,
      verse: 62,
      text: "ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते।",
      translation:
        "While contemplating the objects of the senses, a person develops attachment for them, and from such attachment lust develops, and from lust anger arises.",
    },
    {
      chapter: 2,
      verse: 63,
      text: "क्रोधाद्भवति संमोहः संमोहात्स्मृतिविभ्रमः।",
      translation:
        "From anger, delusion arises, and from delusion bewilderment of memory. When memory is bewildered, intelligence is lost, and when intelligence is lost, one falls down again into the material pool.",
    },
    {
      chapter: 3,
      verse: 19,
      text: "तस्मादसक्तः सततं कार्यं कर्म समाचर।",
      translation:
        "Therefore, without being attached to the fruits of activities, one should act as a matter of duty.",
    },
    {
      chapter: 4,
      verse: 7,
      text: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत।",
      translation:
        "Whenever and wherever there is a decline in religious practice, O descendant of Bharata, and a predominant rise of irreligion...",
    },
    {
      chapter: 4,
      verse: 8,
      text: "परित्राणाय साधूनां विनाशाय च दुष्कृताम्।",
      translation:
        "To deliver the pious and to annihilate the miscreants, as well as to reestablish the principles of religion, I advent Myself millennium after millennium.",
    },
    {
      chapter: 5,
      verse: 22,
      text: "ये हि संस्पर्शजा भोगा दुःखयोनय एव ते।",
      translation:
        "An intelligent person does not take part in the sources of misery, which are due to contact with the material senses. Such pleasures have a beginning and an end, and so the wise man does not delight in them.",
    },
    {
      chapter: 6,
      verse: 5,
      text: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्।",
      translation:
        "One must deliver himself with the help of his mind, and not degrade himself. The mind is the friend of the conditioned soul, and his enemy as well.",
    },
    {
      chapter: 6,
      verse: 26,
      text: "यतो यतो निश्चरति मनश्चञ्चलमस्थिरम्।",
      translation:
        "From wherever the mind wanders due to its flickering and unsteady nature, one must certainly withdraw it and bring it back under the control of the Self.",
    },
  ];

  const chapters = Array.from({ length: 18 }, (_, i) => i + 1);

  const filteredVerses = sampleVerses.filter((verse) => {
    if (selectedChapter && verse.chapter !== selectedChapter) return false;
    if (searchTerm) {
      return (
        verse.translation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        verse.text.includes(searchTerm) ||
        `${verse.chapter}.${verse.verse}`.includes(searchTerm) ||
        `chapter ${verse.chapter} verse ${verse.verse}`.includes(
          searchTerm.toLowerCase(),
        )
      );
    }
    return true;
  });

  // Sort verses by chapter and verse number
  const sortedVerses = [...filteredVerses].sort((a, b) => {
    if (a.chapter !== b.chapter) {
      return a.chapter - b.chapter;
    }
    return a.verse - b.verse;
  });

  return (
    <div className="bg-white border rounded-md overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b bg-orange-50">
        <h2 className="text-lg font-semibold text-orange-800 mb-2">
          Bhagavad Gita Verses
        </h2>
        <div className="relative mb-3">
          <Input
            placeholder="Search verses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-8"
          />
          <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex flex-wrap gap-1">
          {chapters.map((chapter) => (
            <Button
              key={chapter}
              variant={selectedChapter === chapter ? "default" : "outline"}
              size="sm"
              onClick={() =>
                setSelectedChapter(selectedChapter === chapter ? null : chapter)
              }
              className="min-w-8 h-8"
            >
              {chapter}
            </Button>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {sortedVerses.length > 0 ? (
            sortedVerses.map((verse) => (
              <div
                key={`${verse.chapter}-${verse.verse}`}
                className="p-3 border rounded-md hover:bg-orange-50 cursor-pointer transition-colors"
                onClick={() => onSelectVerse(verse)}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-orange-800">
                    Chapter {verse.chapter}, Verse {verse.verse}
                  </span>
                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                    Quote
                  </Button>
                </div>
                <p className="text-sm font-medium mb-1 text-slate-700">
                  {verse.text}
                </p>
                <p className="text-sm text-slate-600">{verse.translation}</p>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-muted-foreground">
              No verses found matching your criteria
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default VerseReference;
