import * as React from 'react';
import styles from '../scss/StcPipeline.module.scss';

import {VIEWS} from '../utils/constant';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../redux/actions';

import {Dropdown} from './CommonComponents';

class AccountSelectionComponent extends React.Component<any, any> {

  state = {
    accountId: null,
    hasError: false,
    errorMessage: "",
  }

  onCancel = (e) => {
    e.preventDefault();
    this.props.ChangeView(VIEWS.goBack);
  }

  onCreateAccount = (e) => {
    e.preventDefault();
    this.props.ChangeView(VIEWS.newAccount);
  }

  onOkClick = () => {
    if (this.state.accountId != null) {
      let account = this.props.reducer.accounts.filter(a => a.id == this.state.accountId)[0];
      this.props.SelectNewOpportunityAccount(account,this.props.reducer.currentUser);
      this.props.ChangeView(VIEWS.newOpportunity);
    } else {
      this.setState({hasError: true, errorMessage: "No account selected" });
    }
  }

  onAccountChange = (account) => {
    this.setState({accountId: account});
  }
  
  public render(): React.ReactElement<any> {
    const {accountId,hasError,errorMessage} = this.state;

    return (
        <div className={ styles.stcPipeline }>
            <div className={`${styles.row}`}>
              <h1>Account Selection</h1>
              <div onClick={this.onCancel} className={`${styles.stcButtonSecondary} ${styles.leftAuto}`}>Cancel</div>
            </div>
            <div className={`${styles.row}`}>
              <label>Account</label>            
              <Dropdown items={this.props.reducer.accountsForSelection} placeholder="Select an account"
                flexGrow="true" onChange={this.onAccountChange} value={accountId} enableSearch="true" />
              <div onClick={this.onOkClick} className={`${styles.stcButtonPrimary}`} style={{marginLeft: '5px'}}>Ok</div>
            </div>
            <a onClick={this.onCreateAccount} href="#" className={styles.littleLink}>Dont see the account? Click here to create a new one.</a>
            {
                hasError &&
                <div className={styles.messageError}>
                    <p>{errorMessage}</p>
                </div>
            }
        </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    reducer: state
  };
}
  
function mapActionCreatorsToProps(dispatch) {
  let a : any = actions;
  return bindActionCreators(a,dispatch);
}
  
export default connect(mapStateToProps,mapActionCreatorsToProps)(AccountSelectionComponent);