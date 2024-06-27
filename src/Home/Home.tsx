import { motion, useMotionValue, useSpring } from "framer-motion";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import InterviewPage from "./private/InterviewPage";
import StartPage from "./private/StartPage";
import UploadAppPage from "./private/UploadAppPage";

const Home: React.FC<{}> = () => {
  const [currentPage, setCurrentPage] = useState<
    "startPage" | "parseApp" | "interviewPage"
  >("startPage");
  const [moveToNextPage, setMoveToNextPage] = useState<boolean>(false);
  // const mainBoxOpacity = useSpring({ opacity: 1 });

  const opacityAbsolute = useMotionValue(1);
  const opacityStyle = useSpring(opacityAbsolute, {
    duration: 250,
  });
  const [questions, setQuestions] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    Promise.resolve().then(async () => {
      if (moveToNextPage === true) {
        /**
         * First dim the lights
         */
        opacityAbsolute.set(0);
        await new Promise((resolve) => setTimeout(resolve, 350));

        /**
         * Depending on where we are move to differnet pages
         */
        switch (currentPage) {
          case "startPage": {
            setCurrentPage("parseApp");
            break;
          }
          case "parseApp": {
            setCurrentPage("interviewPage");
            break;
          }
        }

        opacityAbsolute.set(1);
        await new Promise((resolve) => setTimeout(resolve, 250));

        setMoveToNextPage(false);
      }
    });
  }, [moveToNextPage]);

  return (
    <div className="bg-gray-900">
      <div className="flex flex-col pt-40 items-center h-screen w-screen ">
        <div className=" bg-white p-5 rounded-md">
          <div className="flex gap-4">
            <img
              src={"YC-logo.png"}
              alt="YC Bot"
              style={{
                width: "150px",
                height: "150px",
                borderRadius: 10,
                overflow: "hidden",
              }}
            />
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-4xl font-bold">X</h1>
            </div>
            <img
              src={"lytix-logo.svg"}
              alt="YC Bot"
              style={{
                width: "150px",
                height: "150px",
                borderRadius: 10,
                overflow: "hidden",
                backgroundColor: "#0071fc",
              }}
            />
          </div>
          <div className="flex-col items-center justify-center flex mt-5">
            <h1 className="inline-block text-4xl font-bold">YC Prep Bot</h1>
            <p className="text-gray-500">
              Made with ❤️ by{" "}
              <a
                target="_blank"
                className="text-purple-500 underline"
                href="https://lytix.co"
              >
                lytix.co
              </a>{" "}
              [YC W24]
            </p>
          </div>
        </div>
        <motion.div
          className="mt-10 bg-white rounded-md p-3"
          style={{ opacity: opacityStyle }}
        >
          {currentPage === "startPage" && (
            <StartPage moveToNextPage={() => setMoveToNextPage(true)} />
          )}
          {currentPage === "parseApp" && (
            <UploadAppPage
              moveToNextPage={(questions) => {
                setMoveToNextPage(true);
                if (questions) {
                  setQuestions(questions);
                }
              }}
            />
          )}
          {currentPage === "interviewPage" && (
            <InterviewPage
              moveToNextPage={() => setMoveToNextPage(true)}
              questions={questions}
            />
          )}
        </motion.div>

        <div className="flex justify-center items-center mt-5 gap-5">
          <Button
            variant={"secondary"}
            onClick={() => {
              window.open(
                "https://blog.lytix.co/posts/yc-interviewer-bot",
                "_blank"
              );
            }}
          >
            📖 Why & How We Built This
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              window.open(
                "https://book.vimcal.com/p/sahilsinha/30minutes-8347b",
                "_blank"
              );
              toast({
                title: "We'd love to get in touch",
                description:
                  "We love helping other founders and learning what the community is going. Set up a time to chat 🚀",
              });
            }}
          >
            💬 Talk to us About Your YC App or Idea. We Want to Help!
          </Button>
        </div>
        <div className="flex justify-center items-center mt-5 gap-5">
          <Button
            variant={"secondary"}
            onClick={() => {
              window.open(
                "https://github.com/Lytix-Labs/yc-interview-bot",
                "_blank"
              );
            }}
          >
            👩‍💻 Source Code
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
