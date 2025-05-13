import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Progress } from "./ui/progress";

interface GuidedMeditationProps {
  title: string;
  description: string;
  duration: number; // in seconds
  steps: {
    time: number; // seconds into the meditation
    instruction: string;
  }[];
  onComplete?: () => void;
}

const GuidedMeditation = ({
  title = "Mindfulness Meditation",
  description = "A simple meditation focusing on breath awareness",
  duration = 300, // 5 minutes
  steps = [
    { time: 0, instruction: "Find a comfortable position and close your eyes" },
    {
      time: 30,
      instruction:
        "Take deep breaths, in through your nose and out through your mouth",
    },
    { time: 60, instruction: "Focus your attention on your breath" },
    {
      time: 120,
      instruction: "If your mind wanders, gently bring it back to your breath",
    },
    {
      time: 240,
      instruction:
        "Begin to deepen your breath and prepare to end your meditation",
    },
    { time: 290, instruction: "Slowly open your eyes when you're ready" },
  ],
  onComplete = () => {},
}: GuidedMeditationProps) => {
  const [isActive, setIsActive] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  React.useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeElapsed < duration) {
      interval = setInterval(() => {
        const newTimeElapsed = timeElapsed + 1;
        setTimeElapsed(newTimeElapsed);

        // Check if we need to update the current step
        for (let i = steps.length - 1; i >= 0; i--) {
          if (newTimeElapsed >= steps[i].time) {
            setCurrentStep(i);
            break;
          }
        }

        // Check if meditation is complete
        if (newTimeElapsed >= duration) {
          setIsActive(false);
          onComplete();
        }
      }, 1000) as unknown as number;
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeElapsed, duration, steps, onComplete]);

  const toggleMeditation = () => {
    setIsActive(!isActive);
  };

  const resetMeditation = () => {
    setIsActive(false);
    setTimeElapsed(0);
    setCurrentStep(0);
  };

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Calculate progress percentage
  const progressPercentage = (timeElapsed / duration) * 100;

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-orange-800">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-orange-800 mb-4">
            {formatTime(timeElapsed)} / {formatTime(duration)}
          </div>
          <Progress value={progressPercentage} className="w-full h-2" />
        </div>

        <div className="bg-white bg-opacity-50 p-4 rounded-md border border-orange-100">
          <h4 className="text-sm font-semibold text-orange-700 mb-2">
            Current Instruction:
          </h4>
          <p className="text-slate-700">{steps[currentStep].instruction}</p>
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            variant={isActive ? "destructive" : "default"}
            size="lg"
            onClick={toggleMeditation}
            className="w-24"
          >
            {isActive ? (
              <>
                <Pause className="mr-2 h-4 w-4" /> Pause
              </>
            ) : (
              <>
                <Play className="mr-2 h-4 w-4" /> Start
              </>
            )}
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={resetMeditation}
            disabled={timeElapsed === 0 && !isActive}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>

      <CardFooter className="pt-2 text-sm text-slate-600">
        <p>
          {isActive
            ? "Focus on your breath and follow the instructions..."
            : "Ready to begin your guided meditation?"}
        </p>
      </CardFooter>
    </Card>
  );
};

export default GuidedMeditation;
