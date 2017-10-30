import React, { Component } from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import NavBar from './NavBar.jsx';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import {Button, Modal, Grid, Col, Row, Radio, FormGroup, ControlLabel, FormControl, DropdownButton, MenuItem} from 'react-bootstrap';
import {ROOT_PREPROC_RULES_URL, SEVERITY_STRING_MAP} from '../configure_variables';

const ADD_MODE = "ADD";
const EDIT_MODE = "EDIT";
const ENABLE = "enable";
const DISCARD = "discard";
const SYSLOG = "syslog";
const TRAP = "trap";
class PreprocRuleList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			preProcRuleList: [],
			selectedPreprocRule: null,
			showDeleteModal: false,
			showEditModal: false,
			showDetailModal: false,
			mode: ADD_MODE,
			ruleType: "syslog"
		};
		this.closeDeleteModal = this.closeDeleteModal.bind(this);
		this.openDeleteModal = this.openDeleteModal.bind(this);
		this.closeAddEditModal = this.closeAddEditModal.bind(this);
		this.openAddEditModal = this.openAddEditModal.bind(this);
		this.openDetailModal = this.openDetailModal.bind(this);
		this.closeDetailModal = this.closeDetailModal.bind(this);
		this.loadRuleTableData = this.loadRuleTableData.bind(this);
		this.showDetails = this.showDetails.bind(this);
		this.deleteRule = this.deleteRule.bind(this);
		this.handleRuleTypeChange = this.handleRuleTypeChange.bind(this);
		this.saveRule = this.saveRule.bind(this);
		this.saveRuleTest  = this.saveRuleTest.bind(this);
		this.setValueToForm = this.setValueToForm.bind(this);
	}

	setValueToForm(rule) {
		this.ruleName.value = rule.ruleName;
		this.ruleType.value = rule.ruleType;
		this.ruleSeq.value = rule.ruleSeq;
		this.enable.checked = rule.active;
		this.disable.checked = !rule.active
		DISCARD === rule.procMode ? this.discard.checked = true : this.process.checked = true;
		this.alertSeverity.value = rule.alertSeverity;
		this.receiveTimeFormat.value = rule.receiveTimeFormat;
		this.ruleVariables.value = rule.ruleVariables;
		this.ruleFields.value = rule.ruleFields;
		if (SYSLOG === rule.ruleType) {
			this.syslogMatchPattern.value = rule.syslogMatchPattern;
			this.syslogMatchNode.value = rule.syslogMatchNode;
		} else if (TRAP === rule.ruleType) {
			this.trapSeparator.value = rule.trapSeparator;
			this.trapCondition.value = rule.trapCondition;
		}
	}

	openDeleteModal(rule){
		this.setState({showDeleteModal: true, selectedPreprocRule: rule});
	}
	closeDeleteModal(){
		this.setState({showDeleteModal: false});
	}
	openAddEditModal(rule, openMode){
		this.setState({showEditModal: true, mode: openMode});
		if (openMode === ADD_MODE) {
			let emptyRule = {
				ruleType: "syslog",
				ruleName: "",
				ruleSeq: "",
				active: false,
				procMode: DISCARD,
				alertSeverity: "0",
				receiveTimeFormat:"",
				ruleVariables: "",
				ruleFields: "",
				syslogMatchPattern:"",
				syslogMatchNode:"",
				trapSeparator: "",
				trapCondition:""
			};
			this.setState({selectedPreprocRule: emptyRule});
			setTimeout(() => this.setValueToForm(emptyRule), 0);
		} else {
			this.setState({selectedPreprocRule: rule});
			setTimeout(() => this.setValueToForm(rule), 0);
		}
	}
	closeAddEditModal(){
		this.setState({showEditModal: false});
	}
	openDetailModal(rule){
		this.setState({showDetailModal: true, selectedPreprocRule: rule});
	}
	closeDetailModal(){
		this.setState({showDetailModal: false});
	}

	loadRuleTableData() {  		
  		const preprocRulesList = `${ROOT_PREPROC_RULES_URL}`;
	  	axios.get(preprocRulesList)
	  	.then(response => {
	  		this.setState({preProcRuleList: response.data});
	  	})
	  	.catch(function(error){
	  		console.log(error);
	  	});
  }
  componentDidMount() {
  	this.loadRuleTableData();
  }

  showDetails(rule) {
  	let rows = [];
			for (let key in rule) {
				if (rule.hasOwnProperty(key)) {
					if (key === "active"){
						rows.push(
						<Row className="show-grid" key={key} className="table-border">
					      <Col xs={12} md={4} className="key-text">{key}</Col>
					      <Col xs={6} md={8} className="value-text">{rule[key].toString()}</Col>
					    </Row>
						);
					} else if (key === "alertSeverity") {
						rows.push(
						<Row className="show-grid" key={key} className="table-border">
					      <Col xs={12} md={4} className="key-text">{key}</Col>
					      <Col xs={6} md={8} className="value-text">{SEVERITY_STRING_MAP.get(parseInt(rule[key]))}</Col>
					    </Row>
						);
					} else {
						rows.push(
						<Row className="show-grid" key={key} className="table-border">
					      <Col xs={12} md={4} className="key-text">{key}</Col>
					      <Col xs={6} md={8} className="value-text">{rule[key]}</Col>
					    </Row>
						);
					}
				}
			}
			return (
				<Grid className="grid">				
				    {rows}
			    </Grid>
				)
  }
  deleteRule() {
  	const deleteUrl = `${ROOT_PREPROC_RULES_URL}${this.state.selectedPreprocRule.ruleID}`;
	  	axios.delete(deleteUrl)
	  	.then(response => {
	  		this.closeDeleteModal();
	  		this.loadRuleTableData();
	  	})
	  	.catch(function(error){
	  		console.log(error);
	  	});
  }

  saveRule(e) {
  	e.preventDefault();
  	let newRule = {
  		ruleID: this.state.mode === ADD_MODE ? null : this.state.selectedPreprocRule.ruleID,
  		ruleType: this.ruleType.value,
		ruleName: this.ruleName.value,
		ruleSeq: this.ruleSeq.value,
		active: this.enable.checked,
		procMode: this.discard.checked ? this.discard.value : this.process.value,
		alertSeverity: this.alertSeverity.value,
		receiveTimeFormat: this.receiveTimeFormat.value,
		ruleVariables: this.ruleVariables.value,
		ruleFields: this.ruleFields.value,
		syslogMatchPattern: SYSLOG === this.ruleType.value ? this.syslogMatchPattern.value : null,
		syslogMatchNode: SYSLOG === this.ruleType.value ? this.syslogMatchNode.value : null,
		trapSeparator: TRAP === this.ruleType.value ? this.trapSeparator.value : null,
		trapCondition: TRAP === this.ruleType.value ? this.trapCondition.value : null
  	}
  	if (this.state.mode === ADD_MODE) {
  		const postUrl = ROOT_PREPROC_RULES_URL;
  		axios.post(postUrl, newRule)
  		.then(response => {
  			this.closeAddEditModal();
  			this.loadRuleTableData();
  		})
  		.catch(function(error){
	  		console.log(error);
	  	});
  	} else {
  		const putUrl = `${ROOT_PREPROC_RULES_URL}${this.state.selectedPreprocRule.ruleID}`;
  		axios.put(putUrl, newRule)
  		.then(response => {
  			this.closeAddEditModal();
  			this.loadRuleTableData();
  		})
  		.catch(function(error){
	  		console.log(error);
	  	});
  	}
  }

  saveRuleTest(e){
  	e.preventDefault();
  	console.log(this.ruleName.value);
  }

  handleRuleTypeChange(event) {
  	let rt = event.target.value;
  	this.setState({ruleType: rt});
  }

	render() {
		const current = this;
		const options = {
			searchPosition: 'left'
		};

		function linkDetailFormatter(cell, row) {
			return (
				<Button bsStyle="link" onClick={() => current.openDetailModal(row)}>{cell}</Button>
				)
		}
		function onRowSelect(row, isSelected, e){
			current.setState({selectedPreprocRule: isSelected ? row : null});
		}
		const selectRow = {
	  		mode: 'radio',
	  		bgColor: '#cce6ff',
	  		clickToSelect: true,
	  		onSelect: onRowSelect
		};
		return (
			<div>
			<NavBar />
			<Button bsStyle="primary" className="single-button" onClick={() => this.openAddEditModal(null, ADD_MODE)}>Add rule</Button>			
			<DropdownButton bsStyle="default" title="Action" id="action-button" disabled={this.state.selectedPreprocRule === null}>
		      <MenuItem eventKey="edit" onClick={() => this.openAddEditModal(this.state.selectedPreprocRule, this.EDIT)}>Edit rule</MenuItem>
		      <MenuItem eventKey="delete" onClick={() => this.openDeleteModal(this.state.selectedPreprocRule)}>Delete</MenuItem>
		    </DropdownButton>
			<div className='button-group'>
			<BootstrapTable data={ this.state.preProcRuleList } selectRow={ selectRow } hover options={options} search tableHeaderClass='header-style'>
				<TableHeaderColumn isKey dataField='ruleName' width="20%" dataSort dataFormat={ linkDetailFormatter }>Rule name</TableHeaderColumn>
				<TableHeaderColumn dataField='ruleType' width="20%" dataSort columnClassName='vertical-middle'>Rule type</TableHeaderColumn>
				<TableHeaderColumn dataField='active' width="20%" dataSort columnClassName='vertical-middle'>Active status</TableHeaderColumn>				
				<TableHeaderColumn dataField='ruleSeq' columnClassName='vertical-middle' >Rule sequence</TableHeaderColumn>
				<TableHeaderColumn dataField='procMode' columnClassName='vertical-middle'>Proc mode</TableHeaderColumn>
			</BootstrapTable>
			</div>
			<Modal show={this.state.showDetailModal} onHide={this.closeDetailModal}>
					<Modal.Header closeButton>
            			<Modal.Title>Rule Detail: {this.state.selectedPreprocRule === null ? "" : this.state.selectedPreprocRule.ruleName}</Modal.Title>
          			</Modal.Header>
          			<Modal.Body>
          				{this.showDetails(this.state.selectedPreprocRule)}
          			</Modal.Body>
         			
			</Modal>
			 <Modal show={this.state.showDeleteModal} onHide={this.closeDeleteModal}>
					<Modal.Header closeButton>
            			<Modal.Title>Delete rule: {this.state.selectedPreprocRule === null ? "" : this.state.selectedPreprocRule.ruleName}</Modal.Title>
          			</Modal.Header>
          			<Modal.Body>
          				<p>Are you sure you want to permanently delete this selected rule?</p>
          			</Modal.Body>
          			<Modal.Footer>
        				<Button bsStyle="danger" onClick={this.deleteRule}>Delete</Button>
      				</Modal.Footer>
			</Modal>
			<Modal show={this.state.showEditModal} onHide={this.closeAddEditModal}>
					<Modal.Header closeButton>
            			<Modal.Title>{this.state.mode === ADD_MODE ? "Add" : "Edit"} Rule {this.state.selectedPreprocRule === null ? "" : this.state.selectedPreprocRule.ruleName}</Modal.Title>
          			</Modal.Header>
          			<Modal.Body>
          				<form className="edit-content" onSubmit={this.saveRule}>
          					<FormGroup controlId="formControlsRuleName">
							    <ControlLabel>Rule name</ControlLabel>
							    <FormControl type="text" placeholder="Enter rule name" inputRef={ref => { this.ruleName = ref; }} />						        
							 </FormGroup>
							    <FormGroup controlId="formControlsSelect">
							      <ControlLabel>Rule type</ControlLabel>
							      <FormControl componentClass="select" placeholder="select rule type" onChange={this.handleRuleTypeChange} inputRef={ref => { this.ruleType = ref; }}>
							        <option value="syslog">syslog</option>
							        <option value="trap">trap</option>
							      </FormControl>
							    </FormGroup>
							    <FormGroup controlId="formControlsRuleSeq">
							      <ControlLabel>Rule sequence</ControlLabel>
							      <FormControl type="text" placeholder="Enter rule sequence" inputRef={ref => { this.ruleSeq = ref; }}/>						        
							    </FormGroup>
							    <FormGroup>
							      <ControlLabel>Use mode</ControlLabel>
							      {' '}
							      <Radio name="active" value={true} inline inputRef={ref => { this.enable = ref; }} >
							        enable
							      </Radio>
							      {' '}
							      <Radio name="active" value={false} inline inputRef={ref => { this.disable = ref; }}>
							        disable
							      </Radio>
							    </FormGroup>
							    <FormGroup controlId="formControlsProcMode">
							      <ControlLabel>Proc mode</ControlLabel>
							      {' '}
							      <Radio name="procMode" inline inputRef={ref => { this.discard = ref; }}  value="discard">
							        discard
							      </Radio>
							      {' '}
							      <Radio name="procMode" inline inputRef={ref => { this.process = ref; }} value="process">
							        process
							      </Radio>						        
							    </FormGroup>
							    <FormGroup controlId="formControlsAlertSeveritySelect">
							      <ControlLabel>Alert severity</ControlLabel>
							      <FormControl componentClass="select" placeholder="select alert severity" inputRef={ref => { this.alertSeverity = ref; }}>
							        <option value="1">Normal</option>
							        <option value="2">Warning</option>
							        <option value="3">Minor</option>
							        <option value="4">Major</option>
							        <option value="5">Critical</option>
							        <option value="-1">Unknown</option>
							      </FormControl>
							    </FormGroup>
							    <FormGroup controlId="formControlsReceiveTimeFormat">
								    <ControlLabel>Receive time format</ControlLabel>
								    <FormControl type="text" placeholder="Enter receive time format" inputRef={ref => { this.receiveTimeFormat = ref; }}/>						        
							 	</FormGroup>
							 	<FormGroup controlId="formControlsRuleVariables">
								    <ControlLabel>Rule variables</ControlLabel>
								    <FormControl type="text" placeholder="Enter rule variables" inputRef={ref => { this.ruleVariables = ref; }}/>						        
							 	</FormGroup>
							 	<FormGroup controlId="formControlsRuleFields">
								    <ControlLabel>Rule fields</ControlLabel>
								    <FormControl type="text" placeholder="Enter rule fields" inputRef={ref => { this.ruleFields = ref; }}/>						        
							 	</FormGroup>
							 	<div className={this.state.ruleType === SYSLOG ? "" : "hide"}>
									<FormGroup controlId="formControlsSyslogMatchPattern">
									    <ControlLabel>Syslog Match Pattern</ControlLabel>
									<FormControl type="text" placeholder="Enter match pattern" inputRef={ref => { this.syslogMatchPattern = ref; }} />						        
									</FormGroup>
									<FormGroup controlId="formControlsMatchNode">
										<ControlLabel>Match node</ControlLabel>
										<FormControl type="text" placeholder="Enter node name" inputRef={ref => { this.syslogMatchNode = ref; }}/>						        
									</FormGroup>
								</div>
								<div className={this.state.ruleType === TRAP ? "" : "hide"}>
									<FormGroup controlId="formControlsTrapSeparator">
										<ControlLabel>Trap separator</ControlLabel>
										<FormControl type="text" placeholder="Enter trap separator" inputRef={ref => { this.trapSeparator = ref; }}/>						        
									</FormGroup>
									<FormGroup controlId="formControlsTrapConditions">
										<ControlLabel>Trap conditions</ControlLabel>
										<FormControl type="text" placeholder="Enter trap conditions" inputRef={ref => { this.trapCondition = ref; }}/>						        
									</FormGroup>
								</div>
								<Button bsStyle="primary" type="submit">Save</Button>
          				</form>
          			</Modal.Body>
			</Modal>
			</div>
			);
	}
}

export default PreprocRuleList;