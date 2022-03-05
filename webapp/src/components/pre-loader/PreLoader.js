import React, { Fragment, useEffect, useState } from "react";
import ReactLoading from "react-loading";

function PreLoader() {
  const [data, setData] = useState([]);
  const [done, setDone] = useState(undefined);

  useEffect(() => {
    fetch("http://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        setData(json);
        setDone(true);
      });
  }, []);
  return (
    <>
      {/* <ReactLoading type={"spin"} color={"blue"} height={150} width={100}/>
      <p>Attendi un momento...</p>
      <img src="1480.gif" alt="gif"/> */}

      {!done ? (
        <>
          <ReactLoading type={"spin"} color={"blue"} height={150} width={100} />
          <p>Attendi un momento...</p>
        </>
      ) : (
        <Fragment>
          <p>In attesa di una chiamta...</p>
          <img alt="sas" width={150} height={150} />
        </Fragment>
      )}
    </>
  );
}

export default PreLoader;
