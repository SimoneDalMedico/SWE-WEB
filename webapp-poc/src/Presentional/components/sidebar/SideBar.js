import classes from "./SideBar.module.css";
import Button from "../button/Button";
import { Card } from "react-bootstrap";

const SideBar = (props) => {
  return (
    <div className={classes.sidebar}>

      <Card className={classes.card}>
          <Card.Header> <strong>Tecnico</strong></Card.Header>
          <Card.Body>
            Attualmente collegato: "tecnico"
          </Card.Body>
        </Card>


      {props.callAccepted && (
        <Card className={classes.card}>
          <Card.Header> <strong>Collegamento in corso</strong></Card.Header>
          <Card.Body>
            Collegato con il cliente : "{props?.remoteUsername}"
          </Card.Body>
        </Card>
      )}

      <div className={classes.buttons}>
        {props.callAccepted && (
          <div className={classes.termina}>
            <Button
              background="#f9927d"
              icon="../../Rifiuta1.png"
              label="Termina"
              onClick={props.leaveCall}
            />
          </div>
        )}
        {/* <div className={classes.logout}>
          <Button
            id="logout"
            background="#f9927d"
            icon="../../logout.png"
            label="Logout"
            className={classes.rifiuta}
          />
        </div> */}
      </div>
    </div>
  );
};

export default SideBar;
