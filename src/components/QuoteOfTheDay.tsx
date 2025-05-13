import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Share2, BookOpen } from "lucide-react";

interface QuoteOfTheDayProps {
  onReadMore?: () => void;
}

const QuoteOfTheDay = ({ onReadMore = () => {} }: QuoteOfTheDayProps) => {
  // In a real app, this would be fetched from an API or database
  // For now, we'll use a static quote
  const quote = {
    text: "Just as a lamp in a windless place does not flicker, so the disciplined mind of a yogi remains steady in meditation on the self.",
    chapter: 6,
    verse: 19,
    explanation:
      "This verse describes the state of perfect meditation, where the mind becomes completely still and focused, like a flame that doesn't flicker when there's no wind.",
  };

  return (
    <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-orange-800">Quote of the Day</CardTitle>
        <CardDescription>
          Chapter {quote.chapter}, Verse {quote.verse}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="font-medium text-slate-800 italic mb-1">
            "{quote.text}"
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-orange-700 mb-1">
            Reflection
          </h4>
          <p className="text-sm text-slate-700">{quote.explanation}</p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" size="sm" onClick={onReadMore}>
          <BookOpen className="h-4 w-4 mr-2" />
          Read More
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
};

export default QuoteOfTheDay;
