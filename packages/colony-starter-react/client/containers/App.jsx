import React, { Component } from 'react'
import { connect } from 'react-redux'
import { connectNetwork } from '../actions/networkActions'
import App from '../components/App'

class AppContainer extends Component {

  constructor(props) {
    super(props)
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      scroll(0,0)
    }
  }

  render() {
    return (
      <App
        connectNetwork={this.props.connectNetwork}
        connectNetworkError={this.props.connectNetworkError}
        connectNetworkLoading={this.props.connectNetworkLoading}
        connectNetworkSuccess={this.props.connectNetworkSuccess}
        networkClient={this.props.networkClient}
      />
    )
  }

}

const mapStateToProps = state => ({
  connectNetworkError: state.network.connectNetworkError,
  connectNetworkLoading: state.network.connectNetworkLoading,
  connectNetworkSuccess: state.network.connectNetworkSuccess,
  networkClient: state.network.networkClient,
})

const mapDispatchToProps = dispatch => ({
  connectNetwork(accountIndex) {
    dispatch(connectNetwork(accountIndex))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer)
