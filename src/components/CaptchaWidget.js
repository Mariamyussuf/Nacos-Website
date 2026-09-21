import React, { useState, useEffect, useCallback } from 'react';
import { getCaptchaChallenge } from './api';

export default function CaptchaWidget({ onVerified, className = '' }) {
  const [challenge, setChallenge] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const fetchChallenge = useCallback(async () => {
    setLoading(true);
    setIsRefreshing(true);
    setUserAnswer('');
    setIsAnswered(false);
    if (onVerified) onVerified(null);

    try {
      const data = await getCaptchaChallenge();
      setChallenge(data);
    } catch (err) {
      console.warn('Failed to load CAPTCHA challenge:', err);
    } finally {
      setLoading(false);
      setTimeout(() => setIsRefreshing(false), 400);
    }
  }, [onVerified]);

  useEffect(() => {
    fetchChallenge();
  }, [fetchChallenge]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setUserAnswer(val);

    if (val.trim()) {
      setIsAnswered(true);
      if (onVerified && challenge) {
        onVerified({
          token: challenge.token,
          answer: val.trim(),
          challengeId: challenge.challengeId,
        });
      }
    } else {
      setIsAnswered(false);
      if (onVerified) onVerified(null);
    }
  };

  return (
    <div
      className={`p-4 rounded-xl bg-[#141413] border border-[rgba(255,255,255,0.08)] shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2 text-xs text-[#888880] font-medium">
          <i className="ti ti-shield-check text-[#2D7A22] text-sm" />
          <span>Security Verification</span>
        </div>
        <button
          type="button"
          onClick={fetchChallenge}
          disabled={loading || isRefreshing}
          title="Get a new security puzzle"
          className="flex items-center gap-1 text-[11px] text-[#555550] hover:text-[#2D7A22] transition-colors p-1 rounded-md hover:bg-white/5 disabled:opacity-50"
        >
          <i
            className={`ti ti-refresh ${isRefreshing ? 'animate-spin' : ''}`}
          />
          <span>New Puzzle</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Challenge Box */}
        <div className="flex-1 px-3.5 py-2.5 rounded-lg bg-[#0e0e0d] border border-[rgba(255,255,255,0.05)] flex items-center justify-between">
          {loading ? (
            <span className="text-xs text-[#555550] flex items-center gap-2">
              <i className="ti ti-loader-2 animate-spin text-xs" /> Generating verification…
            </span>
          ) : (
            <span className="text-sm font-semibold tracking-wide text-[#F0EDE6] select-none font-mono">
              {challenge?.question || 'Solve: 5 + 3 = ?'}
            </span>
          )}
          <span className="text-[10px] text-[#444440] uppercase tracking-wider font-mono">
            Anti-Bot
          </span>
        </div>

        {/* Answer Input */}
        <div className="relative sm:w-36">
          <input
            type="text"
            inputMode="numeric"
            value={userAnswer}
            onChange={handleInputChange}
            placeholder="Your answer"
            disabled={loading}
            className="w-full px-3 py-2.5 text-sm bg-[#1a1a18] border border-[rgba(255,255,255,0.1)] rounded-lg text-white placeholder-[#555550] focus:outline-none focus:border-[#2D7A22] text-center font-mono transition-colors"
          />
          {isAnswered && (
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#2D7A22] pointer-events-none">
              <i className="ti ti-check text-xs font-bold" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
