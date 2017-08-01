import React, { Component } from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import moment from 'moment';
import SearchBar from './SearchBar.jsx';
import ButtonGroup from './ButtonGroup.jsx';
import AlertTable from './AlertTable.jsx';
import NavBar from './NavBar.jsx';
import {ROOT_API_URL} from '../configure_variables'

class AlertList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			alerts: [],
			filteredAlerts: [],
			selectAlert: null
		};
		this.setSelectAlert = this.setSelectAlert.bind(this);
		this.loadTableData = this.loadTableData.bind(this);
	}
	render(){
		return (
			<div className="alert-list-panel">
				<NavBar />
				<ButtonGroup selectAlert={this.state.selectAlert} alerts={this.state.alerts} filteredlerts={this.state.filteredAlerts} refreshFilteredTable={(newAlerts) => this.refreshFilteredTable(newAlerts)} refreshTable={(newAlerts) => this.refreshTable(newAlerts)}/>
				<div className="alerts-table">
				<AlertTable alerts={this.state.filteredAlerts} setSelectAlert={alert => this.setSelectAlert(alert)}/>
				</div>
			</div>
			);
	}

	setSelectAlert(alert) {
		this.setState({selectAlert: alert});
	}

	refreshFilteredTable(newAlerts) {
		this.setState({filteredAlerts: newAlerts});
	}

	refreshTable(newAlerts) {
		this.setState({alerts: newAlerts});
	}

	componentDidMount() {
	  	this.loadTableData();
		setInterval(this.loadTableData, 30000);
  }
  loadTableData() {
  		let startDate = moment().subtract(29, 'days');
  		let endDate = moment().endOf('day');
  		const alertListUrl = `${ROOT_API_URL}search/findByAlertTime?startTime=${startDate.valueOf()}&endTime=${endDate.valueOf()}`;
	  	axios.get(alertListUrl)
	  	.then(response => {
	  		this.setState({alerts: response.data, filteredAlerts: response.data});
	  	})
	  	.catch(function(error){
	  		console.log(error);
	  	});
  }
}

export default AlertList;