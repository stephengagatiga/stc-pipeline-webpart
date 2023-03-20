import * as React from 'react';
import styles from '../scss/StcPipeline.module.scss';
import {VIEWS, STATUS} from '../utils/constant';
import {computeOpportunityProperty} from '../utils/utils';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../redux/actions';

class NewOpportunityComponent extends React.Component<any, any> {

    state = {
        dealSize: 0,
        requireBigDealCode: false,
        bigDealCode: "",
        hasError: false,
        errorMessage: "",
        grossProfit: 0,
    }

    onSubmitClick = () => {
        
        let newOpportunityPropoperty = computeOpportunityProperty(this.props.reducer.newOpportunity);

        if (newOpportunityPropoperty.requireBigDealCode && this.state.bigDealCode.trim() == "") {
            this.setState({hasError: true, errorMessage: "Big deal code is required" });
        } else {
            if (this.props.reducer.newOpportunity.components.length == 0) {
                this.setState({hasError: true, errorMessage: "You need at least 1 component to create an opportunity." });
            } else {
                this.props.ChangeNewOpportunityBGC(this.props.reducer.newOpportunity,this.state.bigDealCode.trim());
                let tmp = JSON.parse(JSON.stringify(this.props.reducer.newOpportunity));
                tmp["dealSize"] = this.state.dealSize;
                tmp["grossProfit"] = this.state.grossProfit;
                this.props.AddOpportunity(tmp);
            }
        }

    }

    onCancelClick = () => {
        this.props.ChangeView(VIEWS.opportunityList);
    }

    onNewComponentClick = () => {
        this.props.ChangeView(VIEWS.newComponent);
    }

    onComponentClick = (e) => {
        let id = e.currentTarget.getAttribute("data-id");
        this.props.SelectComponent(this.props.reducer.newOpportunity.components.filter(c => c.id == id)[0]);
        this.props.ChangeView(VIEWS.viewComponent);
    }

    onBigDealChange = (e) => {
        this.props.ChangeNewOpportunityBGC(this.props.reducer.newOpportunity,e.currentTarget.value);
        this.setState({bigDealCode: e.currentTarget.value });
    }

    componentDidMount() {
        let opportunityProperty = computeOpportunityProperty(this.props.reducer.newOpportunity);
        
        if (!opportunityProperty.requireBigDealCode) {
            this.props.ChangeNewOpportunityBGC(this.props.reducer.newOpportunity,"");
        }
        
        this.setState({dealSize: opportunityProperty.dealSize, 
            requireBigDealCode: opportunityProperty.requireBigDealCode, bigDealCode: opportunityProperty.bigDealCode,
            grossProfit: opportunityProperty.grossProfit });
    }


    public render(): React.ReactElement<any> {

        const {dealSize,bigDealCode,requireBigDealCode,hasError,errorMessage,grossProfit} = this.state;

    return (
        <div className={ styles.stcPipeline }>
            <h1>New Opportunity</h1>
            <form>
                <div className={styles.formGroup}>
                    <label>Account</label>
                    <p>{this.props.reducer.newOpportunity.account.name}</p>
                </div>
                {
                    requireBigDealCode &&
                    <div className={styles.formGroup}>
                        <label className={styles.required}>Big Deal Code</label>
                        <input type="text" onChange={this.onBigDealChange} value={bigDealCode} />
                    </div>
                }
                <div className={styles.formGroup}>
                    <label>Deal Size</label>
                    <p>{dealSize}</p>
                </div>
                <div className={styles.formGroup}>
                    <label>Gross Profit</label>
                    <p>{grossProfit}</p>
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
                        this.props.reducer.newOpportunity.components.map(c => 
                            <tr key={c.id} data-id={c.id} onClick={this.onComponentClick}>
                                <td>{c.componentType == null ? "" : c.componentType.name}</td>
                                <td>{c.product.name}</td>
                                <td>{c.pricePerUnit * c.qty}</td>
                                <td>{`${c.stage.name} (${c.stage.percentage}%)`}</td>
                                <td>{STATUS[c.status]}</td>
                            </tr>
                        )
                    }

                </tbody>
            </table>
            {
                hasError &&
                <div className={styles.messageError}>
                    <p>{errorMessage}</p>
                </div>
            }
            <div className={styles.rowRight}>
              <div onClick={this.onCancelClick} className={`${styles.stcButtonSecondary}`} style={{marginRight: '5px'}}>Cancel</div>
              <div onClick={this.onSubmitClick} className={`${styles.stcButtonPrimary}`}>Submit</div>
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
  
export default connect(mapStateToProps,mapActionCreatorsToProps)(NewOpportunityComponent);