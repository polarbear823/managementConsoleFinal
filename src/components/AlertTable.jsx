import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';

class AlertTable extends Component {
	render(){
		const currentProps = this.props;
		function onRowSelect(row, isSelected, e){
			currentProps.setSelectAlert(isSelected ? row : null);
			console.log(row);
		}
		function linkFormatter(cell){
			return cell.alert.href;
		}
		function trSeverityFormat(rowData, rowIndex) {
			if (rowData.severity == 1){
				return 'tr-severity-1';
			} else if (rowData.severity == 2) {
				return 'tr-severity-2';
			}
			return 'tr-severity-other';
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
		const selectRow = {
	  		mode: 'radio',
	  		bgColor: '#cce6ff',
	  		clickToSelect: true,
	  		onSelect: onRowSelect
		};
		const options = {
			searchPosition: 'left'
		};
		return (		
			<BootstrapTable data={ this.props.alerts } selectRow={ selectRow } trClassName={trSeverityFormat} hover pagination options={options} search>
				<TableHeaderColumn isKey dataField='_links' width="0" dataFormat={linkFormatter}>href</TableHeaderColumn>
				<TableHeaderColumn dataField='severity' width="8%" dataSort>Severity</TableHeaderColumn>
				<TableHeaderColumn dataField='timestamp' width="20%" dataSort dataFormat={ dateFormatter }>TimeStamp</TableHeaderColumn>
				<TableHeaderColumn dataField='receiveTime' width="20%" dataSort dataFormat={ dateFormatter }>Receive time</TableHeaderColumn>
				<TableHeaderColumn dataField='alertMsg'>Alert detail</TableHeaderColumn>
			</BootstrapTable>
			);
	}
}

export default AlertTable;