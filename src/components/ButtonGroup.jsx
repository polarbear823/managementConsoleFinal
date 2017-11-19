import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import moment from 'moment';
import { Button, Modal, DropdownButton, MenuItem } from 'react-bootstrap';
import {ROOT_ALERTS_API_URL, SEVERITY_STRING_MAP, getSeverityClassName, SEVERITY_NUM_ARRAY} from '../configure_variables';
import DateTimePicker from './DateTimePicker.jsx';
import SeverityNumberBlock from './SeverityNumberBlock.jsx';
import DropDownList from './DropDownList.jsx';

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
		this.getNumberOfSevAlert = this.getNumberOfSevAlert.bind(this);
		this.filterAlertsChange = this.filterAlertsChange.bind(this);
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
		// const deleteUrl = `${ROOT_ALERTS_API_URL}alerts/${this.props.selectAlert.id}`;
	 //  	axios.delete(deleteUrl)
	 //  	.then(response => {
	 //  		this.close();
	 //  		this.loadTableData(this.state.startDate, this.state.endDate);
	 //  	})
	 //  	.catch(function(error){
	 //  		console.log(error);
	 //  	});
	 this.props.deleteAlert(this.props.selectAlert);
	 this.close();
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
  getNumberOfSevAlert(sevLevel) {
	return this.props.alerts.filter(alert => alert.severity === sevLevel).length;
  }; 

  filterAlertsChange(filterName) {
  	switch(filterName) {
  		case "AllEvents":
  			this.props.refreshFilteredTable(this.props.alerts);
  			break;
  		case "MinorSeverity":
  			this.props.refreshFilteredTable(this.props.alerts.filter(alert => alert.severity === 2));
  			break;
  		default:
  			this.props.refreshFilteredTable(this.props.alerts);
  	}
  }

	render(){
		return (
			<div className="button-group">
				<DropDownList listId="viewList" list={this.props.filterList} onInputValueChange={this.filterAlertsChange}/>

				{
					SEVERITY_NUM_ARRAY.map(num => {
						return (<SeverityNumberBlock 
									colorClass={getSeverityClassName(num)} 
									num={this.getNumberOfSevAlert(num)} 
									onBlockClick = {() => this.props.refreshFilteredTable(this.props.alerts.filter(alert => alert.severity === num))}
									key={num}/>);
					})
				}
			      <DropdownButton title="View" id="dropdown-size-medium" className="view-dropdown">
			        {
			        	this.props.viewList.map(view => {
			        		return (<MenuItem eventKey={view.viewName} 
			        						  key={view.viewName} 
			        						  active={view.viewName === this.props.currentView.viewName}
			        						  onSelect={(eventKey) => this.props.onViewItemClicked(eventKey)}>{view.viewName}</MenuItem>);
			        	})
			        }
			      </DropdownButton>
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