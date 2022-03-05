import classes from "./App.module.css";

import { useState, useRef, useEffect, useMemo } from "react";
import SideBar from "./components/sidebar/SideBar";
import Button from "./components/button/Button";
import DataList from "./components/data-list/DataList";
import LoadingSpinner from "./components/pre-loader/LoadingSpinner";

import io from "socket.io-client";

//mi connetto al server socket
const socket = io.connect("http://3.14.149.99:3050/");
//const socket = io.connect("http://localhost:3050/");

const DUMMY_ALARMS = [
  { code: "A30", title: "MAINTENANCE ALARM", isActive: 1 },
  { code: "A31", title: "REMOTE SERVICE ALARM", isActive: 0 },
  { code: "A32", title: "BATTERY DISCONNECTED", isActive: 1 },
];

const DUMMY_STATES = [
  { code: "S15", title: "UPS IN ENERGY SAVER", isActive: 1 },
  { code: "S17", title: "HEAT RUN MODE", isActive: 0 },
  { code: "S18", title: "OPERATING", isActive: 1 },
];

const DUMMY_MEASUREMENTS = [
  { code: "M42", title: "Output load rate", isActive: "5 %" },
  { code: "M43", title: "Output", isActive: "0.5 kW" },
  { code: "M44", title: "Output voltage L1", isActive: "5 V" },
];

function App() {
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [name, setName] = useState("");
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState();
  let   callerRef = useRef("");

  const [dataToDisplay, setDataToDisplay] = useState("");
  const [answer, setAnswer] = useState("");

  const myVideo = useRef();
  const connectionRef = useRef();

  const servers = {
    iceServers: [
      {
        urls: [
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
        ],
      },
    ],
  };

  //  Creo connessione P2P
  const peerConnection = new RTCPeerConnection(servers);

  //  gestione ricezione chiamata
  const handleAnswer = async (username, name, surname) => {
    console.log("- - - HANDLE ANSWER - - -");

    //creo una risposta
    let answer = await peerConnection.createAnswer();
    setAnswer(answer);

    //setto la risposta come local description
    await peerConnection.setLocalDescription(answer);

    //creo json di risposta da inviare all'applicazione mobile
    const obj = {
      from: {
        username: "tecnico",
        name: "tecnico",
        surname: "tecnico",
      },
      to: {
        username: username,
        name: name,
        surname: surname,
      },
      sdp: {
        type: answer.type,
        sdp: answer.sdp,
      },
      isVideoCall: true,
    };

    console.log(answer);
    console.log(obj);

    //emette evento 'make-answer' al socket server ed invia l'oggetto risposta
    socket.emit("make-answer", obj);
    console.log("!-- ------------ --!");
    return;
  };

  useEffect(() => {
    //prendo stream da videocamera locale e lo setto nel video sul browser
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        myVideo.current.srcObject = stream;
      });

    //aggiungo listener alla connessione P2P per ascoltare eventi del tipo "icecandidate"
    peerConnection.addEventListener("icecandidate", (data) => {

      console.log("--CANDIDATE--")
      console.log("candidate " + callerRef.current)
      console.log("--CANDIDATE--")

      if (data.candidate) {
        const obj = {
          from: {
            username: "tecnico",
            name: "tecnico",
            surname: "tecnico",
          },
          to: {
            username: callerRef.current.username,
            name: callerRef.current.name,
            surname: callerRef.current.surname,
          },
          candidate: data.candidate.candidate,
          sdpMid: data.candidate.sdpMid,
          sdpMlineIndex: data.candidate.sdpMLineIndex,
        };

        //emette evento 'ice-candidate' al server socket ed invia l'oggetto ice
        socket.emit("ice-candidate", obj);
      } else {
        console.log("ice-candidate is null");
      }
    });

    //aggiungo listener alla connessione P2P per ascoltare eventi del tipo "track"
    peerConnection.addEventListener("track", (event) => {
      console.log(event);
      //setto stram video su tag <video id='videofrommobile'>
      document.getElementById("videofrommobile").srcObject = event.streams[0];
    });

    //lisnerer socket per eventi "call-made" (ovvero quando broswer riceve chiamata)
    socket.on("call-made", async (data) => {
      console.log("- - - OFFER ricevuta - - -");
      console.log(data);
      setReceivingCall(true);
      setCaller(data.from);
      console.log("chiamata ricevuta da: " + data.from.username);
      await peerConnection.setRemoteDescription(data.sdp);
      //console.log("set remote desc : " + peerConnection.remoteDescription.sdp)
      await handleAnswer(data.from.username, data.from.name, data.from.surname);
      console.log("- - - - - - -");
    });

    //listener socket per event "hang-up" (cioé quando la chiamata termina)
    socket.on("hang-up", () => {
      setReceivingCall(false);
      setCallEnded(true);
      setCallAccepted(false);
      setCaller();
      peerConnection = null;
    });

    socket.on("ice-candidate", (data) => {
      //alert(JSON.stringify(data.from))
      setCaller(data.from);
      callerRef.current = data.from;
    });

    //emette evento al socket server 'connect-support' ed invia le credenziali
    socket.emit("connect-support", {
      username: "tecnico",
      name: "tecnico",
      surname: "tecnico",
    });
  }, []);

  // gestione accettazione chiamata
  const answerCallHandler = () => {
    setCallAccepted(true);
    document.getElementById("videofrommobile").style.visibility = "visible";
    //alert(JSON.stringify(answer));
  };

  // gestione stop chiamata
  const leaveCallHandler = () => {
    const obj = {
      from: {
        username: "tecnico",
        name: "tecnico",
        surname: "tecnico",
      },
      to: {
        username: caller.username,
        name: caller.name,
        surname: caller.surname,
      },
    };

    socket.emit("hang-up", obj);

    setReceivingCall(false);
    setCallEnded(true);
    setCallAccepted(false);
    setCaller();
    peerConnection.close();
    window.location.reload();
  };


  return (
    <div className={classes.app}>
      <SideBar
        className="w-20"
        callAccepted={callAccepted && !callEnded}
        remoteUsername={caller?.username}
        leaveCall={leaveCallHandler}
      />

      <div className={classes.container}>
        <div className={classes.video}>
          {stream && (
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              style={{ width: "300px" }}
            />
          )}
          {!callEnded && (
            <video
              playsInline
              id="videofrommobile"
              autoPlay
              style={{ width: "300px", visibility: "hidden" }}
            />
          )}
        </div>
        {(!receivingCall || callEnded) && <LoadingSpinner />}
        {receivingCall && !callAccepted && (
          <div className={classes.incoming}>
            <h1>il cliente "{caller.username}" ha richiesto supporto</h1>
            <div className={classes.buttons}>
              <Button
                background="#bcf0da"
                icon="./Accetta1.png"
                label="Accetta"
                className={classes.accetta}
                onClick={answerCallHandler}
              />
              <Button
                background="#f9927d"
                icon="./Rifiuta1.png"
                label="Rifiuta"
                className={classes.rifiuta}
                onClick={leaveCallHandler}
              />
            </div>
          </div>
        )}
        {callAccepted && !callEnded && (
          <div className={classes.accepted}>
            <DataList title="Stati" list={DUMMY_STATES} />
            <DataList title="Allarmi" list={DUMMY_ALARMS} />
            <DataList title="Misure" list={DUMMY_MEASUREMENTS} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
