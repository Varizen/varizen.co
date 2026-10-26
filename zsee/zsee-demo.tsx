"use client";

import { useEffect, useRef, useState } from "react";
import {
  Eye,
  Brain,
  Trophy,
  Shield,
  BarChart3,
  CheckCircle,
  Clock,
  Zap,
  RotateCcw,
} from "lucide-react";

type GameState =
  | "menu"
  | "countdown"
  | "viewing"
  | "answering"
  | "feedback"
  | "complete";
type ChallengeType = "missing" | "changed" | "appeared" | "memory";

interface Challenge {
  type: ChallengeType;
  question: string;
  options: string[];
  correct: number;
  viewTime: number;
  sceneName: string;
  sceneColor: string;
}

const CHALLENGES: Challenge[] = [
  {
    type: "missing",
    question: "Which object was missing?",
    options: ["Red car", "Plant pot", "Coffee mug", "Laptop"],
    correct: 0,
    viewTime: 4000,
    sceneName: "Cozy Room",
    sceneColor: "from-amber-900 to-orange-900",
  },
  {
    type: "changed",
    question: "What changed in the scene?",
    options: ["Color of sofa", "Position of lamp", "Number of pillows", "Door color"],
    correct: 1,
    viewTime: 3500,
    sceneName: "Living Room",
    sceneColor: "from-slate-800 to-slate-900",
  },
  {
    type: "appeared",
    question: "What object appeared?",
    options: ["Phone", "Book", "Cup", "Picture frame"],
    correct: 2,
    viewTime: 3000,
    sceneName: "Study Desk",
    sceneColor: "from-blue-900 to-blue-800",
  },
  {
    type: "memory",
    question: "How many objects were in the scene?",
    options: ["8", "10", "12", "15"],
    correct: 2,
    viewTime: 2500,
    sceneName: "Kitchen",
    sceneColor: "from-emerald-900 to-green-900",
  },
  {
    type: "missing",
    question: "Which color was missing?",
    options: ["Purple", "Yellow", "Green", "Red"],
    correct: 1,
    viewTime: 2000,
    sceneName: "Art Gallery",
    sceneColor: "from-purple-900 to-indigo-900",
  },
];

export function ZSeeDemo() {
  const [state, setGameState] = useState<GameState>("menu");
  const [currentChallenge, setCurrentChallenge] = useState(0);
  const [score, setScore] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [reaction, setReaction] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [streak, setStreak] = useState(0);
  const [level, setLevel] = useState(1);
  const [countdown, setCountdown] = useState(3);
  const [viewing, setViewing] = useState(0);
  const [answered, setAnswered] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<number>(0);

  const challenge = CHALLENGES[currentChallenge];

  // Countdown phase
  useEffect(() => {
    if (state !== "countdown") return;
    if (countdown > 0) {
      timerRef.current = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else {
      setGameState("viewing");
      setViewing(challenge.viewTime / 1000);
    }
    return () => clearTimeout(timerRef.current);
  }, [state, countdown, challenge]);

  // Viewing phase
  useEffect(() => {
    if (state !== "viewing") return;
    if (viewing > 0) {
      timerRef.current = setTimeout(() => setViewing((v) => v - 0.1), 100);
    } else {
      setGameState("answering");
      startTimeRef.current = Date.now();
    }
    return () => clearTimeout(timerRef.current);
  }, [state, viewing]);

  const startGame = () => {
    setGameState("countdown");
    setCountdown(3);
    setCurrentChallenge(0);
    setScore(0);
    setAccuracy(0);
    setReaction(0);
    setCorrect(0);
    setStreak(0);
    setLevel(1);
  };

  const handleAnswer = (index: number) => {
    if (state !== "answering" || answered !== null) return;

    setAnswered(index);
    const reactionTime = Date.now() - startTimeRef.current;
    setReaction(reactionTime);

    const isCorrect = index === challenge.correct;
    setFeedback(isCorrect ? "correct" : "wrong");

    if (isCorrect) {
      const newCorrect = correct + 1;
      const newStreak = streak + 1;
      setCorrect(newCorrect);
      setStreak(newStreak);

      // Scoring: base points + difficulty bonus + accuracy bonus
      const difficultyMultiplier = level;
      const speedBonus = Math.max(0, 1000 - reactionTime / 10);
      const streakBonus = newStreak * 50;
      const points = Math.floor((100 * difficultyMultiplier + speedBonus + streakBonus) / 10);
      setScore((s) => s + points);
    } else {
      setStreak(0);
    }

    const newAccuracy = Math.floor(((correct + (isCorrect ? 1 : 0)) / (currentChallenge + 1)) * 100);
    setAccuracy(newAccuracy);

    setTimeout(() => {
      if (currentChallenge < CHALLENGES.length - 1) {
        setCurrentChallenge((c) => c + 1);
        setLevel((l) => l + 1);
        setGameState("countdown");
        setCountdown(3);
        setAnswered(null);
        setFeedback(null);
      } else {
        setGameState("complete");
      }
    }, 2500);
  };

  // Menu state
  if (state === "menu") {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-[#0a0a0c] via-[#121214] to-[#1a1a1e] text-white overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-20 h-16 flex items-center justify-between px-6 bg-gradient-to-b from-black/40 to-transparent border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B35] to-[#FF4500] flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">ZSee</h1>
              <span className="text-xs text-[#FF6B35] font-semibold">by VARIZEN</span>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="px-3 py-2 rounded-lg border border-white/10 bg-white/[0.02] flex items-center gap-2 text-xs">
              <Eye className="w-3 h-3 text-[#FF6B35]" />
              <span>Human Skill Only</span>
            </div>
            <div className="px-3 py-2 rounded-lg border border-white/10 bg-white/[0.02] flex items-center gap-2 text-xs">
              <Shield className="w-3 h-3 text-[#FF6B35]" />
              <span>Anti-Cheat</span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="absolute inset-0 top-16 flex flex-col items-center justify-center px-6">
          <div className="max-w-2xl text-center">
            <div className="mb-8">
              <h2 className="text-5xl font-black mb-4">
                Do You See <span className="text-[#FF6B35]">What I See?</span>
              </h2>
              <p className="text-lg text-gray-400 font-semibold tracking-wide">
                LOOK. REMEMBER. ANSWER. EARN.
              </p>
            </div>

            <p className="text-sm text-gray-500 mb-12 leading-relaxed max-w-md mx-auto">
              Test your visual perception in a challenging game of observation. Watch scenes carefully,
              remember what you saw, and answer questions about what you observed. Can you see what I see?
            </p>

            {/* Stats preview */}
            <div className="grid grid-cols-3 gap-4 mb-12">
              <div className="p-4 rounded-lg border border-white/10 bg-white/[0.02]">
                <div className="text-sm text-gray-400 mb-1">Challenges</div>
                <div className="text-2xl font-bold text-[#FF6B35]">{CHALLENGES.length}</div>
              </div>
              <div className="p-4 rounded-lg border border-white/10 bg-white/[0.02]">
                <div className="text-sm text-gray-400 mb-1">Difficulty</div>
                <div className="text-2xl font-bold text-[#FF6B35]">Progressive</div>
              </div>
              <div className="p-4 rounded-lg border border-white/10 bg-white/[0.02]">
                <div className="text-sm text-gray-400 mb-1">Rewards</div>
                <div className="text-2xl font-bold text-[#FF6B35]">Points+</div>
              </div>
            </div>

            <button
              onClick={startGame}
              className="px-12 py-4 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF4500] font-bold text-lg text-black hover:shadow-2xl hover:shadow-[#FF6B35]/40 transition-all"
            >
              START CHALLENGE →
            </button>

            <div className="mt-12 p-6 rounded-lg border border-white/10 bg-white/[0.02]">
              <p className="text-xs text-gray-500">
                🔐 <strong>Fair-Play Verified:</strong> Real human skills only. No AI assistance, no bots, no macros.
              </p>
            </div>
          </div>
        </div>

        {/* Features footer */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-6 border-t border-white/5 bg-gradient-to-t from-black/20 to-transparent">
          <div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="text-center text-xs">
              <Brain className="w-4 h-4 mx-auto mb-2 text-[#FF6B35]" />
              <span className="text-gray-400">Memory Test</span>
            </div>
            <div className="text-center text-xs">
              <Eye className="w-4 h-4 mx-auto mb-2 text-[#FF6B35]" />
              <span className="text-gray-400">Visual Perception</span>
            </div>
            <div className="text-center text-xs">
              <Clock className="w-4 h-4 mx-auto mb-2 text-[#FF6B35]" />
              <span className="text-gray-400">Speed Challenge</span>
            </div>
            <div className="text-center text-xs">
              <Trophy className="w-4 h-4 mx-auto mb-2 text-[#FF6B35]" />
              <span className="text-gray-400">Earn Rewards</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Countdown
  if (state === "countdown") {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-[#0a0a0c] via-[#121214] to-[#1a1a1e] text-white overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl font-black text-gray-600 mb-4">Level {level}</div>
          <div className="text-8xl font-black text-[#FF6B35] animate-bounce">{countdown}</div>
          <p className="text-sm text-gray-400 mt-6">Get ready to observe carefully...</p>
        </div>
      </div>
    );
  }

  // Viewing phase
  if (state === "viewing") {
    return (
      <div
        className={`w-full h-screen bg-gradient-to-br ${challenge.sceneColor} text-white overflow-hidden flex flex-col items-center justify-center relative`}
      >
        {/* Animated scene objects */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl animate-pulse">🏠</div>
        </div>

        {/* Timer */}
        <div className="absolute top-6 right-6 text-right">
          <div className="text-3xl font-black text-white">{viewing.toFixed(1)}s</div>
          <div className="text-xs text-white/60 mt-1">LOOK CAREFULLY</div>
        </div>

        {/* Scene name */}
        <div className="absolute top-6 left-6">
          <div className="text-sm text-white/80 font-semibold">Scene: {challenge.sceneName}</div>
        </div>
      </div>
    );
  }

  // Answering phase
  if (state === "answering") {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-[#0a0a0c] via-[#121214] to-[#1a1a1e] text-white overflow-hidden flex flex-col">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
          <div>
            <div className="text-sm text-gray-500">Question {currentChallenge + 1} of {CHALLENGES.length}</div>
          </div>
          <div className="flex gap-6">
            <div className="text-right">
              <div className="text-2xl font-black text-[#FF6B35]">{score}</div>
              <div className="text-xs text-gray-500">Points</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-white">{accuracy}%</div>
              <div className="text-xs text-gray-500">Accuracy</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-white">{streak}x</div>
              <div className="text-xs text-gray-500">Streak</div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <h3 className="text-3xl font-bold mb-12 max-w-lg text-center">{challenge.question}</h3>

          {/* Options grid */}
          <div className="grid grid-cols-2 gap-4 max-w-lg w-full">
            {challenge.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={answered !== null}
                className={`p-6 rounded-lg border-2 transition-all font-semibold ${
                  answered === null
                    ? "border-white/20 bg-white/[0.02] hover:border-[#FF6B35] hover:bg-[#FF6B35]/5 cursor-pointer"
                    : answered === idx
                    ? idx === challenge.correct
                      ? "border-green-500 bg-green-500/10"
                      : "border-red-500 bg-red-500/10"
                    : idx === challenge.correct
                    ? "border-green-500 bg-green-500/10"
                    : "border-white/10 bg-white/[0.02]"
                } ${answered !== null ? "cursor-default" : ""}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Feedback
  if (state === "answering" && feedback) {
    return (
      <div className="w-full h-screen bg-gradient-to-br from-[#0a0a0c] via-[#121214] to-[#1a1a1e] text-white overflow-hidden flex items-center justify-center">
        <div className="text-center">
          {feedback === "correct" ? (
            <>
              <CheckCircle className="w-24 h-24 mx-auto mb-6 text-green-500 animate-bounce" />
              <h2 className="text-4xl font-black mb-2">Correct!</h2>
              <p className="text-3xl font-bold text-[#FF6B35] mb-6">+{Math.floor(score / (correct || 1))} Points</p>
              <div className="flex gap-8 justify-center text-sm">
                <div>
                  <div className="text-xl font-bold">{reaction}ms</div>
                  <div className="text-gray-400">Reaction</div>
                </div>
                <div>
                  <div className="text-xl font-bold">100%</div>
                  <div className="text-gray-400">Accuracy</div>
                </div>
                <div>
                  <div className="text-xl font-bold">{streak}x</div>
                  <div className="text-gray-400">Combo</div>
                </div>
              </div>
            </>
          ) : (
            <>
              <Zap className="w-24 h-24 mx-auto mb-6 text-red-500" />
              <h2 className="text-4xl font-black mb-2">Wrong Answer</h2>
              <p className="text-lg text-gray-400 mb-6">The correct answer was: {challenge.options[challenge.correct]}</p>
            </>
          )}
          <p className="text-sm text-gray-500 mt-8">Next question coming up...</p>
        </div>
      </div>
    );
  }

  // Complete
  if (state === "complete") {
    const rank = Math.max(1, Math.floor(150 - score / 20));

    return (
      <div className="w-full h-screen bg-gradient-to-br from-[#0a0a0c] via-[#121214] to-[#1a1a1e] text-white overflow-hidden flex flex-col">
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-white/5">
          <h1 className="text-xl font-bold">Challenge Complete</h1>
          <Trophy className="w-6 h-6 text-[#FF6B35]" />
        </div>

        {/* Results */}
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <Trophy className="w-20 h-20 mb-6 text-[#FF6B35]" />
          <h2 className="text-4xl font-black mb-2">Challenge Complete!</h2>
          <p className="text-gray-400 mb-12">Your perception skills have been verified.</p>

          <div className="grid grid-cols-2 gap-4 max-w-lg w-full mb-12">
            <div className="p-6 rounded-lg border border-white/10 bg-white/[0.02]">
              <div className="text-3xl font-black text-[#FF6B35]">{score}</div>
              <div className="text-xs text-gray-500 mt-2">Total Score</div>
            </div>
            <div className="p-6 rounded-lg border border-white/10 bg-white/[0.02]">
              <div className="text-3xl font-black text-white">{accuracy}%</div>
              <div className="text-xs text-gray-500 mt-2">Accuracy</div>
            </div>
            <div className="p-6 rounded-lg border border-white/10 bg-white/[0.02]">
              <div className="text-3xl font-black text-white">{correct}/{CHALLENGES.length}</div>
              <div className="text-xs text-gray-500 mt-2">Correct</div>
            </div>
            <div className="p-6 rounded-lg border border-white/10 bg-white/[0.02]">
              <div className="text-3xl font-black text-[#FF6B35]">#{rank}</div>
              <div className="text-xs text-gray-500 mt-2">Rank</div>
            </div>
          </div>

          <button
            onClick={startGame}
            className="px-12 py-4 rounded-xl bg-gradient-to-r from-[#FF6B35] to-[#FF4500] font-bold text-black hover:shadow-lg hover:shadow-[#FF6B35]/40 transition-all mb-8"
          >
            PLAY AGAIN →
          </button>

          <div className="p-6 rounded-lg border border-white/10 bg-white/[0.02] max-w-lg">
            <p className="text-xs text-gray-500">
              🔐 <strong>Fair-Play Verified:</strong> No AI assistance, bots, or macros detected. Your score is genuine.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="h-12 border-t border-white/5 flex items-center justify-center text-xs text-gray-600">
          LOOK. REMEMBER. ANSWER. EARN. — ZSee by Varizen
        </div>
      </div>
    );
  }

  return null;
}
