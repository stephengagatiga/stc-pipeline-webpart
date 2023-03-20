import * as React from 'react';
import styles from '../scss/StcPipeline.module.scss';
import {VIEWS,STATUS,BOL_TXT,SOLUTIONS_ARCHITECT,ACCOUNT_MANAGER,APPROVE,REJECT,GLOBAL_ADMIN} from '../utils/constant';
import * as moment from 'moment';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../redux/actions';

import numeral from 'numeral';

class ViewComponentComponent extends React.Component<any, any> {

    onBack = () => {
        this.props.ChangeView(VIEWS.goBack);
    }

    onEditClick = () => {
        this.props.ChangeView(VIEWS.editComponent);
    }

    onDeleteClick = () => {
        this.props.DeleteComponentInNewOpportunity(this.props.reducer.component);
    }

    onApprove = () => {
        this.props.ApproveOrRejectComponent(this.props.reducer.component,APPROVE,this.props.reducer.opportunity,this.props.reducer.opportunities);
    }

    onReject = () => {
        this.props.ApproveOrRejectComponent(this.props.reducer.component,REJECT,this.props.reducer.opportunity,this.props.reducer.opportunities);
    }

    public render(): React.ReactElement<any> {
        let component = this.props.reducer.component;
    return (
        <div className={ styles.stcPipeline }>
            <div className={styles.row}>
                <h1>Component</h1>
                <div className={styles.leftAuto}>
                    {
                        this.props.reducer.newOpportunity != null &&
                        <a href="#" onClick={this.onDeleteClick} className={styles.mr5}>Delete</a>
                    }
                    <a href="#" onClick={this.onEditClick}>Edit</a>
                    {
                        this.props.reducer.component.status == 2  && this.props.reducer.currentUser.role.name == GLOBAL_ADMIN ?
                        <span>
                            {` | `}
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
                    <label >Category</label>
                    <p>{component.category.name}</p>
                </div>
                <div className={styles.formGroup}>
                    <label >Type</label>
                    <p>{component.componentType == null ? "" : component.componentType.name}</p>
                </div>
                <div className={styles.formGroup}>
                    <label >Product</label>
                    <p>{component.product.name}</p>
                </div>
                <div className={styles.formGroup}>
                    <label >Price per unit</label>
                    <p>₱{numeral(component.pricePerUnit).format('0,0.00')}</p>
                </div>
                <div className={styles.formGroup}>
                    <label>Cost per unit</label>
                    <p>₱{numeral(component.costPerUnit).format('0,0.00')}</p>
                </div>
                <div className={styles.formGroup}>
                    <label >Quantity</label>
                    <p>{component.qty}</p>
                </div>
                <div className={styles.formGroup}>
                    <label >Total price</label>
                    <p>₱{numeral(component.pricePerUnit * component.qty).format('0,0.00')}</p>
                </div>
                <div className={styles.formGroup}>
                    <label >Stage</label>
                    <p>{`${component.stage.name} (${component.stage.percentage}%)`}</p>
                </div>
                <div className={styles.formGroup}>
                    <label >Status</label>
                    <p>{STATUS[component.status]}</p>
                </div>
                <div className={styles.formGroup}>
                    <label>Already done POC?</label>
                    <p>{component.poc ? "Yes" : "No"}</p>
                </div>
                <div className={styles.formGroup}>
                    <label>Target Close Date</label>
                    <p>{component.targetCloseDate == null || component.targetCloseDate == "1899-12-01T00:00:00" ? "" : moment(component.targetCloseDate).format('MMMM YYYY')}</p>
                </div>
                <div className={styles.formGroup}>
                    <label>Validity Date</label>
                    <p>{component.validityDate == null ? "" : moment(component.validityDate).format('MMMM DD, YYYY')}</p>
                </div>
                <div className={styles.formGroup}>
                    <label>Modified by</label>
                    <p>{`${component.modifiedBy.firstName} ${component.modifiedBy.lastName}`}</p>
                    <label style={{marginLeft: "5px"}}>on</label>
                    <p>{moment.parseZone(component.modified).fromNow()}</p>
                </div>
                <div className={styles.formGroup}>
                    <label>Created by</label>
                    <p>{`${component.createdBy.firstName} ${component.createdBy.lastName}`}</p>
                    <label style={{marginLeft: "5px"}}>on</label>
                    <p>{moment.parseZone(component.created).fromNow()}</p>
                </div>
                <div className={styles.formGroupAlignTop}>
                    <label>Description</label>
                    <div style={{whiteSpace: "pre-line"}}>{component.description}</div>
                </div>
                <div className={styles.formGroupAlignTop}>
                    <label>Remarks</label>
                    <div style={{whiteSpace: "pre-line"}}>{component.remarks}</div>
                </div>
                <div className={styles.formGroup}>
                    <label>{SOLUTIONS_ARCHITECT}</label>
                    <p>{`${component.solutionsArchitect.firstName} ${component.solutionsArchitect.lastName}`}</p>
                </div>
                <div className={styles.formGroup}>
                    <label>{ACCOUNT_MANAGER}</label>
                    <p>{`${component.accountExecutive.firstName} ${component.accountExecutive.lastName}`}</p>
                </div>
            </form>
            <div className={styles.row}>
              <div onClick={this.onBack} className={`${styles.stcButtonSecondary}`} style={{marginRight: '5px'}}>Back</div>
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
  
export default connect(mapStateToProps,mapActionCreatorsToProps)(ViewComponentComponent);