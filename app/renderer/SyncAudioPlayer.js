const {Howl} = require("howler");

class SyncAudioPlayer {
    constructor({leftAudioSrc, rightAudioSrc}) {

        this._leftAudioSrc = leftAudioSrc;
        this._rightAudioSrc = rightAudioSrc;

        this._leftHowl = new Howl({
            src: this._leftAudioSrc,

        });
        this._leftHowl.on("play", this._onLeftPlayed);

        this._rightHowl = new Howl({
            src: this._rightAudioSrc
        });
        this._rightHowl.on("play", this._onRightPlayed);

        this.play.bind(this);
        this._onLeftPlayed(this);
        this._onRightPlayed(this);
    }

    play() {
        this._leftHowl.play();
    }

    _onLeftPlayed() {
        this._rightHowl.play();
        this._rightHowl.seek(this._leftHowl.seek());
    }

    _onRightPlayed() {

    }

}

module.exports = SyncAudioPlayer;
