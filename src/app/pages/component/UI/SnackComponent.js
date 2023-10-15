import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Fade from '@material-ui/core/Fade';
import Slide from '@material-ui/core/Slide';
import Grow from '@material-ui/core/Grow';
import propType from 'prop-types';
import { SnackbarContent } from '@material-ui/core';

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

function GrowTransition(props) {
  return <Grow {...props} />;
}
const styles = {
    snackbarStyleViaContentProps: {
      backgroundColor: "orange"
    },
    snackbarStyleViaNestedContent: {
      backgroundColor: "lightgreen",
      color: "black"
    }
};

export  function SnackComponent(props) {
  const [state, setState] = React.useState({
    open: false,
    Transition: Fade,
  });

  const handleClick = Transition => () => {
    setState({
      open: true,
      Transition,
    });
  };

  function handleClose() {
   props.setShowSnack(false);
  }

  return (
    <div>
      {/* <Button onClick={handleClick(GrowTransition)}>Grow Transition</Button>
      <Button onClick={handleClick(Fade)}>Fade Transition</Button>
      <Button onClick={handleClick(SlideTransition)}>Slide Transition</Button> */}
      <Snackbar
        open={props.showSnack}
        onClose={handleClose}
        TransitionComponent={state.Transition}
        ContentProps={{
          'aria-describedby': 'message-id',
        }}
        
      >
          {
              
          }
          <SnackbarContent
                // style={props.snackModel===false?'':styles.snackbarStyleViaNestedContent}
                message={<span id="message-id">{props.snackModel.errorMessage}</span>}
          ></SnackbarContent>
      </Snackbar>
    </div>
  );
}


export default SnackComponent;