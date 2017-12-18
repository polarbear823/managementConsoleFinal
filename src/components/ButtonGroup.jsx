import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import moment from 'moment';
import { Button, Modal, DropdownButton, MenuItem, FormGroup, ControlLabel, FormControl, Glyphicon, Checkbox } from 'react-bootstrap';
import {ROOT_ALERTS_API_URL, SEVERITY_STRING_MAP, getSeverityClassName, SEVERITY_NUM_ARRAY, ALERT_PROPERTIES} from '../configure_variables';
import DateTimePicker from './DateTimePicker.jsx';
import SeverityNumberBlock from './SeverityNumberBlock.jsx';
import DropDownList from './DropDownList.jsx';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import 'react-datetime/css/react-datetime.css';

const Datetime = require('react-datetime');
class ButtonGroup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			showSeverityChangeModal: false,
			showAddViewModal: false,
			showAddFilterModal: false,
			dropdownTitle: "Select Severity",
			severityBgColor: "",
			startDate: moment().subtract(29, 'days'),
			endDate: moment().endOf('day'),
			selectedOptions: [],
			alertTimeStart: null,
			alertTimeEnd: null,
			receiveTimeStart: null,
			receiveTimeEnd: null
		};
		this.close = this.close.bind(this);
		this.open = this.open.bind(this);
		this.openSeverityChangeModal = this.openSeverityChangeModal.bind(this);
		this.closeSeverityChangeModal = this.closeSeverityChangeModal.bind(this);
		this.closeAddViewModal = this.closeAddViewModal.bind(this);
		this.closeAddFilterModal = this.closeAddFilterModal.bind(this);
		this.openAddViewModal = this.openAddViewModal.bind(this);
		this.openAddFilterModal = this.openAddFilterModal.bind(this);
		this.deleteAlert = this.deleteAlert.bind(this);
		this.loadTableData = this.loadTableData.bind(this);
		this.handleSelect = this.handleSelect.bind(this);
		this.dateTimeRangeChange = this.dateTimeRangeChange.bind(this);
		this.getNumberOfSevAlert = this.getNumberOfSevAlert.bind(this);
		this.filterAlertsChange = this.filterAlertsChange.bind(this);
		this.actionSelect = this.actionSelect.bind(this);
		this.saveSeverityChange = this.saveSeverityChange.bind(this);
		this.handleViewChange = this.handleViewChange.bind(this);
		this.onSaveView = this.onSaveView.bind(this);
		this.addFilter = this.addFilter.bind(this);
	}
	close(){
		this.setState({showModal: false});
	}
	open(){
		this.setState({showModal: true});
	}
	openSeverityChangeModal(){
		this.setState({showSeverityChangeModal: true});
	}
	closeSeverityChangeModal() {
		this.setState({showSeverityChangeModal: false});
	}
	closeAddViewModal(){
		this.setState({showAddViewModal: false});
	}
	closeAddFilterModal(){
		this.setState({showAddFilterModal: false});
	}
	openAddViewModal(){
		this.setState({showAddViewModal: true});
	}
	openAddFilterModal(){
		this.setState({showAddFilterModal: true});
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
  	let filterObjs = this.props.filterList.filter(filter => filter.filterName === filterName);
  	if (filterObjs === null || filterObjs.length === 0) {
  		this.props.refreshFilteredTable(this.props.alerts);
  	} else {
  		let filterObj = filterObjs[0];
  		let filteredAlerts = this.props.filteredlerts;
  		console.log(filterObj);
  		if (filterObj.severities !== null && filterObj.severities !== undefined) {
  			filteredAlerts = filteredAlerts.filter( alert => filterObj.severities.includes(alert.severity) );
  		}
  		if (filterObj.alertTimeRange !== null && filterObj.alertTimeRange !== undefined) {
  			filteredAlerts = filteredAlerts.filter( alert => filterObj.alertTimeRange[0] >= alert.alertTime && filterObj.alertTimeRange[1] < alert.alertTime );
  		}
  		if (filterObj.receiveTimeRange !== null && filterObj.receiveTimeRange !== undefined) {
  			filteredAlerts = filteredAlerts.filter( alert => filterObj.receiveTimeRange[0] >= alert.receiveTime && filterObj.receiveTimeRange[1] < alert.receiveTime );
  		}
  		if (filterObj.alertMessageContains != null && filterObj.alertMessageContains !== undefined) {
  			filteredAlerts = filteredAlerts.filter( alert => alert.alertMsg.includes(filterObj.alertMessageContains) );
  		}
  		this.props.refreshFilteredTable(filteredAlerts);
  	}
  }

  actionSelect(action) {
  	switch(action) {
  		case "Delete":
  			this.open();
  			break;
  		case "Change Severity":
  		this.openSeverityChangeModal();
  			break;
  		default:
  	}
  }

  saveSeverityChange() {
  	let modifiedAlert = this.props.selectAlert;
  	modifiedAlert.severity = parseInt(this.alertSeverity.value);
  	this.props.changeSeverity(modifiedAlert);
  	this.closeSeverityChangeModal();
  }

  handleViewChange(selectedOptions) {
  	this.setState({selectedOptions: selectedOptions});
  }

  onSaveView() {
  	let view =  {
  		viewName: this.viewNameField.value,
  		showProperties: this.state.selectedOptions.map( (property) => property.value )
  	};
  	this.props.addView(view);
  	this.closeAddViewModal();
  }

  addFilter() {
  	let newFilter = {};
  	if (this.filterNameField.value === null) {
  		alert("Input the filter name!")
  		return;
  	}
  	newFilter.filterName = this.filterNameField.value;
  	let selectedSeverities = [];
  	if (this.normalCheckbox.checked) {
  		selectedSeverities.push(parseInt(this.normalCheckbox.value));
  	}
  	if (this.warningCheckbox.checked) {
  		selectedSeverities.push(parseInt(this.warningCheckbox.value));
  	}
  	if (this.minorCheckbox.checked) {
  		selectedSeverities.push(parseInt(this.minorCheckbox.value));
  	}
  	if (this.majorCheckbox.checked) {
  		selectedSeverities.push(parseInt(this.majorCheckbox.value));
  	}
  	if (this.criticalCheckbox.checked) {
  		selectedSeverities.push(parseInt(this.criticalCheckbox.value));
  	}
  	if (this.unknownCheckbox.checked) {
  		selectedSeverities.push(parseInt(this.unknownCheckbox.value));
  	}

  	if (selectedSeverities.length !== 0) {
  		newFilter.severities = selectedSeverities;
  	}
  	if (this.state.alertTimeStart !== null || this.state.alertTimeEnd !== null) {
  		newFilter.alertTimeRange = [this.state.alertTimeStart === null ? moment().valueOf() : this.state.alertTimeStart, this.state.alertTimeEnd === null ? moment().valueOf() : this.state.lertTimeEnd];
  	}
  	if (this.state.receiveTimeStart !== null || this.state.receiveTimeEnd !== null) {
  		newFilter.receiveTimeRange = [this.state.receiveTimeStart === null ? moment().valueOf() : this.state.receiveTimeStart, this.state.receiveTimeEnd === null ? moment().valueOf() : this.state.receiveTimeEnd];
  	}
  	if (this.alertMsgContains.value !== null){
  		newFilter.alertMessageContains = this.alertMsgContains.value;
  	}
  	this.props.addFilter(newFilter);
    this.closeAddFilterModal()

  }

	render(){
		return (
			<div className="button-group">
				<DropDownList listId="viewList" list={this.props.filterList.map(filter => filter.filterName)} onInputValueChange={this.filterAlertsChange}/>

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
			      <DropdownButton title="Action" id="dropdown-size-medium" className="view-dropdown" disabled={!this.props.selectAlert}>
			      	{
			      		this.props.actions.map( action => {
			      			return (
			      				<MenuItem eventKey={action}
			      						  key={action}
			      						  onSelect={ (eventKey) => this.actionSelect(eventKey)}>{action}</MenuItem>
			      				);
			      		})
			      	}
			      </DropdownButton>
			      <DropdownButton title={<span><Glyphicon glyph="cog" /> Config</span>} id="dropdown-size-medium" className="view-dropdown">
			      	<MenuItem eventKey="Add view" onSelect={() => this.openAddViewModal()}> Add view</MenuItem>
			      	<MenuItem eventKey="Add filter" onSelect={() => this.openAddFilterModal()}> Add filter</MenuItem>
			      </DropdownButton>
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
				<Modal show={this.state.showSeverityChangeModal} onHide={this.closeSeverityChangeModal}>
					<Modal.Header closeButton>
            			<Modal.Title>Change severity</Modal.Title>
          			</Modal.Header>
          			<Modal.Body>
          				<FormGroup controlId="formControlsSelect">
					      <ControlLabel>Change severity to</ControlLabel>
					      <FormControl componentClass="select" placeholder="select" inputRef={ref => { this.alertSeverity = ref; }}>
					      	{
					      		SEVERITY_NUM_ARRAY.map(sev => {
					      			return <option value={sev} key={sev}>{SEVERITY_STRING_MAP.get(sev)}</option> 
					      		})
					      	}
					      </FormControl>
					    </FormGroup>
          			</Modal.Body>
          			<Modal.Footer>
        				<Button bsStyle="primary" onClick={this.saveSeverityChange}>Save</Button>
      				</Modal.Footer>
				</Modal>
				<Modal show={this.state.showAddViewModal} onHide={this.closeAddViewModal}>
					<Modal.Header closeButton>
            			<Modal.Title>Add view</Modal.Title>
          			</Modal.Header>
          			<Modal.Body>
          				<div>
          				    <FormGroup controlId="newViewName">
						      <ControlLabel>View name</ControlLabel>
						      <FormControl type="text" placeholder="Enter view name" inputRef={ref => { this.viewNameField = ref; }}/>
						    </FormGroup>
						    <ControlLabel>Select properties (multiple)</ControlLabel>
          					<Select
						        name="properties-select"
						        value={this.state.selectedOptions}
						        onChange={this.handleViewChange}
						        options={ALERT_PROPERTIES}
						        multi={true}
						        joinValues={true}
						        delimiter=","
						     />
          				</div>
          			</Modal.Body>
          			<Modal.Footer>
        				<Button bsStyle="primary" onClick={this.onSaveView}>Save</Button>
      				</Modal.Footer>
				</Modal>
				<Modal show={this.state.showAddFilterModal} onHide={this.closeAddFilterModal}>
					<Modal.Header closeButton>
            			<Modal.Title>Add filter</Modal.Title>
          			</Modal.Header>
          			<Modal.Body>
          				<div>
          					<FormGroup controlId="newFilterName">
						      <ControlLabel>Filter name</ControlLabel>
						      <FormControl type="text" placeholder="Enter filter name" inputRef={ref => { this.filterNameField = ref; }}/>
						    </FormGroup>
						    <FormGroup>
						      <div><ControlLabel>Select severities</ControlLabel></div>
						      <Checkbox inline value={1} inputRef={ref => { this.normalCheckbox = ref; }}>
						        {SEVERITY_STRING_MAP.get(1)}
						      </Checkbox>
						      {' '}
						      <Checkbox inline value={2} inputRef={ref => { this.warningCheckbox = ref; }}>
						        {SEVERITY_STRING_MAP.get(2)}
						      </Checkbox>
						      {' '}
						      <Checkbox inline value={3} inputRef={ref => { this.minorCheckbox = ref; }}>
						        {SEVERITY_STRING_MAP.get(3)}
						      </Checkbox>
						      {' '}
						      <Checkbox inline value={4} inputRef={ref => { this.majorCheckbox = ref; }}>
						        {SEVERITY_STRING_MAP.get(4)}
						      </Checkbox>
						      {' '}
						      <Checkbox inline value={5} inputRef={ref => { this.criticalCheckbox = ref; }}>
						        {SEVERITY_STRING_MAP.get(5)}
						      </Checkbox>
						      {' '}
						      <Checkbox inline value={-1} inputRef={ref => { this.unknownCheckbox = ref; }}>
						        {SEVERITY_STRING_MAP.get(-1)}
						      </Checkbox>
						    </FormGroup>
						    <FormGroup>
						    	<ControlLabel>Alert time range</ControlLabel>
						    	<div>From <Datetime onChange={(e) => setState({alertTimeStart: e.valueOf()})}/></div>
						    	<div>To <Datetime onChange={(e) => setState({alertTimeEnd: e.valueOf()})}/></div>
						     </FormGroup>
						      <FormGroup>
						    	<ControlLabel>Receive time range</ControlLabel>
						    	<div>From <Datetime onChange={(e) => setState({receiveTimeStart: e.valueOf()})}/></div>
						    	<div>To <Datetime onChange={(e) => setState({receiveTimeEnd: e.valueOf()})}/></div>
						    </FormGroup>
						    <FormGroup controlId="alertMsgContains">
						      <ControlLabel>Alert message contains</ControlLabel>
						      <FormControl type="text" placeholder="Enter keyword" inputRef={ref => { this.alertMsgContains = ref; }}/>
						    </FormGroup>
          				</div>
          			</Modal.Body>
          			<Modal.Footer>
        				<Button bsStyle="primary" onClick={this.addFilter}>Add</Button>
      				</Modal.Footer>
				</Modal>
			</div>
			);
	}
}
export default ButtonGroup;