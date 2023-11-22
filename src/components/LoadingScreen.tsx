import { useProgress } from "@react-three/drei";
import { Dispatch, SetStateAction, useEffect } from "react";

export const LoadingScreen = ({ started, setStarted }: { started: boolean, setStarted: Dispatch<SetStateAction<boolean>> }) => {
  const { progress, total, loaded, item } = useProgress();

  useEffect(() => {
    console.log(progress, total, loaded, item);
    if (progress === 100) {
      setTimeout(() => {
        setStarted(true);
      }, 500);
    }
  }, [progress, total, loaded, item]);

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full z-50 transition-opacity duration-1000 pointer-events-none
  flex items-center justify-center bg-indigo-50 
  ${started ? "opacity-0" : "opacity-100"}`}
    >
      <div className="relative text-4xl font-bold text-indigo-900 md:text-9xl">
        <div
          className="absolute top-0 left-0 overflow-hidden truncate transition-all duration-500 text-clip"
          style={{
            width: `${progress}%`,
          }}
        >
          Wawa Sensei
        </div>
        <div className="opacity-40">Wawa Sensei</div>
      </div>
    </div>
  );
};
