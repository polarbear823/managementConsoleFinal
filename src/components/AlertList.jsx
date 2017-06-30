import React, { Component } from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import SearchBar from './SearchBar.jsx';
import ButtonGroup from './ButtonGroup.jsx';
import AlertTable from './AlertTable.jsx';
import NavBar from './NavBar.jsx';

const ROOT_API_URL = "http://192.168.1.200:8080/api/";
class AlertList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			alerts: [],
			selectAlert: null
		};
		this.setSelectAlert = this.setSelectAlert.bind(this);
		this.loadTableData = this.loadTableData.bind(this);
	}
	render(){
		return (
			<div className="alert-list-panel">
				<NavBar />
				<ButtonGroup selectAlert={this.state.selectAlert} refreshTable={(newAlerts) => this.refreshTable(newAlerts)}/>
				<div className="alerts-table">
				<AlertTable alerts={this.state.alerts} setSelectAlert={alert => this.setSelectAlert(alert)}/>
				</div>
			</div>
			);
	}

	setSelectAlert(alert) {
		this.setState({selectAlert: alert});
	}

	refreshTable(newAlerts) {
		this.setState({alerts: newAlerts});
	}

	componentDidMount() {
	  	this.loadTableData();
  }
  loadTableData() {
  		const alertListUrl = `${ROOT_API_URL}alerts`;
	  	axios.get(alertListUrl)
	  	.then(response => {
	  		this.setState({alerts: response.data._embedded.alerts});
	  	})
	  	.catch(function(error){
	  		console.log(error);
	  	});
  }
}

export default AlertList;