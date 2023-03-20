import * as React from 'react';
import styles from '../scss/StcPipeline.module.scss';
import {VIEWS} from '../utils/constant';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../redux/actions';

class NewAccountSuccess extends React.Component<any, any> {

    onOkClick = () => {
        this.props.ChangeView(VIEWS.opportunityList);
    }

    public render(): React.ReactElement<any> {
    return (
        <div className={ styles.stcPipeline }>
            <h1>Account information saved</h1>
            <p>
                The system will notify you if the new account is approved by the administrator.
                <br/>
                This is to ensure that the account information is properly filled up.
                <br/>
                Only approved accounts are shown in the account list.
                <br/>
                <br/>
                You may contact the administrator if you have any concerns. Thank you!
            </p>
            <div className={`${styles.row}`}>
              <div onClick={this.onOkClick} className={`${styles.stcButtonPrimary} ${styles.leftAuto}`}>Ok</div>
            </div>
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
  
export default connect(mapStateToProps,mapActionCreatorsToProps)(NewAccountSuccess);