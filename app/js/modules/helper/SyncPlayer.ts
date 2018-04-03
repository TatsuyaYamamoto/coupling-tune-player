import Audio from "./Audio";
import {analyzeBpm} from "./BpmAnalyzer";
import {PlayerActionTypes} from "../player";

interface SyncPlayerConstructor {
  left: Audio;
  right: Audio;
}

class SyncPlayer {
  // TODO Check supporting WebAudioAPI
  private _context = new AudioContext();

  // TODO Don't recreate on start audio.
  private _leftAudioSource: AudioBufferSourceNode | null = null;
  private _rightAudioSource: AudioBufferSourceNode | null = null;

  private _leftAudio: Audio;
  private _rightAudio: Audio;

  private _playing: boolean;
  private _playStartAudioContextTimeMillis: number;
  private _audioPositionTimeMillis: number;
  private _startPositionDiffTimeMillis: number;

  public constructor(props: SyncPlayerConstructor) {
    this._leftAudio = props.left;
    this._rightAudio = props.right;
    this._leftAudioSource = this._context.createBufferSource();
    this._rightAudioSource = this._context.createBufferSource();

    this._playing = false;
    this._playStartAudioContextTimeMillis = 0;
    this._audioPositionTimeMillis = 0;
    this._startPositionDiffTimeMillis = 0;
  }

  public async load(): Promise<any> {
    const [leftAudioBuffer, rightAudioBuffer] = await Promise
      .all([
        readAsArrayBuffer(this._leftAudio.file),
        readAsArrayBuffer(this._rightAudio.file),
      ])
      .then((arrayBufferList) => Promise.all(
        arrayBufferList.map((buffer) => this._context.decodeAudioData(buffer)),
      ));

    if (!this._leftAudioSource || !this._rightAudioSource) {
      throw new Error("No audio source.");
    }

    this._leftAudioSource.buffer = leftAudioBuffer;
    this._rightAudioSource.buffer = rightAudioBuffer;

    this._leftAudioSource.connect(this._context.destination);
    this._rightAudioSource.connect(this._context.destination);

    const [{startPosition: leftStart}, {startPosition: rightStart}] = await Promise
      .all([
        analyzeBpm(leftAudioBuffer),
        analyzeBpm(rightAudioBuffer),
      ]);

    this._startPositionDiffTimeMillis = leftStart - rightStart;
  }

  public get playing(): boolean {
    return this._playing;
  }

  public play(): void {
    this._playStartAudioContextTimeMillis = this._context.currentTime;

    if (!this._leftAudioSource || !this._rightAudioSource) {
      throw new Error("No audio source.");
    }

    let leftAudioOffset = this._audioPositionTimeMillis;
    let rightAudioOffset = this._audioPositionTimeMillis;

    if (0 < this._startPositionDiffTimeMillis) {
      leftAudioOffset += this._startPositionDiffTimeMillis;

    } else {
      rightAudioOffset += +Math.abs(this._startPositionDiffTimeMillis);
    }
    this._leftAudioSource.start(0, leftAudioOffset);
    this._rightAudioSource.start(0, rightAudioOffset);

    this._playing = true;
  }

  public pause(): void {
    const now = this._context.currentTime;

    if (this._leftAudioSource !== null) {
      this._leftAudioSource.stop(0);
    }

    if (this._rightAudioSource !== null) {
      this._rightAudioSource.stop(0);
    }

    this._playing = false;
  }
}

function readAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsArrayBuffer(file);
  });
}

export default SyncPlayer;
