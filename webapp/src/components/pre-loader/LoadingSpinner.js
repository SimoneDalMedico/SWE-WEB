import classes from "./LoadingSpinner.module.css";

const LoadingSpinner = () => {
  const divClassName = `${classes.spinner} d-flex justify-content-center`;
  return (
    <div className={classes.wait}>
      <h1 className="d-flex justify-content-center">
        In attesa di una chiamata...
      </h1>
      <div className={divClassName}></div>
    </div>
  );
};

export default LoadingSpinner;
