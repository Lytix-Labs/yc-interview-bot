import React from "react";
import { Button } from "../../ui/button";

const StartPage: React.FC<{ moveToNextPage: () => void }> = ({
  moveToNextPage,
}) => {
  return (
    <div>
      <p className="font-semibold text-lg text-center">👋 Welcome</p>
      <p className="text-sm text-center">
        This bot is designed to help you prep for your YC interview by giving
        you personalized advice and tips based on your application.
      </p>
      <p className="text-sm text-center">
        We've trained this bot on data from ✨ Paul Graham ✨.
      </p>

      <div className="flex mt-3 items-center justify-center">
        <div className="bg-amber-300 p-2 rounded-md">
          <p>Step 1: Upload YC App</p>
        </div>
        <div className="mx-2">➡</div>
        <div className="bg-green-300 p-2 rounded-md">
          <p>Step 2: Personalized Interview Questions</p>
        </div>
        <div className="mx-2">➡</div>
        <div className="bg-sky-300 p-2 rounded-md">
          <p>Step 3: 🤝</p>
        </div>
      </div>

      <div className="flex justify-center mt-5">
        <Button onClick={moveToNextPage}>🚀 Get Started</Button>
      </div>
    </div>
  );
};

export default StartPage;
