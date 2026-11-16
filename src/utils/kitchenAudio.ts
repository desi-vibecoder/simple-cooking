// Web Audio API synthesizer, hardware-scheduled background alarm, and browser Notification helper

class KitchenAudioEngine {
  private ctx: AudioContext | null = null;
  private muted = false;
  private scheduledAlarmNodes: AudioNode[] = [];
  private alarmLoopTimer: number | null = null;

  public getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(mute: boolean) {
    this.muted = mute;
    if (mute) {
      this.stopAlarmLoop();
      this.cancelScheduledAlarm();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }

  public isMuted(): boolean {
    return this.muted;
  }

  // Schedule hardware-accurate audio alarm in Web Audio API timeline (fires even in background tabs)
  public scheduleBackgroundAlarm(delaySeconds: number) {
    this.cancelScheduledAlarm();
    if (this.muted || delaySeconds <= 0) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const startBase = ctx.currentTime + delaySeconds;
    const cycles = 4;
    for (let c = 0; c < cycles; c++) {
      const cycleTime = startBase + c * 1.4;
      [880, 1174.66, 1318.5].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        const t = cycleTime + idx * 0.12;
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.28, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + 0.38);
        this.scheduledAlarmNodes.push(osc, gain);
      });
    }
  }

  public cancelScheduledAlarm() {
    this.scheduledAlarmNodes.forEach((node) => {
      try {
        if ('stop' in node && typeof (node as OscillatorNode).stop === 'function') {
          (node as OscillatorNode).stop();
        }
        node.disconnect();
      } catch {
        // already stopped
      }
    });
    this.scheduledAlarmNodes = [];
  }

  public playAlarmBurst() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [880, 1174.66, 1318.5, 1760].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      const t = now + idx * 0.1;
      osc.frequency.setValueAtTime(freq, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.exponentialRampToValueAtTime(0.28, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.38);
    });
  }

  public startAlarmLoop() {
    this.stopAlarmLoop();
    this.cancelScheduledAlarm();
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([350, 150, 350, 150, 500]);
      } catch {
        // ignore vibration restriction
      }
    }
    this.playAlarmBurst();
    if (typeof window !== 'undefined') {
      this.alarmLoopTimer = window.setInterval(() => {
        this.playAlarmBurst();
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate([250, 120, 250]);
          } catch {
            // ignore
          }
        }
      }, 1800);
    }
  }

  public stopAlarmLoop() {
    if (this.alarmLoopTimer !== null && typeof window !== 'undefined') {
      window.clearInterval(this.alarmLoopTimer);
      this.alarmLoopTimer = null;
    }
    this.cancelScheduledAlarm();
  }

  public playTimerCompleteBell() {
    this.playAlarmBurst();
  }

  // Distinct two-tone chime reminding the cook to CLOSE THE LID
  public playLidAlertChime() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.14);

      gain.gain.setValueAtTime(0.001, now + i * 0.14);
      gain.gain.exponentialRampToValueAtTime(0.2, now + i * 0.14 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.14 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.14);
      osc.stop(now + i * 0.14 + 0.38);
    });
  }

  // Subtle tactile confirmation beep when advancing steps
  public playStepConfirmTone() {
    if (this.muted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.09);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.13);
  }

  public speakText(text: string) {
    if (this.muted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.98;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore speech synthesis errors
    }
  }

  public async requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'unsupported';
    }
    if (Notification.permission === 'granted') return 'granted';
    if (Notification.permission === 'denied') return 'denied';
    try {
      return await Notification.requestPermission();
    } catch {
      return Notification.permission;
    }
  }

  public sendTimerNotification(title: string, body: string) {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    try {
      const notif = new Notification(title, {
        body,
        tag: 'tadka-flow-step-timer',
        requireInteraction: true,
      });
      notif.onclick = () => {
        window.focus();
        notif.close();
      };
    } catch {
      // ignore on platforms requiring ServiceWorker registration for Notification
    }
  }
}

export const kitchenAudio = new KitchenAudioEngine();
