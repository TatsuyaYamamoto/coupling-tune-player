import * as React from "react";
import styled from "styled-components";

import Dialog, {
  DialogContent,
} from "material-ui/Dialog";
import {CircularProgress} from "material-ui/Progress";

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
  const {
    open,
  } = props;

  return (
    <Dialog
      open={open}
    >
      <Content>
        <Progress/>
        読み込み中...
      </Content>
    </Dialog>
  );
};

export default LoadingDialog;
