import * as React from 'react';
import styles from '../scss/StcPipeline.module.scss';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../redux/actions';

//Component to show when the applicaton crash commonly due to error in HTTP request
class AppCrashComponent extends React.Component<any, any> {

    componentDidMount() {
        //So when this component there is something went wrong so you need to stop some changes in the state
        this.props.ApplicationCrashed();
    }

    public render(): React.ReactElement<any> {
    return (
        <div className={ styles.stcPipeline }>
            <div className={styles.messageError}>
                <h1>The application crashed!</h1>
                <p>There something went wrong when {this.props.reducer.lastAction}.</p>
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
    
  export default connect(mapStateToProps,mapActionCreatorsToProps)(AppCrashComponent);