import React, { useEffect, useState, useContext } from "react";
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
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { multiStepContext } from "./utils/StepContext";
import { v4 as uuidV4 } from "uuid";
const manageAxio = require("./utils/manageAxio");

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "fixed",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  root: {
    height: "100vh",
    marginTop: theme.spacing(5),
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

export default function AddDoc({ open, setOpen, setResetP }) {
  const classes = useStyles();

  const [payload, setPayload] = useState([]);
  useEffect(() => {
    setPayload({
      _id: uuidV4(),
      title: "",
      text: "",
      username: "Masoud Bakhshi",
      access: "Masoud Bakhshi",
      data: null,
    });
  }, []);
  //************************************************************************************************************************************* */
  const handleIncludeDocs = async (payload, setResetP, setOpen) => {
    // console.log(payload);
    try {
      Axios.defaults.withCredentials = true;

      await Axios.post(
        "http://" + AddressUrl + ":" + BackendPort + "/insertdocument",
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
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
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
              ایجاد سند
            </Typography>
          </Toolbar>
        </AppBar>

        <Grid container component="main" className={classes.root}>
          <CssBaseline />

          <Grid
            item
            xs={12}
            sm={8}
            md={5}
            component={Paper}
            elevation={6}
            square
            className={classes.halfLeft}
          >
            <Typography
              variant="h6"
              className={classes.type}
              style={{ marginBottom: "40px", marginTop: "20px" }}
            >
              برای سند، تیتر و توضیحات لازم را اضافه نمایید
            </Typography>
            <ValidatorForm
              debounceTime={1500}
              className={classes.form}
              onSubmit={handleIncludeDoc}
              style={{ direction: "rtl" }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextValidator
                    autoComplete="title"
                    name="title"
                    variant="outlined"
                    fullWidth
                    id="title"
                    label="تیتر سند"
                    autoFocus
                    onChange={(e) => {
                      setPayload({
                        ...payload,
                        title: e.target.value.toString(),
                      });
                    }}
                    value={payload["title"]}
                    validators={["required", "minStringLength:3"]}
                    errorMessages={[
                      "this field is required",
                      "min letter is 3",
                    ]}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextValidator
                    variant="outlined"
                    fullWidth
                    id="description"
                    label="توضیحات"
                    name="description"
                    multiline
                    rows={3}
                    autoComplete="description"
                    onChange={(e) => {
                      setPayload({
                        ...payload,
                        text: e.target.value.toString(),
                      });
                    }}
                    value={payload["text"]}
                    validators={["required", "minStringLength:3"]}
                    errorMessages={[
                      "this field is required",
                      "min letter is 3",
                    ]}
                  />
                </Grid>
              </Grid>

              <DialogActions>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.submit}
                >
                  ایجاد سند
                </Button>
              </DialogActions>
            </ValidatorForm>
          </Grid>

          <Grid item xs={false} sm={4} md={7} className={classes.image} />
        </Grid>
      </Dialog>
    </div>
  );
}
