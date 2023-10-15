import React, {useState, Fragment} from 'react';
import {Form} from 'react-bootstrap';
import Typeahead from 'react-currency-input-field';

export  const AutoCompleteComponent = (props) => {
    const [singleSelections, setSingleSelections] = useState([]);

    return (
      <Fragment>
        <Form.Group>
          <Form.Label>Single Selection</Form.Label>
          <Typeahead
            id="basic-typeahead-single"
            labelKey="name"
            onChange={setSingleSelections}
            options={props.options}
            placeholder="Choose a state..."
            selected={singleSelections}
          />
        </Form.Group>
      </Fragment>
    );
  };

  export default AutoCompleteComponent;