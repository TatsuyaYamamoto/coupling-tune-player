import * as React from "react";
import styled from "styled-components";


import Button from "material-ui/Button";
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "material-ui/Dialog";

const {version} = require("../../../../../package.json");

export interface Props {
  open: boolean;
  handleClose: () => void;
}

const AppTitle = styled.div`

`;

const OkButton = ({onClick}: any) => (
  <Button onClick={onClick} color="primary">
    OK
  </Button>
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
        <AppTitle>Coupling Tune Player v {version}</AppTitle>
        ことほの最高！
      </DialogContent>
      <DialogActions>
        <OkButton onClick={handleClose}/>
      </DialogActions>
    </Dialog>
  );
};

export default InfoDialog;
