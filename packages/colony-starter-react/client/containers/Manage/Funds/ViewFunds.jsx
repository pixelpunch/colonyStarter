import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getPots } from '../../../actions/fundsActions'
import ViewFunds from '../../../components/Manage/Funds/ViewFunds'

class ViewFundsContainer extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    if (this.props.pots === null) {
      this.props.getPots(this.props.colonyClient)
    }
  }

  componentDidUpdate() {
    if (this.props.pots === null && !this.props.getPotsLoading) {
      this.props.getPots(this.props.colonyClient)
    }
  }

  render() {
    return (
      <ViewFunds
        getPotsError={this.props.getPotsError}
        getPotsLoading={this.props.getPotsLoading}
        getPotsSuccess={this.props.getPotsSuccess}
        pots={this.props.pots}
      />
    )
  }

}

const mapStateToProps = state => ({
  colonyClient: state.colony.colonyClient,
  getPotsError: state.funds.getPotsError,
  getPotsLoading: state.funds.getPotsLoading,
  getPotsSuccess: state.funds.getPotsSuccess,
  pots: state.funds.pots,
})

const mapDispatchToProps = dispatch => ({
  getPots(colonyClient) {
    dispatch(getPots(colonyClient))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(ViewFundsContainer)
