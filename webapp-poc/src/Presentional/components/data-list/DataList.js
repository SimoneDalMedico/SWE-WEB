import { Card } from "react-bootstrap";
import classes from "./DataList.module.css";

import ListItem from "./ListItem";

const DataList = (props) => {
  return (
    <div className={classes.container}>
      <h2>{props.title}</h2>
      <Card>
        <ul className={classes.list}>
          {props.list.map((item) => {
            return (
              <ListItem
                key={item.code}
                code={item.code}
                title={item.title}
                isActive={item.isActive}
              />
            );
          })}
        </ul>
      </Card>
    </div>
  );
};

export default DataList;
