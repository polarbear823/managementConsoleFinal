import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class DropDownList extends Component {
	constructor(props) {
		super(props);
		this.onInputValueChange = this.onInputValueChange.bind(this);
	}
	onInputValueChange(e) {
		this.props.onInputValueChange(e.target.value);
	}
	render() {
		return (
			<div className="inline-div">
				<input type="text" list={this.props.listId} onChange={this.onInputValueChange}/>
				<datalist id={this.props.listId}>
				  {
				  	this.props.list.map(item => {
				  		return (<option key={item}>{item}</option>);
				  	} )
				  }
				</datalist>
			</div>
			);
	}

}
export default DropDownList;