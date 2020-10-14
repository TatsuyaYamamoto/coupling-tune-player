import React from "react";
import styled from "@emotion/styled";

import Button from "@material-ui/core/Button";
import { Dialog, DialogActions, DialogContent } from "@material-ui/core";
import { sendEvent } from "../../utils";

const { version } = require("../../../package.json");

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

const OkButton = ({ onClick }: any) => (
  <Button onClick={onClick} color="primary">
    OK
  </Button>
);

const Link = (params: { children: string; href: string; name: string }) => {
  const onclick = () => {
    sendEvent("click", {
      category: "link",
      value: params.name,
    });
  };

  return (
    <a onClick={onclick} href={params.href} target="_blank">
      {params.children}
    </a>
  );
};

const SoloLiveWithLink = (
  <Link
    name="sololive"
    href="http://www.lovelive-anime.jp/otonokizaka/release.html#cd82"
  >
    ソロライブ
  </Link>
);

const KotohonoWithLink = (
  <Link
    name="about_kotohono"
    href="http://dic.nicovideo.jp/a/%E3%81%93%E3%81%A8%E3%81%BB%E3%81%AE"
  >
    ことほの
  </Link>
);

const T28WithLink = (
  <Link name="t28_page" href="https://twitter.com/t28_tatsuya">
    @T28_tatsuya
  </Link>
);

const DeveloperWithLink = (
  <Link name="homepage" href="https://www.sokontokoro-factory.net">
    Tatsuya Yamamoto
  </Link>
);

const LicenseWithLink = (
  <Link
    name="license"
    href="https://github.com/sokontokoro-factory/coupling-tune-player/blob/master/LICENSE"
  >
    MIT
  </Link>
);

const OssWithLink = (
  <Link
    name="oss"
    href="https://github.com/sokontokoro-factory/coupling-tune-player/blob/master/package.json"
  >
    Notices for files
  </Link>
);

const InfoDialog = (props: Props) => {
  const { open, handleClose } = props;

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogContent>
        <AppTitle>Coupling Tune Player Web</AppTitle>
        <Version>v {version}</Version>

        <AppDescription>
          このアプリは2つの音声ファイルのBPMを解析して同時に再生するだけの、音楽プレイヤーです。
          音声ファイルをサーバーに送信、保存はしておらず、ブラウザのみで動作しています。
          PCでの使用を前提としていますが、ファイル選択ができればスマートフォンでも動く、、、はず。
          <br />
          <br />
          作成者が{SoloLiveWithLink}で{KotohonoWithLink}
          するために作成したものですが、組み合わせはあなた次第！
          <br />
          <br />
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
        <OkButton onClick={handleClose} />
      </DialogActions>
    </Dialog>
  );
};

export default InfoDialog;
