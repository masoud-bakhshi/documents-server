import React, { useEffect, useState, useContext } from "react";
import { makeStyles, Button, Grid } from "@material-ui/core";
import TextEditor from "./TextEditor";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import PostAddIcon from "@material-ui/icons/PostAdd";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import AddDoc from "./AddDoc";
import LinearProgress from "@material-ui/core/LinearProgress";
import { multiStepContext } from "./utils/StepContext";
import DocDialog from "./DocDialog";
import Axios from "axios";
const manageAxio = require("./utils/manageAxio");

const useStyles = makeStyles((theme) => ({
  root1: {
    "& > *": {
      margin: theme.spacing(1),
    },
    direction: "rtl",
  },
  root: {
    maxWidth: 300,
  },
  media: {
    height: 165,
    margin: 0,
  },
}));
export default function DevCodeDoc() {
  return (
    <div>
      <DocStore></DocStore>
    </div>
  );
}

function DocStore() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [docOpen, setDocOpen] = useState(false);
  //   const [sOpen, setSOpen] = useState(false);
  const [pay, setPay] = React.useState([]);
  const [resetP, setResetP] = React.useState(true);
  const [dialogInfo, setDialogInfo] = React.useState([]);
  const [progress, setProgress] = useState(true);
  const [docId, setDocId] = useState("1f6a4c60-6fd0-4005-805f-62d5a258be4a");
  const [payload, setPayload] = useState([]);
  useEffect(() => {
    setPayload({
      _id: "1f6a4c60-6fd0-4005-805f-62d5a258be4a",
      title: "",
      text: "",
      username: "Masoud Bakhshi",
      access: "Masoud Bakhshi",
      data: null,
    });
  }, []);
  let history = useHistory();

  //************************************************************************************************************************************* */
  const getdocuments = async (setPay, setProgress) => {
    try {
      Axios.defaults.withCredentials = true;

      Axios.get("http://" + "localhost" + ":" + "7501" + "/getdocument")
        .then((response) => {
          if (response.data) {
            setPay(response.data.data);
            setProgress(false);
          }
        })
        .catch((error) => {});
    } catch (error) {}
  };
  //************************************************************************************************************************************* */
  const removedocuments = async (data, setResetP) => {
    try {
      Axios.defaults.withCredentials = true;
      Axios.delete(
        "http://" +
          AddressUrl +
          ":" +
          BackendPort +
          "/removedocument" +
          "?idd=" +
          data._id
      )
        .then((response) => {
          // if (response.data) {
          setResetP(true);
          // }
        })
        .catch((error) => {});
    } catch (error) {}
  };
  //************************************************************************************************************************************** */
  const getdocument = async () => {
    getdocuments(setPay, setProgress);
  };
  const removedocument = (data) => {
    removedocuments(data, setResetP);
  };
  useEffect(() => {
    if (resetP) {
      try {
        getdocument();
        setResetP(false);
      } catch (error) {}
    }
  }, [resetP]);

  return (
    <div className={classes.root1}>
      <div>
        <div className={classes.root1} align="center">
          <div style={{ direction: "rtl" }}>
            <Typography variant="overline" display="block" gutterBottom>
              Share your Documents
            </Typography>
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setDocOpen(true);
              // setOpen(true);
            }}
            startIcon={<PostAddIcon />}
          >
            Open Documents
          </Button>
        </div>

        {docOpen && (
          <DocDialog
            open={docOpen}
            setOpen={setDocOpen}
            documentId={docId}
            payload={payload}
            setResetP={setResetP}
          ></DocDialog>
        )}
      </div>
    </div>
  );
}
