import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Button, FormGroup, InputGroup, FormControl } from 'react-bootstrap';

class SearchBar extends Component {
	render(){
		return (
			<FormGroup>
		      <InputGroup>       
		        <FormControl type="text" />
		        <InputGroup.Button>
		          <Button>Go</Button>
		        </InputGroup.Button>
		      </InputGroup>
		    </FormGroup>
			);
	}
}

export default SearchBar;