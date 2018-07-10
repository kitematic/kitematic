import Router from "react-router";
import React from "react/addons";
import _ from "underscore";
import validator from "validator";
import accountActions from "../actions/AccountActions";
import metrics from "../utils/MetricsUtil";

export default React.createClass({
	mixins: [Router.Navigation, React.addons.LinkedStateMixin],

	getInitialState() {
		return {
			username: "",
			password: "",
			email: "",
			subscribe: true,
			errors: {},
		};
	},

	componentDidMount() {
		React.findDOMNode(this.refs.usernameInput).focus();
	},

	componentWillReceiveProps(nextProps) {
		this.setState({errors: nextProps.errors});
	},

	validate() {
		let errors = {} as any;
		if (!validator.isLowercase(this.state.username) || !validator.isAlphanumeric(this.state.username) || !validator.isLength(this.state.username, 4, 30)) {
			errors.username = "Must be 4-30 lower case letters or numbers";
		}

		if (!validator.isLength(this.state.password, 5)) {
			errors.password = "Must be at least 5 characters long";
		}

		if (!validator.isEmail(this.state.email)) {
			errors.email = "Must be a valid email address";
		}
		return errors;
	},

	handleBlur() {
		this.setState({errors: _.omit(this.validate(), (val, key) => !this.state[key].length)});
	},

	handleSignUp() {
		let errors = this.validate();
		this.setState({errors});

		if (_.isEmpty(errors)) {
			accountActions.signup(this.state.username, this.state.password, this.state.email, this.state.subscribe);
			metrics.track("Clicked Sign Up");
		}
	},

	handleClickLogin() {
		if (!this.props.loading) {
			this.replaceWith("login");
			metrics.track("Switched to Log In");
		}
	},

	onUsernameChange(event) {
		this.setState({username: event.target.value});
	},

	onEmailChange(event) {
		this.setState({email: event.target.value});
	},

	onPasswordChange(event) {
		this.setState({password: event.target.value});
	},

	onSubscribeChange(event) {
		this.setState({subscribe: event.target.checked});
	},

	render() {
		let loading = this.props.loading ? <div className="spinner la-ball-clip-rotate la-dark"><div></div></div> : null;
		return (
			<form className="form-connect" onSubmit={this.handleSignUp}>
				<input ref="usernameInput" maxLength={30} name="username" placeholder="Username" type="text" disabled={this.props.loading} value={this.state.username} onChange={this.onUsernameChange} onBlur={this.handleBlur}/>
				<p className="error-message">{this.state.errors.username}</p>
				<input ref="emailInput" name="email" placeholder="Email" type="text" value={this.state.em} onChange={this.onEmailChange} disabled={this.props.loading} onBlur={this.handleBlur}/>
				<p className="error-message">{this.state.errors.email}</p>
				<input ref="passwordInput" name="password" placeholder="Password" type="password" value={this.state.password} onChange={this.onPasswordChange} disabled={this.props.loading} onBlur={this.handleBlur}/>
				<p className="error-message">{this.state.errors.password}</p>
				<div className="checkbox">
					<label>
						<input type="checkbox" disabled={this.props.loading} value={this.state.subscribe} onChange={this.onSubscribeChange}/> Subscribe to the Docker newsletter.
					</label>
				</div>
				<p className="error-message">{this.state.errors.detail}</p>
				<div className="submit">
					{loading}
					<button className="btn btn-action" disabled={this.props.loading} type="submit">Sign Up</button>
				</div>
				<br/>
				<div className="extra">Already have an account? <a onClick={this.handleClickLogin}>Log In</a></div>
			</form>
		);
	},
});