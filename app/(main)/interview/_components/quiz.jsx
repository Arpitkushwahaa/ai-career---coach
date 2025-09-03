"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { generateQuiz, saveQuizResult } from "@/actions/interview";
import QuizResult from "./quiz-result";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const {
    loading: generatingQuiz,
    fn: generateQuizFn,
    data: quizData,
  } = useFetch(generateQuiz);

  const {
    loading: savingResult,
    fn: saveQuizResultFn,
    data: resultData,
    setData: setResultData,
  } = useFetch(saveQuizResult);

  // Generate a unique session ID for each quiz attempt
  const generateSessionId = () => {
    return `quiz_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  };

  useEffect(() => {
    if (quizData) {
      setAnswers(new Array(quizData.length).fill(null));
    }
  }, [quizData]);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === quizData[index].correctAnswer) {
        correct++;
      }
    });
    return (correct / quizData.length) * 100;
  };

  const finishQuiz = async () => {
    const score = calculateScore();
    try {
      await saveQuizResultFn(quizData, answers, score);
      toast.success("Quiz completed!");
    } catch (error) {
      toast.error(error.message || "Failed to save quiz results");
    }
  };

  const startNewQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowExplanation(false);
    setSessionId(generateSessionId());
    generateQuizFn();
    setResultData(null);
  };

  const handleStartQuiz = () => {
    setSessionId(generateSessionId());
    generateQuizFn();
  };

  if (generatingQuiz) {
    return (
      <div className="mx-2">
        <Card>
          <CardHeader>
            <CardTitle>Generating Your Quiz...</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Creating fresh questions tailored to your industry and skills...
            </p>
            <BarLoader className="mt-4" width={"100%"} color="gray" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show results if quiz is completed
  if (resultData) {
    return (
      <div className="mx-2">
        <QuizResult result={resultData} onStartNew={startNewQuiz} />
      </div>
    );
  }

  if (!quizData) {
    return (
      <Card className="mx-2">
        <CardHeader>
          <CardTitle>Ready to test your knowledge?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This quiz contains 10 questions specific to your industry and
            skills. Each time you take the quiz, you'll get different questions
            to help you prepare thoroughly.
          </p>
          <div className="mt-4 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">What to expect:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Fresh questions every time</li>
              <li>• Industry-specific content</li>
              <li>• Detailed explanations</li>
              <li>• Personalized improvement tips</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleStartQuiz} className="w-full">
            Start New Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const question = quizData[currentQuestion];
  const quizCategory = quizData[0]?.category;
  const quizDifficulty = quizData[0]?.difficulty;

  return (
    <Card className="mx-2">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>
              Question {currentQuestion + 1} of {quizData.length}
            </CardTitle>
            {quizCategory && quizDifficulty && (
              <p className="text-sm text-muted-foreground mt-1">
                Focus: {quizCategory} • Level: {quizDifficulty}
              </p>
            )}
          </div>
          {sessionId && (
            <div className="text-xs text-muted-foreground">
              Session: {sessionId.substring(0, 8)}...
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg font-medium">{question.question}</p>
        <RadioGroup
          onValueChange={handleAnswer}
          value={answers[currentQuestion]}
          className="space-y-2"
        >
          {question.options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))}
        </RadioGroup>

        {showExplanation && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-medium">Explanation:</p>
            <p className="text-muted-foreground">{question.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        {!showExplanation && (
          <Button
            onClick={() => setShowExplanation(true)}
            variant="outline"
            disabled={!answers[currentQuestion]}
          >
            Show Explanation
          </Button>
        )}
        <Button
          onClick={handleNext}
          disabled={!answers[currentQuestion] || savingResult}
          className="ml-auto"
        >
          {savingResult ? (
            <BarLoader className="mt-4" width={"100%"} color="gray" />
          ) : (
            currentQuestion < quizData.length - 1
              ? "Next Question"
              : "Finish Quiz"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
