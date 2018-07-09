import React from 'react/addons';
import request from 'request';
import metrics from '../utils/MetricsUtil';
import ContainerHomeWebPreview from './ContainerHomeWebPreview.react.jsx';
import ContainerHomeIpPortsPreview from './ContainerHomeIpPortsPreview.react.jsx';

export default React.createClass({
	contextTypes: {
		router: React.PropTypes.func
	},

	reload: function () {
		const webview = document.getElementById('webview');
		if (webview) {
			const url = (webview as any).src;
			request(url, err => {
				if (err && err.code === 'ECONNREFUSED') {
					setTimeout(this.reload, 2000);
				} else {
					try {
						(webview as any).reload();
					} catch (err) {}
				}
			});
		}
	},

	componentWillUnmount: function () {
		clearInterval(this.timer);
	},

	handleClickPortSettings: function () {
		metrics.track('Viewed Port Settings', {
			from: 'preview'
		});
		this.context.router.transitionTo('containerSettingsPorts', {name: this.context.router.getCurrentParams().name});
	},

	render: function () {
		let preview;
		if (this.props.defaultPort) {
			preview = (<ContainerHomeWebPreview ports={this.props.ports} defaultPort={this.props.defaultPort} handleClickPortSettings={this.handleClickPortSettings}/>);
		} else {
			preview = (<ContainerHomeIpPortsPreview ports={this.props.ports} handleClickPortSettings={this.handleClickPortSettings}/>);
		}
		return preview;
	}
});
