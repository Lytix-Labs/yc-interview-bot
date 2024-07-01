import React, { useRef, useState } from "react";
import Loading from "../../components/Loading";
import { Button } from "../../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { useToast } from "../../ui/use-toast";
import HttpUtil from "../../utils/httpUtil";

const UploadAppPage: React.FC<{
  moveToNextPage: (questions?: string[]) => void;
}> = ({ moveToNextPage }) => {
  const fileUploadRef = useRef<HTMLInputElement>(null);
  const [openWhereToGet, setOpenWhereToGet] = useState(false);

  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const onSubmit = async () => {
    /**
     * @TODO Add logic here on blocking
     */

    if (
      fileUploadRef.current === null ||
      fileUploadRef.current.files === null ||
      fileUploadRef.current.files.length === 0 ||
      fileUploadRef.current.files[0] === undefined
    ) {
      toast({
        title: "Missing File",
        description: "Please select a file before continuing",
        variant: "destructive",
      });
      return;
    }

    /**
     * Set our loading spinner up
     */
    setLoading(true);

    /**
     * Upload and get our questions
     */
    const file = fileUploadRef.current?.files[0];
    try {
      const response: { questions: string[] } = await HttpUtil.uploadFile(file);

      /**
       * Congradulate them, and move on
       */
      moveToNextPage(response.questions);
      setLoading(false);
      toast({
        title: "🚀 Success",
        description: "We've parsed your app and built our context!",
      });
    } catch (error) {
      toast({
        title: "🚨 Error",
        description:
          "Something went wrong while uploading your file. Make sure its a PDF and try again.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
  };

  const onSubmitLazy = async () => {
    toast({
      title: "Lets get started",
      description:
        "We'll just use our (SpareChange) YC application to show you what this bot can do",
    });

    /**
     * Set our loading spinner up
     */
    setLoading(true);

    /**
     * Upload and get our questions
     */
    try {
      const response: { questions: string[] } = await HttpUtil.uploadFile(null);

      /**
       * Congratulate them, and move on
       */
      moveToNextPage(response.questions);
      setLoading(false);
      toast({
        title: "🚀 Success",
        description:
          "We've automatically used SpareChange's (our venture before Lytix) application to get started",
      });
    } catch (error) {
      toast({
        title: "🚨 Error",
        description: "Something went wrong",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }
  };

  return (
    <div>
      <p className="font-semibold text-lg text-center">
        Let's get started by parsing your app
      </p>
      <p className="text-sm text-center">
        We want to give you the most personalized advice possible, so we need to
        parse your app to get started.
      </p>

      {loading === true ? (
        <div className="flex flex-col justify-center items-center my-5">
          <Loading />
          <p className="text-sm text-gray-500 mt-2">
            👷 Parsing and building our context... 🧱
          </p>
        </div>
      ) : (
        <div className="flex flex-col my-2 justify-center w-full ">
          <div className="flex justify-center my-2">
            <input type="file" ref={fileUploadRef} />
          </div>
          <div className="flex justify-center gap-4">
            <Button onClick={onSubmit}>Upload Application</Button>
            <Button variant={"outline"} onClick={() => setOpenWhereToGet(true)}>
              👀 Where Do I Get This?
            </Button>
            <Button variant={"outline"} onClick={onSubmitLazy}>
              ⚡️ I'm lazy
            </Button>
          </div>
        </div>
      )}

      <Dialog open={openWhereToGet} onOpenChange={setOpenWhereToGet}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Where To Get Your YC PDF</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            You can get your YC PDF from the YC website.
          </DialogDescription>
          <div>
            <video
              src={"https://lytix-cdn.s3.amazonaws.com/ycBot/downloadYCApp.mov"}
              autoPlay={true}
              playsInline={true}
              // loop
              muted={true}
              className="homeBackgrondVideo"
              // onClick={() => this.play()}
              controls={true}
              style={{
                objectFit: "cover",
                borderRadius: 10,
                scale: 0.9,
                // paddingRight: 50,
                // height: "50vh",
                // width: "50vw",
                // opacity: 0.4,
              }}
            ></video>
          </div>
          <div>
            <p>
              To get a PDF of your application, head over to{" "}
              <a
                className="text-purple-500 underline"
                href="https://apply.ycombinator.com/"
                target="_blank"
              >
                https://apply.ycombinator.com/
              </a>{" "}
              , and print (Cmd ⌘ + P) to a PDF.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UploadAppPage;
