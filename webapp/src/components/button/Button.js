
import React from "react";
import {Row} from "react-bootstrap";
import styles from './Button.module.css'
const Button = (props) => {
   //props.key
   //props.icon
   
   // let background= 'background:' + props.background;
   // const overEffect = (object) => {
   //    object.style.backgroundColor = props.hover;
   // }

   return(

      <button id={props.id} type={props.type || 'button'} onClick={props.onClick} className={styles.button} style={{'background': props.background}}>
         <Row className="justify-content-around" sm={2}>
            <img src={props.icon} alt="icon"/>
            <span className="d-flex align-items-center justify-content-center">{props.label}</span>
         </Row>
      </button>
   );
};

export default Button;