import { Col, Row } from "react-bootstrap";

import classes from "./ListItem.module.css";

const ListItem = (props) => {
  return (
      <li className={classes.item}>
        <Row>
          <Col sm={3}>{props.code}</Col>
          <Col sm={6}>{props.title}</Col>
          <Col sm={3}>{props.isActive}</Col>
        </Row>
      </li>
  );
};

export default ListItem;
