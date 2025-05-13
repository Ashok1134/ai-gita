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

interface DailyWisdomProps {
  onReadMore?: () => void;
}

const DailyWisdom = ({ onReadMore = () => {} }: DailyWisdomProps) => {
  // In a real app, this would be fetched from an API or database
  const wisdom = {
    verse: {
      chapter: 2,
      number: 47,
      sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन।",
      translation:
        "You have a right to perform your prescribed duties, but you are not entitled to the fruits of your actions.",
    },
    reflection:
      "This verse teaches us the principle of detachment from results while performing our duties. When we focus solely on doing our best without being anxious about outcomes, we find peace and clarity in action.",
    application:
      "Today, focus on giving your best effort to your tasks without worrying about success or failure. Notice how this mindset brings greater presence and reduces anxiety.",
  };

  return (
    <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-orange-800">Daily Wisdom</CardTitle>
        <CardDescription>
          Chapter {wisdom.verse.chapter}, Verse {wisdom.verse.number}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <p className="font-medium text-slate-800 italic mb-1">
            "{wisdom.verse.translation}"
          </p>
          <p className="text-sm text-slate-600">{wisdom.verse.sanskrit}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-orange-700 mb-1">
            Reflection
          </h4>
          <p className="text-sm text-slate-700">{wisdom.reflection}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-orange-700 mb-1">
            Today's Practice
          </h4>
          <p className="text-sm text-slate-700">{wisdom.application}</p>
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

export default DailyWisdom;
