import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Button, Modal } from 'react-bootstrap';

const ROOT_API_URL = "http://192.168.1.200:8080/api/";
class ButtonGroup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false
		};
		this.close = this.close.bind(this);
		this.open = this.open.bind(this);
		this.deleteAlert = this.deleteAlert.bind(this);
		this.loadTableData = this.loadTableData.bind(this);
	}
	close(){
		this.setState({showModal: false});
	}
	open(){
		this.setState({showModal: true});
	}
	deleteAlert(){
		const deleteUrl = this.props.selectAlert._links.alert.href;
	  	axios.delete(deleteUrl)
	  	.then(response => {
	  		this.close();
	  		this.loadTableData();
	  	})
	  	.catch(function(error){
	  		console.log(error);
	  	});
	}
	loadTableData() {
  		const alertListUrl = `${ROOT_API_URL}alerts`;
	  	axios.get(alertListUrl)
	  	.then(response => {
	  		console.log(response.data._embedded.alerts);
	  		this.props.refreshTable(response.data._embedded.alerts);
	  	})
	  	.catch(function(error){
	  		console.log(error);
	  	});
  }
	render(){
		return (
			<div className="button-group">
				<Button bsStyle="primary" className="single-button" disabled={!this.props.selectAlert} onClick={this.open}>Delete</Button>
				<Modal show={this.state.showModal} onHide={this.close}>
					<Modal.Header closeButton>
            			<Modal.Title>Delete alert</Modal.Title>
          			</Modal.Header>
          			<Modal.Body>
          				<p>Are you sure you want to permanently delete this selected alert?</p>
          			</Modal.Body>
          			<Modal.Footer>
        				<Button bsStyle="danger" onClick={this.deleteAlert}>Delete</Button>
      				</Modal.Footer>
				</Modal>
			</div>
			);
	}
}
export default ButtonGroup;