'use client';

import { useCallback, useEffect, useState } from 'react';
import { QUIZZ_QUESTIONS as questions } from '@/data/quiz';
import { Button } from '@/components/ui/button';
import ProgressBar from '@/components/ProgressBar';
import { Play, X, TimerReset } from 'lucide-react';
import { InferSelectModel } from 'drizzle-orm';
import {
  questionAnswers,
  questions as DbQuestions,
  quizzes,
} from '@/db/schema';
import QuizzSubmission from './QuizzSubmission';
import ResultCard from './ResultCard';
import { useRouter } from 'next/navigation';
import { saveSubmission } from '../actions/saveSubmissions';

type Answer = InferSelectModel<typeof questionAnswers>;
type Question = InferSelectModel<typeof DbQuestions> & { answers: Answer[] };
type Quizz = InferSelectModel<typeof quizzes> & { questions: Question[] };

type Props = {
  quizz: Quizz;
};

export default function QuizzQuestions(props: Props) {
  // const { questions } = que;
  const [started, setStarted] = useState<boolean>(false);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<
    { questionId: number; answerId: number }[]
  >([]);
  const [progressBarValue, setProgressBarValue] = useState<number>(-1);
  const [countdown, setCountdown] = useState<number>(5);
  const router = useRouter();

  const handleNext = useCallback(() => {
    setProgressBarValue(100);
    if (!started) {
      setStarted(true);
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCountdown(5);
    } else {
      setProgressBarValue(-1);
      setSubmitted(true);
      return;
    }
  }, [currentQuestion, started]);

  useEffect(() => {
    if (!started) return;
    if (progressBarValue >= 0) {
      const timer = setInterval(() => {
        setCountdown((prevCountdown) => {
          setProgressBarValue(
            (prevProgressBarValue) => prevProgressBarValue - 10
          );
          return prevCountdown - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    } else {
      handleNext();
    }
  }, [progressBarValue, handleNext, countdown, started]);

  const handleAnswer = (answer: Answer, questionId: number) => {
    const newUserAnswersArr = [
      ...userAnswers,
      {
        answerId: answer.id,
        questionId,
      },
    ];
    setUserAnswers(newUserAnswersArr);
    const isCurrentCorrect = answer.isCorrect;
    if (isCurrentCorrect) {
      setScore(score + 1);
    }

    handleNext();
  };

  const handleSubmit = async () => {
    try {
      const subId = await saveSubmission({ score }, props.quizz.id);
    } catch (e) {
      console.log(e);
    }

    setSubmitted(true);
  };

  const handlePressPrev = () => {
    if (currentQuestion !== 0) {
      setCurrentQuestion((prevCurrentQuestion) => prevCurrentQuestion - 1);
    }
  };

  const handleExit = () => {
    router.push('/quizz/2');
  };

  const scorePercentage: number = Math.round((score / questions.length) * 100);
  const selectedAnswer: number | null | undefined = userAnswers.find(
    (item) => item.questionId === questions[currentQuestion].id
  )?.answerId;
  const isCorrect: boolean | null | undefined = questions[
    currentQuestion
  ].answers.findIndex((answer: any) => answer.id === selectedAnswer)
    ? questions[currentQuestion].answers.find(
        (answer: any) => answer.id === selectedAnswer
      )?.isCorrect
    : null;

  if (submitted) {
    return (
      <QuizzSubmission
        score={score}
        scorePercentage={scorePercentage}
        totalQuestions={questions.length}
      />
    );
  }

  return (
    <div className='flex flex-col flex-1'>
      <div className='position-sticky top-0 z-10 shadow-md py-4 w-full'>
        <header className='grid grid-cols-[auto,1fr,auto] grid-flow-col items-center justify-beteween py-2 gap-2'>
          <Button
            size='icon'
            variant='default'
            onClick={handleNext}
            className='disabled:opacity-100'
            disabled={!!started}
          >
            {!started ? <Play /> : <TimerReset />}
          </Button>
          <ProgressBar value={progressBarValue} />
          <Button
            size='icon'
            variant='outline'
            onClick={handleExit}
          >
            <X />
          </Button>
        </header>
      </div>
      <main className='flex justify-center flex-1'>
        {!started ? (
          <h1 className='text-3xl font-bold'>Welcome to the quizz page👋</h1>
        ) : (
          <div className='flex flex-col items-center'>
            <h2 className='text-3xl font-bold'>
              {questions[currentQuestion].questionText}
            </h2>
            <div className='flex w-full gap-6 mt-6'>
              {questions[currentQuestion].answers.map((answer: any) => {
                const variant =
                  selectedAnswer === answer.id
                    ? answer.isCorrect
                      ? 'neoSuccess'
                      : 'neoDanger'
                    : 'neoOutline';
                return (
                  <Button
                    key={answer.id}
                    disabled={!!selectedAnswer}
                    variant={variant}
                    size='xl'
                    onClick={() =>
                      handleAnswer(answer, questions[currentQuestion].id)
                    }
                    className='disabled:opacity-100'
                  >
                    <p className='whitespace-normal'>{answer.answerText}</p>
                  </Button>
                );
              })}
            </div>
          </div>
        )}
      </main>
      <footer className='footer pb-9 px-6 relative mb-0'>
        <div style={{ visibility: 'hidden' }}>
          {' '}
          <ResultCard
            isCorrect={isCorrect}
            correctAnswer={
              questions[currentQuestion].answers.find(
                (answer: any) => answer.isCorrect === true
              )?.answerText || ''
            }
          />
        </div>
        {/*currentQuestion === questions.length - 1 ? (
          <Button
            variant='neo'
            size='lg'
            onClick={handleSubmit}
          >
            Submit
          </Button>
        ) : (
          <Button
            variant='default'
            size='lg'
            style={{ display: 'none' }}
            onClick={handleNext}
          >
            {!started ? 'Start' : 'Next'}
          </Button>
        ) */}
      </footer>
    </div>
  );
}
