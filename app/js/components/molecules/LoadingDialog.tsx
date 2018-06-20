import * as React from "react";
import { default as styled } from "styled-components";

import { Dialog, DialogContent, CircularProgress } from "@material-ui/core";

export interface Props {
  open: boolean;
}

const Content = styled(DialogContent)`
  display: flex;
  align-items: center;
`;

const Progress = styled(CircularProgress)`
  margin-right: 15px;
`;

const LoadingDialog = (props: Props) => {
  const { open } = props;

  return (
    <Dialog open={open}>
      <Content>
        <Progress />
        読み込み中...
      </Content>
    </Dialog>
  );
};

export default LoadingDialog;
