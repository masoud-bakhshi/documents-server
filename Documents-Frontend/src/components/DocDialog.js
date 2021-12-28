import React, { useEffect, useState } from "react";
import {
  makeStyles,
  Grid,
  CssBaseline,
  Paper,
  Button,
  DialogActions,
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  DialogContent,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import TextEditor from "./TextEditor";
import "./docstyle.css";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "fixed",
    // opacity: "0.30",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  root: {
    height: "100vh",
    marginTop: theme.spacing(3),
  },
  image: {
    backgroundImage: "url(/assets/img/doc-add.svg)",
    backgroundRepeat: "no-repeat",
    backgroundColor: "#fff",

    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  halfLeft: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#fafafa",
    padding: theme.spacing(2),
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  butt: {
    marginRight: "20px",
    marginLeft: "20px",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default function DocDialog({
  open,
  setOpen,
  documentId,
  payload,
  setResetP,
}) {
  const classes = useStyles();
  const [saveWord, setsSaveWord] = useState(false);
  const [savePdf, setSavePdf] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleIncludeDocs = async (payload, setResetP, setOpen) => {
    // console.log(payload);
    try {
      Axios.defaults.withCredentials = true;

      await Axios.post(
        "http://" + "localhost" + ":" + "7501" + "/insertdocument",
        payload
      )
        .then((response) => {})
        .catch((error) => {});
      setResetP(true);
      setOpen(false);
    } catch (error) {}
  };
  //************************************************************************************************************************************* */
  const handleIncludeDoc = () => {
    handleIncludeDocs(payload, setResetP, setOpen);
  };

  useEffect(() => {
    handleIncludeDoc();
  }, []);
  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        {/* <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              ویرایش سند
            </Typography>
          </Toolbar>
        </AppBar> */}
        <DialogContent style={{ padding: "0" }}>
          <Grid container component="main" className={classes.root}>
            <CssBaseline />
            {open && (
              <TextEditor
                documentId={documentId}
                saveWord={saveWord}
                setsSaveWord={setsSaveWord}
              ></TextEditor>
            )}
          </Grid>
        </DialogContent>
        <DialogActions style={{ direction: "ltr", background: "#dadada" }}>
          <Button autoFocus onClick={handleClose} color="primary">
            Close
          </Button>
          <Button
            onClick={() => {
              setsSaveWord(true);
            }}
            color="primary"
            autoFocus
          >
            Save in Word{" "}
          </Button>
          {/* <Button
            onClick={() => {
              setSavePdf(true);
            }}
            color="primary"
            autoFocus
          >
            ذخیره در پی دی اف
          </Button> */}
          <Button onClick={handleClose} color="primary" autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
