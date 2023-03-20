import * as React from 'react';
import styles from '../scss/StcPipeline.module.scss';
import {VIEWS,STATUS} from '../utils/constant';
import {computeDealSize} from '../utils/utils';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../redux/actions';
import * as moment from 'moment';
import numeral from 'numeral';

class SelectOpportunityComponent extends React.Component<any, any> {

    onCancelClick = () => {
        this.props.ChangeView(VIEWS.goBack);
    }

    onNewOpportunityClick = () => {

       
        let newOpportunity = {
          id: -1,
          accountId: this.props.reducer.opportunity.accountId,
          account: this.props.reducer.opportunity.account,
          bigDealCode: "",
          dealSize: 0,
          totalQty: 0,
          created: new Date(),
          createdBy: this.props.reducer.currentUser,
          modified: new Date(),
          modifiedBy: this.props.reducer.currentUser,
          status: 0,
          components: []
      };

      this.props.SelectSecondOpportunity(newOpportunity);

    }

    onOpportunityClick = (e) => {
      let opportunity = this.props.reducer.opportunities.filter(o => o.id == e.currentTarget.getAttribute("data-id"))[0];
      this.props.SelectSecondOpportunity(opportunity);
    }

    getDealSize = (opportunity) => {
      let deal = computeDealSize(opportunity);
      if (deal >= 1000000) {
        return numeral(deal).format('0.00a');
      } else if (deal >= 1000) {
         return numeral(deal).format('0a');
      } else {
        return deal;
      }
    }
  
    getHighestComponentByPrice = (opportunity) => {
      let x = opportunity.components[0];
      opportunity.components.forEach(c => {
        if ( (c.pricePerUnit * c.qty) > (x.pricePerUnit * x.qty)) {
          x = c;
        }
      });
      return x;
    }

    public render(): React.ReactElement<any> {
      let opportunities = this.props.reducer.opportunities.filter(i => 
        i.accountId == this.props.reducer.opportunity.accountId && i.id != this.props.reducer.opportunity.id)
    return (
        <div className={ styles.stcPipeline }>
          <div className={styles.row}>
            <h1>Select Opportunity</h1>
          </div>

            <table className={styles.simpleList}>
              <thead>
                <tr>
                  <td>Account</td>
                  <td>Deal Size</td>
                  <td>Status</td>
                  <td>Description</td>
                  <td>Stage</td>
                  <td>Target Close Date</td>
                </tr>
              </thead>
              <tbody>
                {
                  opportunities.filter(o => o.status != STATUS.indexOf("For Approval")).map(opportunity => 
                    <tr key={opportunity.id} onClick={this.onOpportunityClick} data-id={opportunity.id}>
                      <td>{opportunity.account.name}</td>
                      <td>₱{this.getDealSize(opportunity)}</td>
                      <td>{STATUS[opportunity.status]}</td>
                      <td>{this.getHighestComponentByPrice(opportunity).description}</td>
                      <td>{this.props.reducer.stages.filter(s => s.id == this.getHighestComponentByPrice(opportunity).stageId)[0].name} ({this.props.reducer.stages.filter(s => s.id == this.getHighestComponentByPrice(opportunity).stageId)[0].percentage}%)</td>
                      <td>{this.getHighestComponentByPrice(opportunity).targetCloseDate == null || this.getHighestComponentByPrice(opportunity).targetCloseDate == "1899-12-01T00:00:00" ? "" : moment(this.getHighestComponentByPrice(opportunity).targetCloseDate).format('MMMM YYYY')}</td>
                    </tr>
                  )
                }
              </tbody>
            </table>

            <div className={`${styles.rowRight}`}>
                <div onClick={this.onCancelClick} className={`${styles.stcButtonSecondary} ${styles.mr5}`}>Cancel</div>
                <div onClick={this.onNewOpportunityClick} className={`${styles.stcButtonPrimary}`}>New Opportunity</div>
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
  
export default connect(mapStateToProps,mapActionCreatorsToProps)(SelectOpportunityComponent);