import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import moment from 'moment';
import { Button, Modal, DropdownButton, MenuItem } from 'react-bootstrap';
import {ROOT_ALERTS_API_URL, SEVERITY_STRING_MAP, getSeverityClassName} from '../configure_variables';
import DateTimePicker from './DateTimePicker.jsx';

class ButtonGroup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			dropdownTitle: "Select Severity",
			severityBgColor: "",
			startDate: moment().subtract(29, 'days'),
			endDate: moment().endOf('day')
		};
		this.close = this.close.bind(this);
		this.open = this.open.bind(this);
		this.deleteAlert = this.deleteAlert.bind(this);
		this.loadTableData = this.loadTableData.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
		this.dateTimeRangeChange = this.dateTimeRangeChange.bind(this);
	}
	close(){
		this.setState({showModal: false});
	}
	open(){
		this.setState({showModal: true});
	}
	handleSelect(e){
		if (e === "clear") {
			this.props.refreshFilteredTable(this.props.alerts);
			this.setState({dropdownTitle: "Select Severity", severityBgColor: "" });
			return;
		}
		this.setState({dropdownTitle: SEVERITY_STRING_MAP.get(parseInt(e)), severityBgColor: getSeverityClassName(parseInt(e)) });
		let filteredAlerts = this.props.alerts.filter(alert => {
			return parseInt(e) === alert.severity;
		});
		this.props.refreshFilteredTable(filteredAlerts);
	}
	deleteAlert(){
		const deleteUrl = `${ROOT_ALERTS_API_URL}alerts/${this.props.selectAlert.id}`;
	  	axios.delete(deleteUrl)
	  	.then(response => {
	  		this.close();
	  		this.loadTableData(this.state.startDate, this.state.endDate);
	  	})
	  	.catch(function(error){
	  		console.log(error);
	  	});
	}
	loadTableData(startDate, endDate) {
  		const alertListUrl = `${ROOT_ALERTS_API_URL}search/findByReceiveTime?startTime=${startDate.valueOf()}&endTime=${endDate.valueOf()}`;
	  	axios.get(alertListUrl)
	  	.then(response => {
	  		this.props.refreshTable(response.data);
	  		this.props.refreshFilteredTable(response.data);
	  	})
	  	.catch(function(error){
	  		console.log(error);
	  	});
  }
  dateTimeRangeChange(startDate, endDate){
  	this.setState({startDate: startDate, endDate: endDate, dropdownTitle: "Select Severity"});
  	this.props.showNoMoreData(false);
  	this.loadTableData(startDate, endDate);
  }
	render(){
		return (
			<div className="button-group">
				<DropdownButton title={this.state.dropdownTitle} id="bg-nested-dropdown" onSelect={this.handleSelect} className={this.state.severityBgColor}>				  
			      <MenuItem eventKey="1" className="tr-severity-1">{SEVERITY_STRING_MAP.get(1)}</MenuItem>
			      <MenuItem eventKey="2" className="tr-severity-2">{SEVERITY_STRING_MAP.get(2)}</MenuItem>
			      <MenuItem eventKey="3" className="tr-severity-3">{SEVERITY_STRING_MAP.get(3)}</MenuItem>
			      <MenuItem eventKey="4" className="tr-severity-4">{SEVERITY_STRING_MAP.get(4)}</MenuItem>
			      <MenuItem eventKey="5" className="tr-severity-5">{SEVERITY_STRING_MAP.get(5)}</MenuItem>
			      <MenuItem eventKey="-1" className="tr-severity-other">{SEVERITY_STRING_MAP.get(-1)}</MenuItem>
			      <MenuItem eventKey="clear">All</MenuItem>
			    </DropdownButton>
				<Button bsStyle="primary" className="single-button" disabled={!this.props.selectAlert} onClick={this.open}>Delete</Button>
				<DateTimePicker onChange={ (startDate, endDate) => this.dateTimeRangeChange(startDate, endDate)} startDate={this.state.startDate} endDate={this.state.endDate}/>
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