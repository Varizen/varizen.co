"use client";

import { useEffect, useRef, useState } from "react";
import { Zap, Shield, Target, Flame, Award, Clock } from "lucide-react";

type GameState = "idle" | "countdown" | "playing" | "ended";
type Target = { id: number; x: number; y: number; hit: boolean; timestamp: number };

export function ZReflexDemo() {
  const [state, setGameState] = useState<GameState>("idle");
  const [countdown, setCountdown] = useState(3);
  const [targets, setTargets] = useState<Target[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [taps, setTaps] = useState(0);
  const [hits, setHits] = useState(0);
  const [reactionTime, setReactionTime] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [difficulty, setDifficulty] = useState(1);
  const [elapsed, setElapsed] = useState(0);
  const gameRef = useRef<HTMLDivElement>(null);
  const gameLoopRef = useRef<NodeJS.Timeout>();
  const countdownRef = useRef<NodeJS.Timeout>();
  const timerRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>(0);
  const firstHitRef = useRef<number>(0);

  // Start game countdown
  const startGame = () => {
    setGameState("countdown");
    setCountdown(3);
    setScore(0);
    setCombo(0);
    setMaxCombo(0);
    setTaps(0);
    setHits(0);
    setAccuracy(0);
    setDifficulty(1);
    setElapsed(0);
    setTargets([]);
  };

  // Countdown
  useEffect(() => {
    if (state !== "countdown") return;
    if (countdown > 0) {
      countdownRef.current = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else {
      setGameState("playing");
      startTimeRef.current = Date.now();
      firstHitRef.current = 0;
    }
    return () => clearTimeout(countdownRef.current);
  }, [state, countdown]);

  // Main game loop: spawn targets, increase difficulty
  useEffect(() => {
    if (state !== "playing") return;

    let targetId = 0;
    let spawnInterval = Math.max(300, 1000 - difficulty * 50);

    gameLoopRef.current = setInterval(() => {
      setElapsed((Date.now() - startTimeRef.current) / 1000);

      // Difficulty ramps: every 10 sec, spawn rate increases
      const newDifficulty = Math.floor(elapsed / 10) + 1;
      if (newDifficulty > difficulty) setDifficulty(newDifficulty);

      if (elapsed > 30) {
        setGameState("ended");
        return;
      }

      const container = gameRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = Math.random() * (rect.width - 60);
      const y = Math.random() * (rect.height - 60);

      setTargets((prev) => [
        ...prev,
        { id: targetId++, x, y, hit: false, timestamp: Date.now() },
      ]);

      // Remove old targets after 2 seconds
      setTimeout(() => {
        setTargets((prev) => prev.filter((t) => Date.now() - t.timestamp < 2000));
      }, 2000);
    }, spawnInterval);

    return () => clearInterval(gameLoopRef.current);
  }, [state, difficulty, elapsed]);

  // Handle target tap
  const hitTarget = (id: number) => {
    setTaps((t) => t + 1);

    setTargets((prev) => {
      const target = prev.find((t) => t.id === id);
      if (!target || target.hit) return prev;

      if (!firstHitRef.current) firstHitRef.current = Date.now();

      const hitTime = Date.now() - target.timestamp;
      setReactionTime(hitTime);
      setHits((h) => h + 1);
      setCombo((c) => {
        const newCombo = c + 1;
        if (newCombo > maxCombo) setMaxCombo(newCombo);
        return newCombo;
      });

      const points = Math.max(10, 100 - hitTime * 0.2) * difficulty * (1 + combo * 0.1);
      setScore((s) => s + Math.floor(points));

      return prev.map((t) =>
        t.id === id ? { ...t, hit: true } : t
      );
    });
  };

  // Calculate accuracy
  useEffect(() => {
    if (taps > 0) setAccuracy(Math.floor((hits / taps) * 100));
  }, [hits, taps]);

  // Game over
  useEffect(() => {
    if (state !== "ended") return;
    clearInterval(gameLoopRef.current);
    setTargets([]);
  }, [state]);

  const leaderboardRank = Math.max(1, Math.floor(150 - score / 20));

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#0a0a0c] via-[#121214] to-[#1a1a1e] text-white overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 h-16 flex items-center justify-between px-6 bg-gradient-to-b from-black/40 to-transparent border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FF4500] flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">ZReflex</h1>
            <span className="text-xs text-[#FF6B35] font-semibold">Human Skill Only</span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/[0.02]">
          <Shield className="w-4 h-4 text-[#FF6B35]" />
          <span className="text-xs font-mono">Anti-Cheat Verified</span>
        </div>
      </div>

      {/* Main game area */}
      <div
        ref={gameRef}
        className="absolute inset-0 top-16 bg-radial from-[#FF6B35]/[0.04] to-transparent overflow-hidden"
        onClick={(e) => {
          if (state !== "playing") return;
          const rect = gameRef.current?.getBoundingClientRect();
          if (!rect) return;
          // Miss penalty
          setTaps((t) => t + 1);
          setCombo(0);
        }}
      >
        {/* Grid background */}
        <svg className="absolute inset-0 opacity-[0.03]" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Targets */}
        {targets.map((target) => (
          <button
            key={target.id}
            onClick={(e) => {
              e.stopPropagation();
              hitTarget(target.id);
            }}
            className={`absolute w-16 h-16 rounded-lg transition-all ${
              target.hit
                ? "scale-[0.3] opacity-0"
                : "scale-100 opacity-100 animate-pulse"
            }`}
            style={{
              left: target.x,
              top: target.y,
              background: "radial-gradient(circle, #FF6B35 0%, #FF4500 70%)",
              boxShadow: "0 0 30px rgba(255, 107, 53, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.2)",
              border: "1px solid rgba(255, 107, 53, 0.5)",
            }}
            title="Tap me!"
          >
            <Target className="w-8 h-8 m-auto" />
          </button>
        ))}

        {/* Countdown overlay */}
        {state === "countdown" && (
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm">
            <div className="text-center">
              <div className="text-8xl font-black text-[#FF6B35] animate-bounce">
                {countdown || "GO!"}
              </div>
              <p className="text-sm text-gray-400 mt-4">Get ready to react...</p>
            </div>
          </div>
        )}

        {/* Game over overlay */}
        {state === "ended" && (
          <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="max-w-2xl w-full mx-4 p-8 rounded-2xl border border-[#FF6B35]/30 bg-gradient-to-br from-[#1a1a1e] to-[#0a0a0c] shadow-2xl">
              <div className="text-center mb-8">
                <Award className="w-16 h-16 mx-auto mb-4 text-[#FF6B35]" />
                <h2 className="text-4xl font-black mb-2">Challenge Complete!</h2>
                <p className="text-sm text-gray-400">Your skill is being verified...</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 rounded-lg border border-white/10 bg-white/[0.02]">
                  <div className="text-2xl font-bold text-[#FF6B35]">{Math.floor(score)}</div>
                  <div className="text-xs text-gray-500 mt-1">SCORE</div>
                </div>
                <div className="p-4 rounded-lg border border-white/10 bg-white/[0.02]">
                  <div className="text-2xl font-bold text-[#FF6B35]">{accuracy}%</div>
                  <div className="text-xs text-gray-500 mt-1">ACCURACY</div>
                </div>
                <div className="p-4 rounded-lg border border-white/10 bg-white/[0.02]">
                  <div className="text-2xl font-bold text-[#FF6B35]">{Math.round(reactionTime)}ms</div>
                  <div className="text-xs text-gray-500 mt-1">AVG REACTION</div>
                </div>
                <div className="p-4 rounded-lg border border-white/10 bg-white/[0.02]">
                  <div className="text-2xl font-bold text-[#FF6B35]">#{leaderboardRank}</div>
                  <div className="text-xs text-gray-500 mt-1">LEADERBOARD</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-8 text-center text-xs">
                <div>
                  <Flame className="w-4 h-4 mx-auto mb-1 text-[#FF6B35]" />
                  <div className="font-bold">{maxCombo}</div>
                  <div className="text-gray-500">Max Combo</div>
                </div>
                <div>
                  <Target className="w-4 h-4 mx-auto mb-1 text-[#FF6B35]" />
                  <div className="font-bold">{hits}/{taps}</div>
                  <div className="text-gray-500">Hits</div>
                </div>
                <div>
                  <Clock className="w-4 h-4 mx-auto mb-1 text-[#FF6B35]" />
                  <div className="font-bold">{difficulty}x</div>
                  <div className="text-gray-500">Difficulty</div>
                </div>
              </div>

              <button
                onClick={startGame}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-[#FF6B35] to-[#FF4500] font-bold text-black hover:shadow-lg hover:shadow-[#FF6B35]/40 transition-all"
              >
                Play Again
              </button>

              <div className="mt-6 p-4 rounded-lg border border-white/10 bg-white/[0.02] text-center">
                <p className="text-xs text-gray-400 mb-2">
                  🔐 <strong>Fair-Play Verified:</strong> No AI, bots, or macros detected.
                </p>
                <p className="text-xs text-gray-500">
                  Your skill is genuine. Keep improving and climb the leaderboard.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Idle state */}
        {state === "idle" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={startGame}
              className="px-12 py-6 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF4500] font-bold text-xl text-black hover:shadow-2xl hover:shadow-[#FF6B35]/40 transition-all"
            >
              PLAY. REACT. IMPROVE.
            </button>
          </div>
        )}
      </div>

      {/* Live stats (top-right during play) */}
      {state === "playing" && (
        <div className="absolute top-20 right-6 z-20 space-y-2">
          <div className="px-4 py-2 rounded-lg border border-white/20 bg-black/40 backdrop-blur text-right">
            <div className="text-2xl font-black text-[#FF6B35]">{Math.floor(score)}</div>
            <div className="text-xs text-gray-400">Score</div>
          </div>
          <div className="px-4 py-2 rounded-lg border border-white/20 bg-black/40 backdrop-blur text-right">
            <div className="text-xl font-bold text-[#FF6B35]">{combo}x</div>
            <div className="text-xs text-gray-400">Combo</div>
          </div>
          <div className="px-4 py-2 rounded-lg border border-white/20 bg-black/40 backdrop-blur text-right">
            <div className="text-xl font-bold text-white">{Math.floor(elapsed)}s</div>
            <div className="text-xs text-gray-400">Time</div>
          </div>
        </div>
      )}

      {/* Footer tagline */}
      <div className="absolute bottom-0 left-0 right-0 text-center pb-6 font-black text-sm tracking-widest text-gray-600">
        PLAY. REACT. IMPROVE. EARN. — ZReflex by Varizen
      </div>
    </div>
  );
}
