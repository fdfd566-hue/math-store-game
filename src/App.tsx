import { useCallback, useEffect, useState } from "react";
import { Footer, Header } from "./Chrome";
import {
  BoardScreen,
  HomeScreen,
  NameScreen,
  PlayScreen,
  ResultScreen,
  type RoundResult,
} from "./screens";
import { loadBoard, saveScore, type Score } from "./board";
import { GAME_TITLE } from "./game";
import { getMuted, playTap, setMuted } from "./audio";

type Screen = "home" | "name" | "play" | "result" | "board";

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [name, setName] = useState("");
  const [result, setResult] = useState<RoundResult | null>(null);
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [muted, setMutedState] = useState(getMuted());
  const [playKey, setPlayKey] = useState(0);

  useEffect(() => {
    let alive = true;
    loadBoard()
      .then((list) => {
        if (alive) {
          setScores(list);
          setLoading(false);
        }
      })
      .catch(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  const toggleMute = useCallback(() => {
    const next = !getMuted();
    setMuted(next);
    setMutedState(next);
    if (!next) playTap();
  }, []);

  const openBoard = useCallback(async () => {
    setScreen("board");
    setLoading(true);
    const list = await loadBoard();
    setScores(list);
    setLoading(false);
  }, []);

  const finishRound = useCallback(async (r: RoundResult) => {
    setResult(r);
    setScreen("result");
    const score: Score = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: r.name,
      points: r.points,
      correct: r.correct,
      errors: r.errors,
      seconds: r.seconds,
      level: GAME_TITLE,
      date: new Date().toISOString().slice(0, 10),
    };
    const list = await saveScore(score);
    setScores(list);
    setLoading(false);
  }, []);

  return (
    <div className="paper-grain flex min-h-screen flex-col bg-cream">
      <Header muted={muted} onToggleMute={toggleMute} />

      <main className="flex-1">
        {screen === "home" && (
          <HomeScreen onStart={() => setScreen("name")} onBoard={openBoard} />
        )}

        {screen === "name" && (
          <NameScreen
            onStart={(studentName) => {
              setName(studentName);
              setPlayKey((k) => k + 1);
              setScreen("play");
            }}
            onBack={() => setScreen("home")}
          />
        )}

        {screen === "play" && (
          <PlayScreen
            key={playKey}
            name={name}
            onFinish={finishRound}
            onQuit={() => setScreen("home")}
          />
        )}

        {screen === "result" && result && (
          <ResultScreen
            result={result}
            onReplay={() => {
              setPlayKey((k) => k + 1);
              setScreen("play");
            }}
            onBoard={openBoard}
            onHome={() => setScreen("home")}
          />
        )}

        {screen === "board" && (
          <BoardScreen
            scores={scores}
            loading={loading}
            onHome={() => setScreen("home")}
            onPlay={() => setScreen("name")}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
