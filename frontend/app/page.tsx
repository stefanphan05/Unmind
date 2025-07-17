import PromptBox from "./components/PromptBox";
import GlassContainer from "./components/GlassContainer";

export default function Home() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 gap-8 p-5 bmin-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div></div>
      <div className="flex flex-col gap-3">
        <GlassContainer>
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">
              Therapy Session
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Safe space for open conversation
            </p>
          </div>
        </GlassContainer>
        <PromptBox />
      </div>
    </div>
  );
}
