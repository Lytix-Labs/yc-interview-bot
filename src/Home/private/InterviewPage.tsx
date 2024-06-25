import { motion, useMotionValue, useSpring } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";

const InterviewPage: React.FC<{
  moveToNextPage: () => void;
  questions: string[];
}> = ({ moveToNextPage, questions }) => {
  const [talkingHead, setTalkingHead] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(-1);
  const [currentQuestion, setCurrentQuestion] = useState<string>(
    "I've read over your application. Are you ready to answer some questions?"
  );
  const [timerValue, setTimerValue] = useState<number | undefined>(undefined);
  const [openAllQuestions, setOpenAllQuestions] = useState(false);

  const opacityAbsolute = useMotionValue(1);
  const opacityStyle = useSpring(opacityAbsolute, {
    duration: 100,
  });

  const talkFor3Seconds = async () => {
    for (let i = 0; i < 30; i++) {
      setTalkingHead(i % 2 === 0 ? true : false);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    setTalkingHead(false);
  };

  useEffect(() => {
    Promise.resolve().then(async () => {
      setCurrentQuestion(
        "I've read over your application. Are you ready to answer some questions? You'll have 15 seconds to answer each question."
      );
      await talkFor3Seconds();
    });
  }, []);

  useEffect(() => {
    Promise.resolve().then(async () => {
      if (questionNumber === -1) return;
      if (timerValue !== undefined) return;
      if (questionNumber < questions.length) {
        /**
         * We have more questions to show
         * Fade in and out to the next question
         */
        opacityAbsolute.set(0);
        setCurrentQuestion(questions[questionNumber]);
        await new Promise((resolve) => setTimeout(resolve, 100));
        opacityAbsolute.set(1);
        await Promise.all([
          talkFor3Seconds(),
          Promise.resolve().then(async () => {
            for (let i = 15; i > 0; i--) {
              setTimerValue(i);
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
            setTimerValue(undefined);
          }),
        ]);
      } else {
        /**
         * We've finished all our questions
         */
        setTimerValue(undefined);
        setCurrentQuestion(
          "All done! Good job 👏 Refresh the page to go through a new set of questions."
        );
      }
    });
  }, [questionNumber]);

  return (
    <div>
      <div className="flex items-center  h-full">
        <motion.div
          className="h-full items-center flex justify-center "
          style={{
            opacity: opacityStyle,
          }}
        >
          <div className="bg-green-300 p-5 max-w-[350px] rounded-md shadow-md ">
            <p className="inline-block font-semibold">{currentQuestion}</p>
          </div>
        </motion.div>
        <div>
          {talkingHead === true ? (
            <img
              src={"/paul-gram-head-open.png"}
              width={200}
              height={200}
              alt="Paul Graham"
              style={{
                transform: "rotate(-1deg)",
              }}
            />
          ) : (
            <img
              src={"/paul-gram-head.png"}
              width={200}
              height={200}
              alt="Paul Gram"
            />
          )}
        </div>
      </div>

      {timerValue !== undefined && (
        <div className="flex justify-center mt-5">
          <p className="inline-block p-1 bg-amber-300 rounded-sm">
            {timerValue} seconds left
          </p>
        </div>
      )}

      <div className="flex justify-center mt-5 gap-4">
        {questionNumber < questions.length && (
          <Button
            onClick={() => setQuestionNumber(questionNumber + 1)}
            disabled={questionNumber !== -1 && timerValue !== undefined}
          >
            {questionNumber === -1 ? "🚀 Ready" : "🚀 Next"}
          </Button>
        )}
        <Button onClick={() => setOpenAllQuestions(true)} variant={"secondary"}>
          All Questions
        </Button>
      </div>

      <Dialog open={openAllQuestions} onOpenChange={setOpenAllQuestions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>All Questions</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-2">
            {questions.map((question, index) => (
              <p key={index}>• {question}</p>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InterviewPage;
