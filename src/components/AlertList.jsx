import React, { Component } from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
import moment from 'moment';
import SearchBar from './SearchBar.jsx';
import ButtonGroup from './ButtonGroup.jsx';
import AlertTable from './AlertTable.jsx';
import NavBar from './NavBar.jsx';
import {ROOT_ALERTS_API_URL} from '../configure_variables';

class AlertList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			alerts: [],
			filteredAlerts: [],
			selectAlert: null,
			showHideLoading: false,
			showHideNoMoreData: false,
			filterList: [],
			currentView: {viewName: "defaultView", showProperties: ["alertUID", "severity", "alertObj", "alertTime", "receiveTime", "alertMsg"]},
			viewList: []
		};
		this.setSelectAlert = this.setSelectAlert.bind(this);
		this.loadTableData = this.loadTableData.bind(this);
		this.loadMoreTableData = this.loadMoreTableData.bind(this);
	}
	render(){
		return (
			<div>
				<NavBar />
				<ButtonGroup selectAlert={this.state.selectAlert} 
							 alerts={this.state.alerts} 
							 filteredlerts={this.state.filteredAlerts} 
							 refreshFilteredTable={(newAlerts) => this.refreshFilteredTable(newAlerts)} 
							 refreshTable={(newAlerts) => this.refreshTable(newAlerts)} 
							 showNoMoreData={(show) => this.showNoMoreData(show)} 
							 filterList={this.state.filterList} 
							 viewList={this.state.viewList} 
							 currentView={this.state.currentView}
							 onViewItemClicked={(viewName) => this.onViewItemClicked(viewName)}
							 deleteAlert={(alert) => this.deleteMockAlert(alert)}/>
				<div className="alerts-table" ref={ node => this.contentNode = node }>
				<AlertTable alerts={this.state.filteredAlerts} 
							setSelectAlert={alert => this.setSelectAlert(alert)}
							currentView = {this.state.currentView}/>
				</div>
				{
					this.state.showHideLoading ? <div>Loading...</div> : null
				}
				{
					this.state.showHideNoMoreData ? <div>No more data</div> : null
				}
			</div>
			);
	}

	deleteMockAlert(mockAlert) {
		this.setState({
			alerts: this.state.alerts.filter(alert => alert.alertUID != mockAlert.alertUID), 
			filteredAlerts: this.state.filteredAlerts.filter(alert => alert.alertUID != mockAlert.alertUID)});
	}

	onViewItemClicked(viewName) {
		console.log(this.state.viewList);
		let currentView = this.state.viewList.filter(view => view.viewName === viewName)[0];
		this.setState({currentView});
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

	showNoMoreData(show) {
		this.setState({showHideNoMoreData: show});
	}

	componentDidMount() {
		if (this.contentNode) {
			this.contentNode.addEventListener('scroll', this.onScrollHandle.bind(this));
			this.loadMockTableData();
		}
		//setInterval(this.loadTableData, 30000);
  	}
  	componentWillUnmount() {
	    if (this.contentNode) {
	      this.contentNode.removeEventListener('scroll', this.onScrollHandle.bind(this));
	    }
    }
  loadTableData() {
  		let startDate = moment().subtract(29, 'days');
  		let endDate = moment().endOf('day');
  		const alertListUrl = `${ROOT_ALERTS_API_URL}search/findByReceiveTime?startTime=${startDate.valueOf()}&endTime=${endDate.valueOf()}`;
	  	axios.get(alertListUrl)
	  	.then(response => {
	  		this.setState({alerts: response.data, filteredAlerts: response.data});
	  	})
	  	.catch(function(error){
	  		console.log(error);
	  	});
  }

  loadMockTableData() {
  	const alertsList = [
  		{
  			alertUID: 1,
  			severity: 1,
  			alertObj: "255.255.255.0",
  			alertTime: 1511151440000,
  			receiveTime: 1511151713000,
  			alertMsg: "some message about alert"
  		},
  		{
  			alertUID: 2,
  			severity: 2,
  			alertObj: "255.255.255.1",
  			alertTime: 1511151440000,
  			receiveTime: 1511151713000,
  			alertMsg: "some message about alert"
  		},
  		{
  			alertUID: 3,
  			severity: 3,
  			alertObj: "255.255.255.0",
  			alertTime: 1511151440000,
  			receiveTime: 1511151713000,
  			alertMsg: "some message about alert"
  		}
  	];
  	const filterList = [
  		"AllEvents",
  		"MinorSeverity"
  	];
  	const viewList = [
  		{
  			viewName: "defaultView",
  			showProperties: ["alertUID", "severity", "alertObj", "alertTime", "receiveTime", "alertMsg"]
  		},
  		{
  			viewName: "noTimeView",
  			showProperties: ["alertUID", "severity", "alertObj", "alertMsg"]
  		}
  	];
  	this.setState({alerts: alertsList, filteredAlerts: alertsList, filterList, viewList});
  }
  loadMoreTableData(startDate) {
  		let endDate = moment().endOf('day');
  		const alertListUrl = `${ROOT_ALERTS_API_URL}search/findByReceiveTime?startTime=${startDate.valueOf()}&endTime=${endDate.valueOf()}`;
	  	axios.get(alertListUrl)
	  	.then(response => {
	  		let newAlerts = [ ...new Set( [].concat( this.state.alerts, response.data ) ) ];
	  		this.setState({showHideLoading: false});
	  		if (response.data.length == 0) {
	  			this.setState({showHideNoMoreData: true});	  			
	  		}
	  		this.setState({alerts: newAlerts, filteredAlerts: newAlerts});
	  	})
	  	.catch(function(error){
	  		console.log(error);
	  	});
  }
  onScrollHandle(event) {
    const clientHeight = event.target.clientHeight
    const scrollHeight = event.target.scrollHeight
    const scrollTop = event.target.scrollTop
    const isBottom = (clientHeight + scrollTop === scrollHeight)
    if (isBottom) {
    	let lastAlertIndex = this.state.alerts.length - 1;
    	if (lastAlertIndex >= 0 && !this.state.showHideNoMoreData){
    		this.setState({showHideLoading: true});
    		console.log(this.state.alerts[lastAlertIndex].receiveTime);
    		//this.loadMoreTableData(this.state.alerts[lastAlertIndex].receiveTime);
    	}
    }
  }
}

export default AlertList;