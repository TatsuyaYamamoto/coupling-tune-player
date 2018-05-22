const { sin, cos, atan2, floor, sqrt, PI } = Math;

const SAMPLES_PER_FRAME = 512;
const MIN_BPM = 60;
const MAX_BPM = 240;

export interface AnalyzeResult {
  bpm: number;
  startPosition: number;
}

/**
 * 入力された{@code AudioBuffer}のBPMを解析し、最初の拍の位置を含む計算結果{@code AnalyzeResult}を返却する。
 * 計算結果の位相の都合上、startPositionは負の値を取ることもあるので、注意
 *
 * @param {AudioBuffer} audio
 * @returns {Promise<AnalyzeResult>}
 */
export async function analyzeBpm(audio: AudioBuffer): Promise<AnalyzeResult> {
  const {
    duration,
    length,
    numberOfChannels,
    sampleRate: samplingRate
  } = audio;

  const channels = [];
  for (let i = 0; i < numberOfChannels; i++) {
    channels[i] = audio.getChannelData(i);
  }

  const results: AnalyzeResult[] = channels.map((channel: Float32Array) => {
    const N = floor(channel.length / SAMPLES_PER_FRAME);

    const effectiveVolumes = new Array(N).fill(0).map((v, i) => {
      const startIndex = i * SAMPLES_PER_FRAME;

      return effectiveValueOf(
        channel.slice(startIndex, startIndex + SAMPLES_PER_FRAME)
      );
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
        const win = hannWindow(j / N);

        aSum += diff * cos(2 * PI * beatsPerFrame * j) * win;
        bSum += diff * sin(2 * PI * beatsPerFrame * j) * win;
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
    const theta = atan2(b[bpm - MIN_BPM], a[bpm - MIN_BPM]);
    const startPosition = theta / (2 * PI * bpm / 60);

    return {
      bpm,
      startPosition
    };
  });

  return {
    bpm: results[0].bpm,
    startPosition: results[0].startPosition
  };
}

function effectiveValueOf(numbers: Float32Array) {
  return numbers.reduce((previous, current) => {
    return previous + current * current;
  }, 0);
}

/**
 * Calculate hann window.
 *
 * @param {number} x
 * @returns {number}
 * @see https://ja.wikipedia.org/wiki/%E7%AA%93%E9%96%A2%E6%95%B0
 */
function hannWindow(x: number) {
  return 0.5 * (1 - cos(2.0 * PI * x));
}
