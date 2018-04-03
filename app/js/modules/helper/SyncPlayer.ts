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

  private _leftAudioBuffer: AudioBuffer | null = null;
  private _rightAudioBuffer: AudioBuffer | null = null;

  private _playing: boolean = false;
  private _playStartAudioContextTimeMillis: number = 0;
  private _audioPositionTimeMillis: number = 0;
  private _startPositionDiffTimeMillis: number = 0;

  public constructor(props: SyncPlayerConstructor) {
    this._leftAudio = props.left;
    this._rightAudio = props.right;
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

    this._leftAudioBuffer = leftAudioBuffer;
    this._rightAudioBuffer = rightAudioBuffer;

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
    this._leftAudioSource = this._context.createBufferSource();
    this._rightAudioSource = this._context.createBufferSource();

    this._leftAudioSource.buffer = this._leftAudioBuffer;
    this._rightAudioSource.buffer = this._rightAudioBuffer;

    this._leftAudioSource.connect(this._context.destination);
    this._rightAudioSource.connect(this._context.destination);

    let leftAudioOffset = this._audioPositionTimeMillis;
    let rightAudioOffset = this._audioPositionTimeMillis;

    if (0 < this._startPositionDiffTimeMillis) {
      leftAudioOffset += this._startPositionDiffTimeMillis;

    } else {
      rightAudioOffset += +Math.abs(this._startPositionDiffTimeMillis);
    }

    this._playStartAudioContextTimeMillis = this._context.currentTime;

    this._leftAudioSource.start(0, leftAudioOffset);
    this._rightAudioSource.start(0, rightAudioOffset);

    this._playing = true;
  }

  public pause(): void {
    if (this._leftAudioSource !== null) {
      this._leftAudioSource.stop(0);
    }

    if (this._rightAudioSource !== null) {
      this._rightAudioSource.stop(0);
    }

    this._audioPositionTimeMillis += this._context.currentTime - this._playStartAudioContextTimeMillis;
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
