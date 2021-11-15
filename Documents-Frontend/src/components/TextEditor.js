import React from "react";
import { useCallback, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
// import { io } from "socket.io-client";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import "./docstyle.css";
import { saveAs } from "file-saver";
import * as quillToWord from "quill-to-word";
// import { pdfExporter } from "quill-to-pdf";

const SAVE_INTERVAL_MS = 2000;
var q;
// var TOOLBAR_OPTIONS = [
//   [{ font: [] }],
//   [{ size: ["small", false, "large", "huge"] }], // custom dropdown
//   ["bold", "italic", "underline", "strike"], // toggled buttons
//   [{ align: [] }],
//   [{ direction: "rtl" }, { direction: "ltr" }], // text direction
//   [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
//   // [{ header: 1 }, { header: 2 }], // custom button values
//   [{ header: [1, 2, 3, 4, 5, 6, false] }],
//   [{ list: "ordered" }, { list: "bullet" }],
//   [{ script: "sub" }, { script: "super" }], // superscript/subscript
//   [{ color: [] }, { background: [] }], // dropdown with defaults from theme
//   ["link", "blockquote", "code-block", "formula"],
//   ["image", "video"],
//   ["clean"], // remove formatting button
// ];
var TOOLBAR_OPTIONS = [
  [{ font: [] }],
  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  ["bold"],
  ["italic"],
  ["underline"],
  ["strike"], // toggled buttons
  [{ align: [] }],
  [{ direction: "rtl" }, { direction: "ltr" }], // text direction
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ list: "ordered" }],
  [{ list: "bullet" }],
  [{ script: "sub" }],
  [{ script: "super" }], // superscript/subscript
  [{ color: [] }],
  [{ background: [] }], // dropdown with defaults from theme
  ["link"],
  ["blockquote"],
  ["code-block"],
  ["formula"],
  ["image"],
  ["video"],
  ["clean"], // remove formatting button
  // [{ header: 1 }, { header: 2 }], // custom button values
];
const AddressUrl = "localhost";
const DocServerPort = "7501";
const ENDPOINT = "http://" + AddressUrl + ":" + DocServerPort;
let socket;
export default function TextEditor({ documentId, saveWord, setsSaveWord }) {
  const [quill, setQuill] = useState();

  useEffect(() => {
    socket = io(ENDPOINT, {
      // reconnection: false,
      // transports: ["websocket"],
      query: `token=${localStorage.getItem("token")}`,
      extraHeaders: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    return () => {
      // s.disconnect();
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket == null || quill == null) return;

    socket.once("load-document", (document) => {
      quill.setContents(document);
      quill.enable();
    });

    socket.emit("get-document", documentId);
  }, [socket, quill, documentId]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents());
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta) => {
      quill.updateContents(delta);
    };
    socket.on("receive-changes", handler);

    return () => {
      socket.off("receive-changes", handler);
    };
  }, [socket, quill]);

  useEffect(() => {
    if (socket == null || quill == null) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== "user") return;
      socket.emit("send-changes", delta);
    };
    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [socket, quill]);

  const SaveToWord = async () => {
    try {
      const delta = q.getContents();
      const quillToWordConfig = {
        exportAs: "blob",
      };
      const docAsBlob = await quillToWord.generateWord(
        delta,
        quillToWordConfig
      );
      saveAs(docAsBlob, "word-export.docx");
      setsSaveWord(false);
    } catch (error) {}
  };
  useEffect(() => {
    if (saveWord === true) {
      SaveToWord();
    }
  }, [saveWord]);

  const wrapperRef = useCallback((wrapper) => {
    if (wrapper == null) return;

    wrapper.innerHTML = "";
    const editor = document.createElement("div");
    wrapper.append(editor);
    // const q = new Quill(editor, {
    q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    //************************************************************************************************ */

    //***************************************************************************************************** */
    q.disable();
    q.setText("Loading...");
    setQuill(q);
  }, []);
  return <div className="container" ref={wrapperRef}></div>;
}
