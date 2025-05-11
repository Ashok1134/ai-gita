import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Progress } from "./ui/progress";
import { Play, Pause, RotateCcw, Volume2, VolumeX } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface MeditationTimerProps {
  defaultDuration?: number; // in minutes
  onComplete?: () => void;
}

const MeditationTimer = ({
  defaultDuration = 5,
  onComplete = () => {},
}: MeditationTimerProps) => {
  const [duration, setDuration] = useState(defaultDuration);
  const [timeLeft, setTimeLeft] = useState(duration * 60); // in seconds
  const [isActive, setIsActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [ambientSound, setAmbientSound] = useState<HTMLAudioElement | null>(
    null,
  );

  // Initialize ambient sound
  useEffect(() => {
    const audio = new Audio(
      "https://cdn.pixabay.com/download/audio/2022/03/15/audio_1fb1757219.mp3?filename=om-mantra-118-bpm-with-background-music-118-bpm-61s-8683.mp3",
    );
    audio.loop = true;
    setAmbientSound(audio);

    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  // Timer logic
  useEffect(() => {
    let interval: number | undefined;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000) as unknown as number;
    } else if (isActive && timeLeft === 0) {
      setIsActive(false);
      if (ambientSound) {
        ambientSound.pause();
        ambientSound.currentTime = 0;
      }
      onComplete();
      // Play completion sound
      const completionSound = new Audio(
        "https://cdn.pixabay.com/download/audio/2021/08/09/audio_12b0c7443c.mp3?filename=tibetan-bells-sound-6772.mp3",
      );
      completionSound.play();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onComplete, ambientSound]);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Calculate progress percentage
  const progressPercentage =
    ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  const toggleTimer = () => {
    setIsActive(!isActive);
    if (!isActive && ambientSound && !isMuted) {
      ambientSound.play();
    } else if (ambientSound) {
      ambientSound.pause();
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
    if (ambientSound) {
      ambientSound.pause();
      ambientSound.currentTime = 0;
    }
  };

  const handleDurationChange = (value: number[]) => {
    const newDuration = value[0];
    setDuration(newDuration);
    setTimeLeft(newDuration * 60);
    if (isActive) {
      setIsActive(false);
      if (ambientSound) {
        ambientSound.pause();
        ambientSound.currentTime = 0;
      }
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (ambientSound) {
      if (!isMuted) {
        ambientSound.pause();
      } else if (isActive) {
        ambientSound.play();
      }
    }
  };

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-orange-800">Meditation Timer</CardTitle>
        <CardDescription>
          Set your meditation duration and focus on your breath
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-orange-800 mb-4">
            {formatTime(timeLeft)}
          </div>
          <Progress value={progressPercentage} className="w-full h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-slate-600">
            <span>Duration: {duration} minutes</span>
          </div>
          <Slider
            defaultValue={[duration]}
            max={30}
            min={1}
            step={1}
            onValueChange={handleDurationChange}
            disabled={isActive}
            className="py-4"
          />
        </div>

        <div className="flex justify-center space-x-4">
          <Button
            variant={isActive ? "destructive" : "default"}
            size="lg"
            onClick={toggleTimer}
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
            onClick={resetTimer}
            disabled={timeLeft === duration * 60 && !isActive}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="icon" onClick={toggleMute}>
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>

      <CardFooter className="pt-2 text-sm text-slate-600">
        <p>
          {isActive
            ? "Focus on your breath and clear your mind..."
            : "Ready to begin your meditation practice?"}
        </p>
      </CardFooter>
    </Card>
  );
};

export default MeditationTimer;
