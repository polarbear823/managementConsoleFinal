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
			selectAlert: null,
			showHideLoading: false,
			showHideNoMoreData: false
		};
		this.setSelectAlert = this.setSelectAlert.bind(this);
		this.loadTableData = this.loadTableData.bind(this);
		this.loadMoreTableData = this.loadMoreTableData.bind(this);
	}
	render(){
		return (
			<div className="alert-list-panel">
				<NavBar />
				<ButtonGroup selectAlert={this.state.selectAlert} alerts={this.state.alerts} filteredlerts={this.state.filteredAlerts} refreshFilteredTable={(newAlerts) => this.refreshFilteredTable(newAlerts)} refreshTable={(newAlerts) => this.refreshTable(newAlerts)} showNoMoreData={(show) => this.showNoMoreData(show)}/>
				<div className="alerts-table" ref={ node => this.contentNode = node }>
				<AlertTable alerts={this.state.filteredAlerts} setSelectAlert={alert => this.setSelectAlert(alert)}/>
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
			this.loadTableData();
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
  		const alertListUrl = `${ROOT_API_URL}search/findByReceiveTime?startTime=${startDate.valueOf()}&endTime=${endDate.valueOf()}`;
	  	axios.get(alertListUrl)
	  	.then(response => {
	  		this.setState({alerts: response.data, filteredAlerts: response.data});
	  	})
	  	.catch(function(error){
	  		console.log(error);
	  	});
  }
  loadMoreTableData(startDate) {
  		let endDate = moment().endOf('day');
  		const alertListUrl = `${ROOT_API_URL}search/findByReceiveTime?startTime=${startDate.valueOf()}&endTime=${endDate.valueOf()}`;
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
    		this.loadMoreTableData(this.state.alerts[lastAlertIndex].receiveTime);
    	}
    }
  }
}

export default AlertList;