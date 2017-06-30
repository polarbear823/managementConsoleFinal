import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email: '',
			password: '',
			isRememberMe: false
		};
		this.onSubmit = this.onSubmit.bind(this);
		this.onEmailValueChange = this.onEmailValueChange.bind(this);
		this.onPasswordValueChange = this.onPasswordValueChange.bind(this);
		this.onRememberMeChange = this.onRememberMeChange.bind(this);
	}
	render(){
		return (
			<div className="container">
				<form className="form-signin" onSubmit={this.onSubmit}>
					<h2 className="form-signin-heading">Please sign in</h2>
					<label htmlFor="inputEmail" className="sr-only">Email address</label>
					<input type="email" id="inputEmail" className="form-control" placeholder="Email address" required autoFocus onChange={this.onEmailValueChange}/>
					<label htmlFor="inputPassword" className="sr-only">Password</label>
					<input type="password" id="inputPassword" className="form-control" placeholder="Password" required onChange={this.onPasswordValueChange}/>
					<div className="checkbox">
						<label>
							<input type="checkbox" value="remember-me" checked={this.state.isRememberMe} onChange={this.onRememberMeChange}/> Remember me
						</label>
					</div>
					<button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
				</form>
			</div>
		);
	}

	onSubmit(e) {
		e.preventDefault();
		console.log(this.state);
		this.props.history.push('/list');
	}

	onEmailValueChange(e) {
		this.setState({email: e.target.value});
	}

	onPasswordValueChange(e) {
		this.setState({password: e.target.value});
	}

	onRememberMeChange(e) {
		this.setState({isRememberMe: !this.state.isRememberMe});
	}
};
export default Login;