const SyncAudioPlayer = require("./SyncAudioPlayer");


const player = new SyncAudioPlayer({
    leftAudioSrc: '/Users/fx30328/Desktop/AQUARIUM.mp3',
    rightAudioSrc: '/Users/fx30328/Desktop/AQUARIUM.mp3',
});

player.play();
