import * as React from 'react';
import styles from '../scss/StcPipeline.module.scss';
import {ALLOWED_ROLES} from '../utils/constant';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../redux/actions';

//Component to show when the current user role is not set in ALLOWED_ROLES
class UserNotAllowed extends React.Component<any, any> {

    public render(): React.ReactElement<any> {
    return (
        <div className={ styles.stcPipeline }>
            <h1>Unauthorized User!</h1>
            <p>
              You dont have permission to use this app!
              <br/>
              Please contact the administrator if you wish to have an access on this.
              </p>
            {/* This is why you need first to set the user info before displaying this component */}
            <p>
              {
                this.props.reducer.currentUser.role == null ?
                `You dont have role set`
                :
                `Your role: ${this.props.reducer.currentUser.role.name}`
              }
            </p>
            <p>
              Allowed role:
              <ul>
                {
                  ALLOWED_ROLES.map((r,i) => <li key={i}>{r}</li>)
                } 
              </ul>
            </p>
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
    
  export default connect(mapStateToProps,mapActionCreatorsToProps)(UserNotAllowed);