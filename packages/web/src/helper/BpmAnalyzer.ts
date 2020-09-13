// tslint:disable:no-increment-decrement

import { isNull } from "util";

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
 * @returns {AnalyzeResult}
 */
export function analyzeBpm(audio: AudioBuffer): AnalyzeResult {
  const {
    length: samplingCount,
    sampleRate: samplingRate,
    numberOfChannels
  } = audio;

  const frameCount = floor(samplingCount / SAMPLES_PER_FRAME);

  const channelDataList: Float32Array[] = [];
  for (let i = 0; i < numberOfChannels; i++) {
    channelDataList.push(audio.getChannelData(i));
  }

  const volumeDiffs: number[] = [];
  let prevEffectiveValue: number | null = null;

  for (let i = 0; i < frameCount; i++) {
    const startIndex = i * SAMPLES_PER_FRAME;
    const endIndex = startIndex + SAMPLES_PER_FRAME;

    let monoEffectiveValue: number = 0;

    for (let j = startIndex; j < endIndex; j++) {
      let synthesizedMonoData = 0;

      for (let k = 0; k < numberOfChannels; k++) {
        synthesizedMonoData += channelDataList[k][j];
      }

      monoEffectiveValue += synthesizedMonoData * synthesizedMonoData;
    }

    if (!isNull(prevEffectiveValue)) {
      const diff = monoEffectiveValue - prevEffectiveValue;
      volumeDiffs.push(diff > 0 ? diff : 0);
    }

    prevEffectiveValue = monoEffectiveValue;
  }

  const a: number[] = [];
  const b: number[] = [];
  const r: number[] = [];
  let maxAmp = 0;
  let maxAmpBpm = 0;
  const framesPerSec = samplingRate / SAMPLES_PER_FRAME;

  for (let bpm = MIN_BPM; bpm <= MAX_BPM; bpm++) {
    let aSum = 0;
    let bSum = 0;
    const beatsPerSec = bpm / 60;
    const beatsPerFrame = beatsPerSec / framesPerSec;

    volumeDiffs.forEach((diff, j) => {
      const win = hannWindow(j / frameCount);

      aSum += diff * cos(2 * PI * beatsPerFrame * j) * win;
      bSum += diff * sin(2 * PI * beatsPerFrame * j) * win;
    });

    const aBpm = aSum / frameCount;
    const bBpm = bSum / frameCount;

    a[bpm] = aBpm;
    b[bpm] = bBpm;
    r[bpm] = sqrt(aBpm * aBpm + bBpm * bBpm);

    if (maxAmp < r[bpm]) {
      maxAmp = r[bpm];
      maxAmpBpm = bpm;
    }
  }

  const theta = atan2(b[maxAmpBpm], a[maxAmpBpm]);
  const startPosition = theta / ((2 * PI * maxAmpBpm) / 60);

  return {
    startPosition,
    bpm: maxAmpBpm
  };
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
