import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../redux/actions';
import {VIEWS,STATUS_QUO} from '../utils/constant';

import OpportunityListComponent from '../components/OpportunityListComponent';
import AccountSelectionComponent from './AccountSelectionComponent';
import NewAccountComponent from '../components/NewAccountComponent';
import NewAccountSuccess from '../components/NewAccountSuccess';
import NewOpportunityComponent from '../components/NewOpportunityComponent';
import NewComponentComponent from '../components/NewComponentComponent';
import ViewComponentComponent from '../components/ViewComponentComponent';
import ViewOpportunityComponent from '../components/ViewOpportunityComponent';
import EditComponentComponent from '../components/EditComponentComponent';
import SelectOpportunityComponent from '../components/SelectOpportunityComponent';
import MoveComponentComponent from '../components/MoveComponentComponent';
import LoadingComponent from '../components/LoadingComponent';
import UserNotAllowed from '../components/UserNotAllowed';
import AppCrashComponent from '../components/AppCrashComponent';

class ComponentSwitch extends React.Component<any, any> {

  componentDidMount() {

    //There are all HTTP that the app need to call
    //There are all need to run properly the app 
    //If one of thess HTTP request is failed that app will not load
    if (this.props.reducer.currentUserStatus == STATUS_QUO) {
      this.props.GetUserInfo();
    }
    if (this.props.reducer.stagesStatus == STATUS_QUO) {
      this.props.GetAllStages();
    }
    if (this.props.reducer.productsStatus == STATUS_QUO) {
      this.props.GetAllProducts();
    }
    if (this.props.reducer.accountsStatus == STATUS_QUO) {
      this.props.GetAllAccounts();
    }
    if (this.props.reducer.categoriesStatus == STATUS_QUO) {
      this.props.GetAllCategories();
    }
    if (this.props.reducer.componentTypesStatus == STATUS_QUO) {
      this.props.GetAllComponentTypes();
    }
    if (this.props.reducer.opportunitiesStatus == STATUS_QUO) {
      this.props.GetAllOpportunities();
    }
    if (this.props.reducer.industriesStatus == STATUS_QUO) {
      this.props.GetAllIndustries();
    }
    if (this.props.reducer.requiredUsersStatus == STATUS_QUO) {
      this.props.GetRequiredUsers();
    }
  }

  public render(): React.ReactElement<any> {
      if (this.props.reducer.view == VIEWS.opportunityList) {
        return (<OpportunityListComponent />);
      } else if (this.props.reducer.view == VIEWS.accountSelection) {
        return (<AccountSelectionComponent />);
      } else if (this.props.reducer.view == VIEWS.newAccount) {
        return (<NewAccountComponent />);
      } else if (this.props.reducer.view == VIEWS.newAccountSuccess) {
        return (<NewAccountSuccess />);
      } else if (this.props.reducer.view == VIEWS.newOpportunity) {
        return (<NewOpportunityComponent />);
      } else if (this.props.reducer.view == VIEWS.newComponent) {
        return (<NewComponentComponent />);
      } else if (this.props.reducer.view == VIEWS.viewComponent) {
        return (<ViewComponentComponent />);
      } else if (this.props.reducer.view == VIEWS.viewOpportunity) {
        return (<ViewOpportunityComponent />);
      } else if (this.props.reducer.view == VIEWS.editComponent) {
        return (<EditComponentComponent />);
      } else if (this.props.reducer.view == VIEWS.selectOpportunityComponent) {
        return (<SelectOpportunityComponent />);
      } else if (this.props.reducer.view == VIEWS.moveComponent) {
        return (<MoveComponentComponent />);
      } else if (this.props.reducer.view == VIEWS.loadingScreen) {
        return (<LoadingComponent />);
      } else if (this.props.reducer.view == VIEWS.userNotAllowed) {
        return (<UserNotAllowed />);
      } else if (this.props.reducer.view == VIEWS.appCrashed) {
        return (<AppCrashComponent />);
      } else {
        return (<div><p>No component found!</p></div>);
      }
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
  
export default connect(mapStateToProps,mapActionCreatorsToProps)(ComponentSwitch);