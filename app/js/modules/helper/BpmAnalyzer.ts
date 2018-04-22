const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
const audioContext = new AudioContext();
const {
  sin,
  cos,
  atan2,
  floor,
  sqrt,
  PI,
} = Math;

const SAMPLES_PER_FRAME = 512;
const MIN_BPM = 60;
const MAX_BPM = 240;

export interface AnalyzeResult {
  bpm: number;
  startPosition: number;
}

export async function analyzeBpm(audio: AudioBuffer): Promise<AnalyzeResult> {
  const {
    duration,
    length,
    numberOfChannels,
    sampleRate: samplingRate,
  } = audio;

  const channels = [];
  for (let i = 0; i < numberOfChannels; i++) {
    channels[i] = audio.getChannelData(i);
  }

  const results: AnalyzeResult[] = channels.map((channel: Float32Array) => {
    const N = floor(channel.length / SAMPLES_PER_FRAME);

    const effectiveVolumes = new Array(N).fill(0).map((v, i) => {
      const startIndex = i * SAMPLES_PER_FRAME;

      return effectiveValueOf(channel.slice(startIndex, startIndex + SAMPLES_PER_FRAME));
    });

    const volumeDiffs = effectiveVolumes.map((value, index) => {
      const diff = effectiveVolumes[index + 1] - effectiveVolumes[index];

      return diff > 0 ? diff : 0;
    });

    const a = [];
    const b = [];
    const r = [];
    const framesPerSec = samplingRate / SAMPLES_PER_FRAME;

    for (let i /*BPM*/ = MIN_BPM; i <= MAX_BPM; i++) {
      let aSum = 0;
      let bSum = 0;
      const beatsPerSec = i / 60;
      const beatsPerFrame = beatsPerSec / framesPerSec;

      volumeDiffs.forEach((diff, j) => {
        aSum += diff * cos(2 * PI * beatsPerFrame * j);
        bSum += diff * sin(2 * PI * beatsPerFrame * j);
      });

      const aBpm = aSum / N;
      const bBpm = bSum / N;

      a[i - MIN_BPM] = aBpm;
      b[i - MIN_BPM] = bBpm;
      r[i - MIN_BPM] = sqrt(aBpm * aBpm + bBpm * bBpm);
    }

    let bpm = 0;
    let maxAmp = 0;

    r.forEach((value, index) => {
      if (maxAmp < value) {
        maxAmp = value;
        bpm = index;
      }
    });

    bpm += MIN_BPM;

    // 位相差
    let theta = atan2(b[bpm - MIN_BPM], a[bpm - MIN_BPM]);
    // TODO: Check logic is currect?
    // see http://hp.vector.co.jp/authors/VA046927/tempo/tempo.html
    if (theta < 0) {
      console.log("Convert theta.", `${theta} -> ${-1 * theta}`, b[bpm - MIN_BPM], a[bpm - MIN_BPM]);
      theta = -1 * theta;
    } else {
      console.log("theta", theta, b[bpm - MIN_BPM], a[bpm - MIN_BPM]);
    }

    const startPosition = theta / (2 * PI * bpm / 60);

    return {
      bpm,
      startPosition,
    };
  });

  return {
    bpm: results[0].bpm,
    startPosition: results[0].startPosition,
  };
}

function effectiveValueOf(numbers: Float32Array) {
  return numbers.reduce((previous, current) => {
    return previous + (current * current);
  }, 0);
}
