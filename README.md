<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">

# Couple Tune Player/かぷちゅうプレイヤー

BPM sync audio player for [かぷちゅう](http://dic.nicovideo.jp/a/%E3%82%AB%E3%83%97%E5%8E%A8).
App is hosted at [https://apps.sokontokoro-factory.net/coupling-tune-player/]().

[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![MIT License](http://img.shields.io/badge/license-MIT-blue.svg?style=flat)](LICENSE)

![TOP](README_TOP.jpg)

## How it works

This audio player analyze BPM and plays synchronously audio with [Web Track API](https://developer.mozilla.org/ja/docs/Web/API/Web_Audio_API).

## Getting start

### Get 2music files

* Important points are **_same backgroud music_** and **_difference vocalist_**.
* I highly recommend [ラブライブ！Solo Live! collection Memorial BOX](http://www.lovelive-anime.jp/otonokizaka/release.html#cd82)

### Start application

```bash
$ yarn
$ yarn start
```

### Music start!

Select file(:paperclip:) and start(:arrow_forward:)!

## Lint

* [tslint-react](https://github.com/palantir/tslint-react), [tslint-config-airbnb](https://github.com/progre/tslint-config-airbnb) and [custom rule](tslint.json).

```bash
$ yarn lint
```

## Code format

format with pure [prettier](https://github.com/prettier/prettier) policy.

```bash
$ yarn format
```

## License

[MIT](LICENSE)
