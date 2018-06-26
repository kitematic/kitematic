import classNames from "classnames";
import { remote } from "electron";
import { Component } from "react";
import RetinaImage from "react-retina-image";
import Router from "react-router";
import React from "react/addons";
import accountActions from "../actions/AccountActions";
import accountStore from "../stores/AccountStore";
import metrics from "../utils/MetricsUtil";
import util from "../utils/Util";
export default class Header extends Component {
    constructor(props) {
        super(props);
        this.mixins = [Router.Navigation];
        this.state = new HeaderState();
    }
    componentDidMount() {
        document.addEventListener("keyup", this.handleDocumentKeyUp, false);
        accountStore.listen(this.update);
    }
    componentWillUnmount() {
        document.removeEventListener("keyup", this.handleDocumentKeyUp, false);
        accountStore.unlisten(this.update);
    }
    update() {
        const accountState = accountStore.getState();
        this.setState({
            username: accountState.username,
            verified: accountState.verified,
        });
    }
    handleDocumentKeyUp(e) {
        if (e.keyCode === 27 && remote.getCurrentWindow().isFullScreen()) {
            remote.getCurrentWindow().setFullScreen(false);
            this.forceUpdate();
        }
    }
    handleClose() {
        if (util.isWindows() || util.isLinux()) {
            remote.getCurrentWindow().close();
        }
        else {
            remote.getCurrentWindow().hide();
        }
    }
    handleMinimize() {
        remote.getCurrentWindow().minimize();
    }
    handleFullscreen() {
        if (util.isWindows()) {
            if (remote.getCurrentWindow().isMaximized()) {
                remote.getCurrentWindow().unmaximize();
            }
            else {
                remote.getCurrentWindow().maximize();
            }
            this.setState({
                fullscreen: remote.getCurrentWindow().isMaximized(),
            });
        }
        else {
            remote.getCurrentWindow().setFullScreen(!remote.getCurrentWindow().isFullScreen());
            this.setState({
                fullscreen: remote.getCurrentWindow().isFullScreen(),
            });
        }
    }
    handleFullscreenHover() {
        this.update();
    }
    handleUserClick(e) {
        const menu = new remote.Menu();
        if (!this.state.verified) {
            menu.append(new remote.MenuItem({ label: "I've Verified My Email Address", click: this.handleVerifyClick }));
        }
        menu.append(new remote.MenuItem({ label: "Sign Out", click: this.handleLogoutClick }));
        menu.popup({
            window: remote.getCurrentWindow(),
            x: e.currentTarget.offsetLeft,
            y: e.currentTarget.offsetTop + e.currentTarget.clientHeight + 10,
        });
    }
    handleLoginClick() {
        this.transitionTo("login");
        metrics.track("Opened Log In Screen");
    }
    handleLogoutClick() {
        metrics.track("Logged Out");
        accountActions.logout();
    }
    handleVerifyClick() {
        metrics.track("Verified Account", {
            from: "header",
        });
        accountActions.verify();
    }
    renderLogo() {
        return (<div className="logo">
				<RetinaImage src="logo.png"/>
			</div>);
    }
    renderWindowButtons() {
        if (util.isWindows()) {
            return (<div className="windows-buttons">
					<div className="windows-button button-minimize enabled" onClick={this.handleMinimize}>
						<div className="icon"></div>
					</div>
					<div className={`windows-button ${this.state.fullscreen ? "button-fullscreenclose" : "button-fullscreen"} enabled`} onClick={this.handleFullscreen}>
						<div className="icon"></div>
					</div>
					<div className="windows-button button-close enabled" onClick={this.handleClose}></div>
				</div>);
        }
        else {
            return (<div className="buttons">
					<div className="button button-close enabled" onClick={this.handleClose}></div>
					<div className="button button-minimize enabled" onClick={this.handleMinimize}></div>
					<div className="button button-fullscreen enabled" onClick={this.handleFullscreen}></div>
				</div>);
        }
    }
    renderDashboardHeader() {
        const headerClasses = classNames({
            "bordered": !this.props.hideLogin,
            "header": true,
            "no-drag": true,
        });
        let username;
        if (this.props.hideLogin) {
            username = null;
        }
        else if (this.state.username) {
            username = (<div className="login-wrapper">
					<div className="login no-drag" onClick={this.handleUserClick}>
						<span className="icon icon-user"></span>
						<span className="text">
				{this.state.username}
							{this.state.verified ? null : "(Unverified)"}
				</span>
						<RetinaImage src="userdropdown.png"/>
					</div>
				</div>);
        }
        else {
            username = (<div className="login-wrapper">
					<div className="login no-drag" onClick={this.handleLoginClick}>
						<span className="icon icon-user"></span> LOGIN
					</div>
				</div>);
        }
        return (<div className={headerClasses}>
				<div className="left-header">
					{util.isWindows() ? this.renderLogo() : this.renderWindowButtons()}
					{username}
				</div>
				<div className="right-header">
					{util.isWindows() ? this.renderWindowButtons() : this.renderLogo()}
				</div>
			</div>);
    }
    renderBasicHeader() {
        const headerClasses = classNames({
            "bordered": !this.props.hideLogin,
            "header": true,
            "no-drag": true,
        });
        return (<div className={headerClasses}>
				<div className="left-header">
					{util.isWindows() ? null : this.renderWindowButtons()}
				</div>
				<div className="right-header">
					{util.isWindows() ? this.renderWindowButtons() : null}
				</div>
			</div>);
    }
    render() {
        if (this.props.hideLogin) {
            return this.renderBasicHeader();
        }
        else {
            return this.renderDashboardHeader();
        }
    }
}
export class HeaderState {
    constructor() {
        this.fullscreen = false;
        this.updateAvailable = false;
        this.username = accountStore.getState().username;
        this.verified = accountStore.getState().verified;
    }
}
//# sourceMappingURL=Header.react.jsx.map