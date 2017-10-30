import React, { Component } from 'react';
import Login from './Login.jsx';
import AlertList from './AlertList.jsx';
import PreprocRuleList from './PreprocRuleList.jsx';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

export default class App extends Component {
  render() {
    return (
		<div>
			<BrowserRouter>
			<div>
				<Switch>
				<Route path="/list" component={AlertList} />
				<Route path="/preproclist" component={PreprocRuleList} />
				<Route exact path="/" component={Login} />
				</Switch>
			</div>
			</BrowserRouter>
		</div>
    );
  }
}