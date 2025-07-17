import React from "react";

interface TalkingCharacterProps {
  isTalking: boolean;
}

const TalkingCharacter: React.FC<TalkingCharacterProps> = ({ isTalking }) => {
  return (
    <div className="">
      <div className="relative">
        {/* Character Container */}
        <div className="relative w-96 flex flex-col items-center">
          {/* Head */}
          <div className="relative w-150 h-150 bg-gradient-to-br from-pink-50 to-pink-100 rounded-full border-4 border-pink-200 shadow-xl">
            {/* Hair - More voluminous and cute */}
            <div className="absolute -top-6 -left-6 w-84 h-48 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full transform -rotate-6 shadow-lg"></div>
            <div className="absolute -top-10 left-6 w-40 h-40 bg-gradient-to-br from-pink-200 to-rose-300 rounded-full shadow-md"></div>
            <div className="absolute -top-8 right-2 w-32 h-36 bg-gradient-to-br from-pink-300 to-rose-400 rounded-full transform rotate-12 shadow-md"></div>
            <div className="absolute -top-4 left-12 w-24 h-24 bg-gradient-to-br from-pink-100 to-rose-200 rounded-full shadow-sm"></div>
            <div className="absolute -top-6 right-8 w-20 h-20 bg-gradient-to-br from-pink-200 to-rose-300 rounded-full shadow-sm"></div>

            {/* Sparkles in hair */}
            <div className="absolute top-2 left-8 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
            <div
              className="absolute top-6 right-12 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-pulse"
              style={{ animationDelay: "0.5s" }}
            ></div>
            <div
              className="absolute top-4 left-20 w-1 h-1 bg-yellow-400 rounded-full animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>

            {/* Eyes - Much bigger and sparklier */}
            <div className="absolute top-16 left-12 w-20 h-24 bg-white rounded-full shadow-lg border-2 border-pink-100">
              <div className="absolute top-2 left-2 w-16 h-20 bg-gradient-to-br from-violet-400 to-purple-600 rounded-full">
                <div className="absolute top-2 left-2 w-8 h-8 bg-white rounded-full opacity-90"></div>
                <div className="absolute top-4 left-6 w-4 h-4 bg-white rounded-full opacity-60"></div>
                <div className="absolute top-6 left-3 w-2 h-2 bg-white rounded-full opacity-80"></div>
              </div>
            </div>
            <div className="absolute top-16 right-12 w-20 h-24 bg-white rounded-full shadow-lg border-2 border-pink-100">
              <div className="absolute top-2 right-2 w-16 h-20 bg-gradient-to-br from-violet-400 to-purple-600 rounded-full">
                <div className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full opacity-90"></div>
                <div className="absolute top-4 right-6 w-4 h-4 bg-white rounded-full opacity-60"></div>
                <div className="absolute top-6 right-3 w-2 h-2 bg-white rounded-full opacity-80"></div>
              </div>
            </div>

            {/* Cute eyelashes */}
            <div className="absolute top-12 left-16 w-6 h-1 bg-pink-400 rounded-full transform -rotate-45"></div>
            <div className="absolute top-12 left-20 w-4 h-1 bg-pink-400 rounded-full transform -rotate-30"></div>
            <div className="absolute top-12 right-16 w-6 h-1 bg-pink-400 rounded-full transform rotate-45"></div>
            <div className="absolute top-12 right-20 w-4 h-1 bg-pink-400 rounded-full transform rotate-30"></div>

            {/* Eyebrows - softer and more curved */}
            <div className="absolute top-10 left-14 w-16 h-3 bg-pink-400 rounded-full transform -rotate-12 opacity-70"></div>
            <div className="absolute top-10 right-14 w-16 h-3 bg-pink-400 rounded-full transform rotate-12 opacity-70"></div>

            {/* Nose - tiny and cute */}
            <div className="absolute top-30 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-pink-300 rounded-full"></div>

            {/* Mouth - cuter shape */}
            <div className="absolute top-36 left-1/2 transform -translate-x-1/2">
              {isTalking ? (
                <div
                  className={`mouth-talking ${
                    isTalking ? "animate-talking" : ""
                  }`}
                >
                  <div className="mouth-shape bg-gradient-to-b from-red-300 to-red-400 rounded-full shadow-inner border border-red-200"></div>
                </div>
              ) : (
                <div className="w-8 h-2 bg-gradient-to-r from-red-300 to-red-400 rounded-full border border-red-200"></div>
              )}
            </div>

            {/* Cheeks - bigger and more blushy */}
            <div className="absolute top-32 left-4 w-14 h-10 bg-gradient-to-br from-pink-200 to-rose-300 rounded-full opacity-80 animate-pulse"></div>
            <div className="absolute top-32 right-4 w-14 h-10 bg-gradient-to-br from-pink-200 to-rose-300 rounded-full opacity-80 animate-pulse"></div>

            {/* Extra cute details */}
            <div className="absolute top-34 left-8 w-3 h-3 bg-rose-200 rounded-full opacity-60"></div>
            <div className="absolute top-34 right-8 w-3 h-3 bg-rose-200 rounded-full opacity-60"></div>
          </div>

          {/* Body */}
          <div className="relative w-40 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-t-3xl rounded-b-2xl -mt-2 shadow-lg">
            {/* Tie */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-7 h-12 bg-gradient-to-b from-red-600 to-red-800 shadow-md"></div>
            <div className="absolute left-1/2 transform -translate-x-1/2 w-10 h-3 bg-gradient-to-b from-red-500 to-red-700 rounded-sm"></div>

            {/* Orange basketball in left hand */}
            <div className="absolute -left-45 -top-24 w-60 h-60 bg-gradient-to-br from-orange-300 via-orange-500 to-orange-700 rounded-full shadow-2xl">
              {/* Basketball texture/dimples */}
              <div className="absolute top-6 left-9 w-6 h-6 bg-orange-600 rounded-full opacity-70"></div>
              <div className="absolute top-15 left-21 w-6 h-6 bg-orange-600 rounded-full opacity-70"></div>
              <div className="absolute top-24 left-6 w-6 h-6 bg-orange-600 rounded-full opacity-70"></div>
              <div className="absolute top-36 left-15 w-6 h-6 bg-orange-600 rounded-full opacity-70"></div>
              <div className="absolute top-45 left-24 w-6 h-6 bg-orange-600 rounded-full opacity-70"></div>
              <div className="absolute top-9 left-30 w-6 h-6 bg-orange-600 rounded-full opacity-70"></div>
              <div className="absolute top-30 left-42 w-6 h-6 bg-orange-600 rounded-full opacity-70"></div>
              <div className="absolute top-18 left-36 w-6 h-6 bg-orange-600 rounded-full opacity-70"></div>
              <div className="absolute top-42 left-9 w-6 h-6 bg-orange-600 rounded-full opacity-70"></div>
              <div className="absolute top-48 left-30 w-6 h-6 bg-orange-600 rounded-full opacity-70"></div>
              <div className="absolute top-12 left-45 w-6 h-6 bg-orange-600 rounded-full opacity-70"></div>
              <div className="absolute top-33 left-51 w-6 h-6 bg-orange-600 rounded-full opacity-70"></div>
              <div className="absolute top-51 left-42 w-6 h-6 bg-orange-600 rounded-full opacity-70"></div>
              <div className="absolute top-39 left-21 w-6 h-6 bg-orange-600 rounded-full opacity-70"></div>
              <div className="absolute top-27 left-15 w-6 h-6 bg-orange-600 rounded-full opacity-70"></div>

              {/* Basketball seam lines */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-60 bg-black rounded-full"></div>
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-60 h-2 bg-black rounded-full"></div>

              {/* Curved seam lines */}
              <div className="absolute top-6 left-6 w-48 h-48 border-4 border-black rounded-full opacity-40"></div>
              <div className="absolute top-9 left-9 w-42 h-21 border-l-4 border-black rounded-l-full opacity-40"></div>
              <div className="absolute top-30 left-9 w-42 h-21 border-l-4 border-black rounded-l-full opacity-40"></div>
              <div className="absolute top-9 right-9 w-42 h-21 border-r-4 border-black rounded-r-full opacity-40"></div>
              <div className="absolute top-30 right-9 w-42 h-21 border-r-4 border-black rounded-r-full opacity-40"></div>

              {/* Highlight for 3D effect */}
              <div className="absolute top-6 left-9 w-30 h-30 bg-gradient-to-br from-white to-transparent rounded-full opacity-40"></div>
            </div>

            {/* Glazed donut in right hand - side view */}
            <div className="absolute -right-24 top-10 w-45 h-18 bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 rounded-full shadow-xl transform rotate-12">
              {/* Donut hole - elongated for side view */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-18 h-7 bg-gray-800 rounded-full shadow-inner"></div>

              {/* Pink frosting - side view */}
              <div className="absolute top-1 left-2 w-41 h-16 bg-gradient-to-br from-pink-300 via-pink-400 to-pink-500 rounded-full">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-6 bg-gray-800 rounded-full"></div>
              </div>

              {/* Colorful sprinkles - more spread out for side view */}
              <div className="absolute top-3 left-8 w-4 h-2 bg-red-400 rounded-full transform rotate-45"></div>
              <div className="absolute top-6 left-20 w-4 h-2 bg-blue-400 rounded-full transform rotate-12"></div>
              <div className="absolute top-12 left-4 w-4 h-2 bg-green-400 rounded-full transform -rotate-30"></div>
              <div className="absolute top-14 left-16 w-4 h-2 bg-yellow-400 rounded-full transform rotate-60"></div>
              <div className="absolute top-8 left-24 w-4 h-2 bg-purple-400 rounded-full transform -rotate-12"></div>
              <div className="absolute top-10 left-10 w-4 h-2 bg-orange-400 rounded-full transform rotate-90"></div>
              <div className="absolute top-4 left-16 w-4 h-2 bg-pink-600 rounded-full transform -rotate-45"></div>
              <div className="absolute top-9 left-5 w-4 h-2 bg-cyan-400 rounded-full transform rotate-30"></div>
              <div className="absolute top-13 left-12 w-4 h-2 bg-red-500 rounded-full transform rotate-75"></div>
              <div className="absolute top-5 left-12 w-4 h-2 bg-green-500 rounded-full transform -rotate-60"></div>
              <div className="absolute top-11 left-22 w-4 h-2 bg-blue-500 rounded-full transform rotate-15"></div>
              <div className="absolute top-15 left-6 w-4 h-2 bg-purple-500 rounded-full transform -rotate-80"></div>
              <div className="absolute top-7 left-30 w-4 h-2 bg-orange-500 rounded-full transform rotate-25"></div>
              <div className="absolute top-10 left-35 w-4 h-2 bg-red-600 rounded-full transform -rotate-55"></div>
              <div className="absolute top-2 left-25 w-4 h-2 bg-green-600 rounded-full transform rotate-85"></div>

              {/* Glaze shine effect - adjusted for side view */}
              <div className="absolute top-3 left-4 w-16 h-8 bg-gradient-to-br from-white to-transparent rounded-full opacity-60"></div>
            </div>
          </div>

          {/* Legs */}
          <div className="flex space-x-4">
            <div className="w-12 h-10 bg-gradient-to-b from-blue-600 to-blue-800 rounded-b-lg shadow-md"></div>
            <div className="w-12 h-10 bg-gradient-to-b from-blue-600 to-blue-800 rounded-b-lg shadow-md"></div>
          </div>

          {/* Feet */}
          <div className="flex space-x-4">
            <div className="w-16 h-6 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full shadow-md"></div>
            <div className="w-16 h-6 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full shadow-md"></div>
          </div>
        </div>

        {/* Speech indication */}
        {isTalking && (
          <div className="absolute -top-12 -right-16 flex space-x-2">
            <div
              className="animate-bounce w-4 h-4 bg-blue-400 rounded-full"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="animate-bounce w-4 h-4 bg-blue-400 rounded-full"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="animate-bounce w-4 h-4 bg-blue-400 rounded-full"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        )}
      </div>

      <style jsx>{`
        .mouth-talking {
          position: relative;
          width: 24px;
          height: 16px;
        }

        .mouth-shape {
          width: 100%;
          height: 100%;
          transition: all 0.1s ease-in-out;
        }

        @keyframes talking {
          0% {
            width: 8px;
            height: 4px;
            transform: scaleY(0.5);
          }
          25% {
            width: 24px;
            height: 16px;
            transform: scaleY(1);
          }
          50% {
            width: 16px;
            height: 12px;
            transform: scaleY(0.8);
          }
          75% {
            width: 28px;
            height: 20px;
            transform: scaleY(1.2);
          }
          100% {
            width: 12px;
            height: 8px;
            transform: scaleY(0.6);
          }
        }

        .animate-talking {
          animation: talking 0.6s ease-in-out infinite;
        }

        /* Subtle breathing animation when not talking */
        ${!isTalking
          ? `
          .relative:first-child {
            animation: breathing 3s ease-in-out infinite;
          }
          
          @keyframes breathing {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.02);
            }
          }
        `
          : ""}
      `}</style>
    </div>
  );
};

export default TalkingCharacter;
