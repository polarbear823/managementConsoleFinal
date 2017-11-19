import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import {Button, Modal, Grid, Col, Row} from 'react-bootstrap';
import {getSeverityClassName, SEVERITY_STRING_MAP} from '../configure_variables';

class AlertTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			showModal: false,
			shownAlert: null
		};
		this.close = this.close.bind(this);
		this.open = this.open.bind(this);
	}
	close(){
		this.setState({showModal: false});
	}
	open(row){
		this.setState({showModal: true, shownAlert: row});
	}
	render(){
		let showModal = false;
		const currentProps = this.props;
		const current = this;
		function onRowSelect(row, isSelected, e){
			currentProps.setSelectAlert(isSelected ? row : null);
		}
		function linkFormatter(cell){
			return cell.alert.href;
		}

		function severityFormatter(cell) {
			let blockCssClass = `block ${getSeverityClassName(cell)}`;
			return (
				<div>
				<div className={blockCssClass}></div>{SEVERITY_STRING_MAP.get(cell)}
				</div>
				);
		}
		function trSeverityFormat(rowData, rowIndex) {
			let severity = rowData.severity;
			return getSeverityClassName(severity);
		}
		const optionTime = {
		  year: 'numeric', month: 'numeric', day: 'numeric',
		  hour: 'numeric', minute: 'numeric', second: 'numeric',
		  hour12: false
		};
		function dateFormatter(cell, row) {
			let date = (new Date(cell));
			return date.toLocaleDateString('en-US', optionTime);
		}
		function linkDetailFormatter(cell, row) {
			return (
				<Button bsStyle="link" onClick={() => showDetailModal(row)}>{cell}</Button>
				)
		}

		function showDetailModal(row) {
			current.open(row);
		}

		function showDetails(alert) {
			let rows = [];
			for (let key in alert) {
				if (alert.hasOwnProperty(key)) {
					rows.push(
						<Row className="show-grid" key={key} className="table-border">
					      <Col xs={12} md={4} className="key-text">{key}</Col>
					      <Col xs={6} md={8} className="value-text">{alert[key]}</Col>
					    </Row>
						)
				}
			}
			return (
				<Grid className="grid">				
				    {rows}
			    </Grid>
				)
		}
		const selectRow = {
	  		mode: 'radio',
	  		bgColor: '#cce6ff',
	  		clickToSelect: true,
	  		onSelect: onRowSelect
		};
		const options = {
			searchPosition: 'left',
			//defaultSortName: 'receiveTime',
			defaultSortOrder: 'desc'
		};

		function getAlertTableColumn(columnName) {
			switch(columnName) {
				case 'alertUID':
					return (<TableHeaderColumn key={columnName} isKey dataField='alertUID' width="8%" dataSort dataFormat={ linkDetailFormatter } dataAlign="center">id</TableHeaderColumn>);
					break;
				case 'severity':
					return (<TableHeaderColumn key={columnName} dataField='severity' width="8%" dataSort dataFormat={severityFormatter}>Severity</TableHeaderColumn>);
					break;
				case 'alertObj':
					return (<TableHeaderColumn key={columnName} dataField='alertObj' width="15%" dataSort >Ip</TableHeaderColumn>);
					break;
				case 'alertTime':
					return (<TableHeaderColumn key={columnName} dataField='alertTime'dataSort dataFormat={ dateFormatter }>Alert Time</TableHeaderColumn>);
					break;
				case 'receiveTime':
					return (<TableHeaderColumn key={columnName} dataField='receiveTime' dataSort dataFormat={ dateFormatter }>Receive time</TableHeaderColumn>);
					break;
				case 'alertMsg':
					return (<TableHeaderColumn key={columnName} dataField='alertMsg'>Alert detail</TableHeaderColumn>);
					break;
				default:
			}
		}
		return (
			<div>		
			<BootstrapTable data={ this.props.alerts } selectRow={ selectRow } hover options={options} search tableHeaderClass='header-style'>
				{this.props.currentView.showProperties.map(colName => getAlertTableColumn(colName))}
			</BootstrapTable>
			<Modal show={this.state.showModal} onHide={this.close}>
					<Modal.Header closeButton>
            			<Modal.Title>Alert Detail: {this.state.shownAlert === null ? "" : this.state.shownAlert.id}</Modal.Title>
          			</Modal.Header>
          			<Modal.Body>
          				{showDetails(this.state.shownAlert)}
          			</Modal.Body>
         			
			</Modal>
			</div>
			);
	}
}

export default AlertTable;