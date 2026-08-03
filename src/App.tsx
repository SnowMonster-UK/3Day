import { useWorkout } from "@/hooks/useWorkout";
import HomeScreen from "@/components/HomeScreen";
import RunScreen from "@/components/RunScreen";
import DoneScreen from "@/components/DoneScreen";

export default function App() {
  const { state, start, quit, home, skip, back, togglePause, toggleVoice, selectDay, selectLevel } = useWorkout();

  return (
    <div className="flex min-h-screen justify-center" style={{ background: "#0e1013", color: "#f2f3f0" }}>
      <div
        className="relative flex w-full max-w-[460px] min-h-screen flex-col"
        style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {state.screen === "home" && (
          <HomeScreen
            dayIdx={state.dayIdx}
            level={state.level}
            voice={state.voice}
            onSelectDay={selectDay}
            onSelectLevel={selectLevel}
            onStart={start}
            onToggleVoice={toggleVoice}
          />
        )}
        {state.screen === "run" && (
          <RunScreen
            dayIdx={state.dayIdx}
            level={state.level}
            steps={state.steps}
            idx={state.idx}
            remain={state.remain}
            paused={state.paused}
            voice={state.voice}
            onQuit={quit}
            onToggleVoice={toggleVoice}
            onBack={back}
            onTogglePause={togglePause}
            onSkip={skip}
          />
        )}
        {state.screen === "done" && (
          <DoneScreen level={state.level} elapsed={state.elapsed} stepCount={state.steps.length - 1} doneDay={state.doneDay} onHome={home} />
        )}
      </div>
    </div>
  );
}
