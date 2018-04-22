import * as React from "react";
import styled from "styled-components";

import Button from "material-ui/Button";
import Dialog, {
  DialogActions,
  DialogContent,
} from "material-ui/Dialog";

const {version} = require("../../../../../package.json");

export interface Props {
  open: boolean;
  handleClose: () => void;
}

const AppTitle = styled.div`
  text-align: center;
  font-size: 25px;
`;

const Version = styled.div`
  text-align: center;
  font-size: 15px;
`;

const AppDescription = styled.div`
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const Label = styled.div`
  margin-top: 10px;
`;

const Content = styled.div`
  margin-top: 5px;
`;

const OkButton = ({onClick}: any) => (
  <Button onClick={onClick} color="primary">
    OK
  </Button>
);

const SoloLiveWithLink = (
  <a href="http://www.lovelive-anime.jp/otonokizaka/release.html#cd82">ソロライブ</a>
);

const KotohonoWithLink = (
  <a href="http://dic.nicovideo.jp/a/%E3%81%93%E3%81%A8%E3%81%BB%E3%81%AE">ことほの</a>
);

const T28WithLink = (
  <a href="https://twitter.com/t28_tatsuya">T28_tatsuya</a>
);

const DeveloperWithLink = (
  <a href="https://www.sokontokoro-factory.net">Tatsuya Yamamoto</a>
);

const LicenseWithLink = (
  <a href="https://github.com/sokontokoro-factory/coupling-tune-player/blob/master/LICENSE">
    MIT
  </a>
);

const OssWithLink = (
  <a href="https://github.com/sokontokoro-factory/coupling-tune-player/blob/master/package.json">
    Notices for files
  </a>
);

const InfoDialog = (props: Props) => {
  const {
    open,
    handleClose,
  } = props;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogContent>
        <AppTitle>Coupling Tune Player</AppTitle>
        <Version>v {version}</Version>

        <AppDescription>
          このアプリは2つの音声ファイルのBPMを解析して同時に再生するだけの、音楽プレイヤーです。
          音声ファイルをサーバーに送信、保存はしておらず、ブラウザのみで動作しています。
          PCでの使用を前提としていますが、ファイル選択ができればスマートフォンでも動く、、、はず。<br/>
          <br/>
          作成者が{SoloLiveWithLink}で{KotohonoWithLink}するために作成したものですが、組み合わせはあなた次第！<br/>
          <br/>
          ご意見・ご要望・ご感想は{T28WithLink}まで！
        </AppDescription>

        <div>
          <Label>Developer</Label>
          <Content>{DeveloperWithLink}</Content>
        </div>

        <div>
          <Label>License</Label>
          <Content>{LicenseWithLink}</Content>
        </div>

        <div>
          <Label>Open source license</Label>
          <Content>{OssWithLink}</Content>
        </div>

      </DialogContent>
      <DialogActions>
        <OkButton onClick={handleClose}/>
      </DialogActions>
    </Dialog>
  );
};

export default InfoDialog;
