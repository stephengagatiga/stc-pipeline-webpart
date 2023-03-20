import * as React from 'react';
import styles from '../scss/StcPipeline.module.scss';
import {VIEWS,STATUS,APPROVE,REJECT,GLOBAL_ADMIN} from '../utils/constant';
import {computeOpportunityProperty} from '../utils/utils';
import * as moment from 'moment';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../redux/actions';

import numeral from 'numeral';

class ViewOpportunityComponent extends React.Component<any, any> {

    interval = null;

    state = {
        time: null,
        grossProfit: 0,
        dealSize: 0,
    }

    onBack = () => {
        this.props.ChangeView(VIEWS.opportunityList);
    }

    onNewComponentClick = () => {
        this.props.ChangeView(VIEWS.newComponent);
    }

    onComponentClick = (e) => {
        let id = e.currentTarget.getAttribute("data-id");
        let component = this.props.reducer.opportunity.components.filter(c => c.id == id)[0];
        this.props.SelectComponent(component);
        this.props.ChangeView(VIEWS.viewComponent);
    }

    onMoveComponentClick = () => {
        this.props.ChangeView(VIEWS.selectOpportunityComponent);
    }

    onApprove = () => {
        this.props.ApproveOrRejectOpportunity(this.props.reducer.opportunity,APPROVE,this.props.reducer.opportunities);
    }

    onReject = () => {
        this.props.ApproveOrRejectOpportunity(this.props.reducer.opportunity,REJECT,this.props.reducer.opportunities);
    }

    componentDidMount() {
        this.interval = setInterval(() => this.setState({ time: Date.now() }), 60000);
        let computedOppValue = computeOpportunityProperty(this.props.reducer.opportunity);
        this.setState({grossProfit: computedOppValue.grossProfit, dealSize: computedOppValue.dealSize });
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        this.interval = null;
    }

    formatPrice = (price) => {
        if (price >= 1000000) {
          return numeral(price).format('0.00a');
        } else if (price >= 1000) {
           return numeral(price).format('0a');
        }  else {
          return price;
        }
      }


    public render(): React.ReactElement<any> {

        const { grossProfit, dealSize } = this.state;

    return (
        <div className={ styles.stcPipeline }>
            <div className={ styles.row }>
                <h1>Opportunity</h1>
                <div className={styles.leftAuto}>
                    {
                        this.props.reducer.opportunity.status != STATUS.indexOf("For Approval") && 
                        <a href="#" onClick={this.onMoveComponentClick}>Move Components</a>
                    }
                    {
                        this.props.reducer.opportunity.status != STATUS.indexOf("For Approval") && 
                        ` | `
                    }
                    {
                        this.props.reducer.opportunity.status == STATUS.indexOf("For Approval") && this.props.reducer.currentUser.role.name == GLOBAL_ADMIN ?
                        <span>
                           
                            <a href="#" onClick={this.onReject}>Reject</a>
                            {` | `}
                            <a href="#" onClick={this.onApprove}>Approve</a>
                        </span>
                        :
                        ''
                    }
                </div>
            </div>
            <form>
                <div className={styles.formGroup}>
                    <label>Account</label>
                    <p>{this.props.reducer.opportunity.account.name}</p>
                </div>
                {
                    this.props.reducer.opportunity.bigDealCode != "" &&
                    <div className={styles.formGroup}>
                        <label>Big Deal Code</label>
                        <p>{this.props.reducer.opportunity.bigDealCode}</p>
                    </div>                
                }
                <div className={styles.formGroup}>
                    <label>Deal Size</label>
                    <p>₱{numeral(dealSize).format('0,0.00')}</p>
                </div>
                <div className={styles.formGroup}>
                    <label>Gross Profit</label>
                    <p>₱{numeral(grossProfit).format('0,0.00')}</p>
                </div>
                <div className={styles.formGroup}>
                    <label>Status</label>
                    <p>{STATUS[this.props.reducer.opportunity.status]}</p>
                </div>
                <br/>
                <div className={styles.formGroup}>
                    <label>Modified by</label>
                    <p>{`${this.props.reducer.opportunity.modifiedBy.firstName} ${this.props.reducer.opportunity.modifiedBy.lastName}`}</p>
                    <label style={{marginLeft: "5px"}}>on</label>
                    <p>{moment.parseZone(this.props.reducer.opportunity.modified).fromNow()}</p>
                </div>
                <div className={styles.formGroup}>
                    <label>Created by</label>
                    <p>{`${this.props.reducer.opportunity.createdBy.firstName} ${this.props.reducer.opportunity.createdBy.lastName}`}</p>
                    <label style={{marginLeft: "5px"}}>on</label>
                    <p>{moment.parseZone(this.props.reducer.opportunity.created).fromNow()}</p>
                </div>
            </form>
            <div className={`${styles.row} ${styles.leftAuto}`}>
                <h2>Components</h2>
                <div onClick={this.onNewComponentClick} className={`${styles.stcButtonPrimary} ${styles.leftAuto}`}>New</div>
            </div>
            <table className={styles.simpleList}>
                <thead>
                    <tr>
                        <td>Type</td>
                        <td>Product</td>
                        <td>Price</td>
                        <td>Stage</td>
                        <td>Status</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.props.reducer.opportunity.components.map(c => 
                            <tr key={c.id} data-id={c.id} onClick={this.onComponentClick}>
                                <td>{c.componentType == null ? "" : c.componentType.name}</td>
                                <td>{c.product.name}</td>
                                <td>₱{this.formatPrice(c.pricePerUnit * c.qty)}</td>
                                <td>{`${c.stage.name} (${c.stage.percentage}%)`}</td>
                                <td>{STATUS[c.status]}</td>
                            </tr>
                        )
                    }

                </tbody>
            </table>
            <div className={styles.row}>
              <div onClick={this.onBack} className={`${styles.stcButtonSecondary}`}>Back</div>
            </div>
            <h2>Remarks</h2>
            <ul>
                {
                    this.props.reducer.opportunity.components.map(c => 
                        <li>{c.remarks}</li>
                        )
                }
            </ul>
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
  
export default connect(mapStateToProps,mapActionCreatorsToProps)(ViewOpportunityComponent);