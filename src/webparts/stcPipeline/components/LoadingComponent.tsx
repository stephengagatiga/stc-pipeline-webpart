import * as React from 'react';
import styles from '../scss/StcPipeline.module.scss';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../redux/actions';

class LoadingComponent extends React.Component<any, any> {

    public render(): React.ReactElement<any> {
    return (
        <div className={ styles.stcPipeline }>
           <div className={styles.mainLoading}>
            <div className={styles.ldsEllipsis}><div></div><div></div><div></div><div></div></div>
            <div>This will take some time...</div>
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
  
export default connect(mapStateToProps,mapActionCreatorsToProps)(LoadingComponent);