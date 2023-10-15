import React from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

export const HtmlTooltip = withStyles(theme => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9',
    },
  }))(Tooltip);
  

export  function TooltipComponent(props) {
    return (
      <div>
        <HtmlTooltip
          title={
            <React.Fragment>
              <Typography color="inherit">{props.Title}</Typography>
              <em>{props.children}</em>
            </React.Fragment>
          }
        >
          <Button>{props.Title}</Button>
        </HtmlTooltip>
      </div>
    );
}

export default TooltipComponent;