import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Volume2, VolumeX, HandMetal, Sparkles } from 'lucide-react';
import { VoiceAction, parseVoiceCommand, detectClapSpike } from '../utils/recipeLogic';
import { kitchenAudio } from '../utils/kitchenAudio';

interface SoundControlBarProps {
  onVoiceAction: (action: VoiceAction, sourceLabel: string) => void;
  autoSpeak: boolean;
  onToggleAutoSpeak: () => void;
  audioMuted: boolean;
  onToggleMute: () => void;
}

export const SoundControlBar: React.FC<SoundControlBarProps> = ({
  onVoiceAction,
  autoSpeak,
  onToggleAutoSpeak,
  audioMuted,
  onToggleMute,
}) => {
  const [listening, setListening] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [lastTriggerNote, setLastTriggerNote] = useState<string>('Ready for Clap or Voice ("Next", "Timer", "Lid")');
  const [micPermissionNote, setMicPermissionNote] = useState<string | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastClapRef = useRef<number>(0);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);
  const onVoiceActionRef = useRef(onVoiceAction);

  useEffect(() => {
    onVoiceActionRef.current = onVoiceAction;
  }, [onVoiceAction]);

  const stopSoundListening = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    }
    setMicLevel(0);
    setListening(false);
  }, []);

  const startSoundListening = async () => {
    setMicPermissionNote(null);
    try {
      // 1. Start Web Speech API if supported
      const SpeechRec =
        (window as unknown as { SpeechRecognition?: new () => unknown; webkitSpeechRecognition?: new () => unknown })
          .SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: new () => unknown }).webkitSpeechRecognition;

      if (SpeechRec) {
        const rec = new SpeechRec() as {
          continuous: boolean;
          interimResults: boolean;
          lang: string;
          onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
          onerror: (() => void) | null;
          start: () => void;
          stop: () => void;
        };
        rec.continuous = true;
        rec.interimResults = false;
        rec.lang = 'en-IN';
        rec.onresult = (event) => {
          const lastIdx = event.results.length - 1;
          const phrase = event.results[lastIdx]?.[0]?.transcript || '';
          const parsed = parseVoiceCommand(phrase);
          if (parsed) {
            kitchenAudio.playStepConfirmTone();
            setLastTriggerNote(`Voice heard: "${phrase.trim()}"`);
            onVoiceActionRef.current(parsed, `Voice: "${phrase.trim()}"`);
          }
        };
        rec.onerror = () => {};
        try {
          rec.start();
          recognitionRef.current = rec;
        } catch {
          // SpeechRecognition may already be started or unsupported in sandbox
        }
      }

      // 2. Start Web Audio API Clap / Loud Tap Detector
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;
        const source = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);

        const data = new Uint8Array(analyser.frequencyBinCount);
        const checkAudio = () => {
          analyser.getByteTimeDomainData(data);
          let sumSq = 0;
          let peak = 0;
          for (let i = 0; i < data.length; i++) {
            const norm = (data[i] - 128) / 128;
            const abs = Math.abs(norm);
            sumSq += norm * norm;
            if (abs > peak) peak = abs;
          }
          const rms = Math.sqrt(sumSq / data.length);
          setMicLevel(Math.min(100, Math.round(peak * 180)));

          const now = Date.now();
          if (detectClapSpike(rms, peak, lastClapRef.current, now, 0.32)) {
            lastClapRef.current = now;
            kitchenAudio.playStepConfirmTone();
            setLastTriggerNote('Clap detected! Advancing / toggling step');
            onVoiceActionRef.current('NEXT_STEP', 'Hands-Free Clap Trigger');
          }
          rafRef.current = requestAnimationFrame(checkAudio);
        };
        rafRef.current = requestAnimationFrame(checkAudio);
      }

      setListening(true);
      setLastTriggerNote('Listening for Clap or Voice ("Next", "Back", "Timer", "Lid")');
    } catch {
      // Even if hardware mic is unavailable in headless/sandboxed environments, enable simulated sound-control mode
      setListening(true);
      setMicPermissionNote('Simulated Kitchen Sound Mode active (use Clap/Voice trigger buttons below)');
      setLastTriggerNote('Hands-free sound mode ready');
    }
  };

  useEffect(() => {
    return () => {
      stopSoundListening();
    };
  }, [stopSoundListening]);

  const handleToggleListening = () => {
    if (listening) {
      stopSoundListening();
      setLastTriggerNote('Hands-free sound listener paused');
    } else {
      startSoundListening();
    }
  };

  const handleSimulateSoundCommand = (action: VoiceAction, label: string) => {
    kitchenAudio.playStepConfirmTone();
    setLastTriggerNote(`Triggered: ${label}`);
    onVoiceAction(action, label);
  };

  return (
    <div
      data-testid="sound-control-bar"
      className="rounded-2xl border border-[#1C1613]/12 bg-white p-3.5 shadow-xs"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleListening}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
              listening
                ? 'bg-[#C84B11] text-white'
                : 'bg-[#1C1613] text-[#FAF7F2] hover:bg-[#2E2520]'
            }`}
          >
            {listening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            <span>{listening ? 'Sound Control: Active' : 'Enable Sound / Clap Control'}</span>
          </button>

          <div className="hidden sm:flex flex-col">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#1C1613]">
              <span>Hands-Free Kitchen Controls</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-tabular text-[#655A52]">
                {listening ? `Mic ${micLevel}%` : 'Standby'}
              </span>
            </div>
            <p className="text-xs text-[#655A52] truncate max-w-xs lg:max-w-md">
              {micPermissionNote || lastTriggerNote}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleSimulateSoundCommand('NEXT_STEP', 'Clap -> Next Step')}
            title="Simulate a loud kitchen clap to advance or trigger timer"
            className="min-h-[44px] px-3 py-2 rounded-xl border border-[#1C1613]/15 bg-[#FAF7F2] hover:bg-[#F3EDE2] text-xs font-semibold text-[#1C1613] flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            <HandMetal className="w-4 h-4 text-[#C84B11]" />
            <span>Clap: Next</span>
          </button>

          <button
            type="button"
            onClick={() => handleSimulateSoundCommand('START_PAUSE_TIMER', 'Voice: Toggle Timer')}
            className="min-h-[44px] px-3 py-2 rounded-xl border border-[#1C1613]/15 bg-[#FAF7F2] hover:bg-[#F3EDE2] text-xs font-semibold text-[#1C1613] flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E88D14]" />
            <span>Say &ldquo;Timer&rdquo;</span>
          </button>

          <button
            type="button"
            onClick={onToggleAutoSpeak}
            aria-pressed={autoSpeak}
            className={`min-h-[44px] px-3 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              autoSpeak
                ? 'border-[#2A6F48] bg-[#2A6F48]/10 text-[#2A6F48]'
                : 'border-[#1C1613]/15 bg-white text-[#655A52] hover:text-[#1C1613]'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{autoSpeak ? 'Voice Guide: On' : 'Voice Guide: Off'}</span>
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            aria-label={audioMuted ? 'Unmute kitchen chimes' : 'Mute kitchen chimes'}
            className="min-h-[44px] min-w-[44px] px-2.5 py-2 rounded-xl border border-[#1C1613]/15 bg-white hover:bg-[#FAF7F2] text-xs font-medium text-[#655A52] flex items-center justify-center transition-colors shrink-0"
          >
            {audioMuted ? <VolumeX className="w-4 h-4 text-[#C84B11]" /> : <Volume2 className="w-4 h-4 text-[#1C1613]" />}
          </button>
        </div>
      </div>
    </div>
  );
};
