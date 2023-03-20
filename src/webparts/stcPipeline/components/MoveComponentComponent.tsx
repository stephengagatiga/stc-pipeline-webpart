import * as React from 'react';
import styles from '../scss/StcPipeline.module.scss';
import { VIEWS, STATUS, BOL_TXT } from '../utils/constant';
import { computeOpportunityProperty } from '../utils/utils';
import * as moment from 'moment';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../redux/actions';

import numeral from 'numeral';

class MoveComponentComponent extends React.Component<any, any> {

    constructor(props) {
        super(props);
        
        //JSON.parse & JSON.stringify prevent the object copying by reference
        let currentOpportunity = JSON.parse(JSON.stringify(this.props.reducer.opportunity));
        let secondOpportunity = JSON.parse(JSON.stringify(this.props.reducer.secondOpportunity));


        this.state = {
            currentOpportunity: currentOpportunity,
            secondOpportunity: secondOpportunity,
            requireBigDealCode1: false,
            bigDealCode1: currentOpportunity.bigDealCode,
            requireBigDealCode2: false,
            bigDealCode2: secondOpportunity.bigDealCode,
            hasError: false,
            errorMessage: "",

            //Save the original value to compare in the new value if nothing changes
            currentOpportunityOriginal: JSON.parse(JSON.stringify(this.props.reducer.opportunity)),
            secondOpportunityOriginal: JSON.parse(JSON.stringify(this.props.reducer.secondOpportunity)),
        }
    }

    onLeftComponentClick = (e) => {
        this.onComponentMove(this.state.currentOpportunity,this.state.secondOpportunity,e,"fromLeftComponent");
    }

    onRightComponentClick = (e) => {
        this.onComponentMove(this.state.secondOpportunity,this.state.currentOpportunity,e,"fromRightComponent");
    }

    onComponentMove = (fromOpportunity,toOpportunity,e,directionShorthand) => {
        //Get the component
        let id = e.currentTarget.getAttribute("data-id");  
        let component = fromOpportunity.components.filter(c => c.id == id)[0];
        
        //Remove the component
        fromOpportunity.components = fromOpportunity.components.filter(c => c.id != id);
        
        //Push the component to to other opportunity
        toOpportunity.components.push(component);
        
        //Compute the both opportunity to update the new value of deal size and gross profit
        let currentProperty = computeOpportunityProperty(fromOpportunity);
        let secondProperty = computeOpportunityProperty(toOpportunity);
        fromOpportunity.dealSize = currentProperty.dealSize;
        toOpportunity.dealSize = secondProperty.dealSize;
        fromOpportunity.grossProfit = currentProperty.grossProfit;
        toOpportunity.grossProfit = secondProperty.grossProfit;


        //Check if the opportunity meets the Big Deal Code requirements
        if (computeOpportunityProperty(this.state.currentOpportunity).requireBigDealCode && this.state.bigDealCode1 == "") {
            this.setState({requireBigDealCode1: true})
        } else {
            this.setState({requireBigDealCode1: false})
        }

        //Check if the opportunity meets the Big Deal Code requirements
        if (computeOpportunityProperty(this.state.secondOpportunity).requireBigDealCode && this.state.bigDealCode2 == "") {
            this.setState({requireBigDealCode2: true})
        } else {
            this.setState({requireBigDealCode2: false})
        }

        if (directionShorthand == "fromLeftComponent") {
            this.setState({currentOpportunity: fromOpportunity, secondOpportunity: toOpportunity});
        } else {
            this.setState({currentOpportunity: toOpportunity, secondOpportunity: fromOpportunity});
        }

    }

    onCancel = () => {
        this.props.ChangeView(VIEWS.viewOpportunity);
    }

    onSave = () => {

        //JSON.parse & JSON.stringify prevent the object copying by reference
        let firstOpp = JSON.parse(JSON.stringify(this.state.currentOpportunity));
        let secondOpp = JSON.parse(JSON.stringify(this.state.secondOpportunity));

        //Prevent user creating opportunity with no component
        if (secondOpp.id == -1 && secondOpp.components.length == 0) {
            this.setState({hasError: true, errorMessage: "You can't save the second opportunity. An opportunity need to have at least 1 component to be created."});
            return;
        }

        firstOpp.bigDealCode = this.state.bigDealCode1;
        secondOpp.bigDealCode = this.state.bigDealCode2;

        //Big deal code field validation
        if ((this.state.requireBigDealCode1 && this.state.bigDealCode1.trim() == "") || (this.state.requireBigDealCode2 && this.state.bigDealCode2.trim() == "")) {
            this.setState({hasError: true, errorMessage: "You need to add big deal code in opportunity"});
            return false;
        }
       
        //The following used to check if there are changes in both opportunities
        //this useful to prevent calling http request when nothing changes 
        let nothingChanges = true;
        if (firstOpp.components.length != this.state.currentOpportunityOriginal.components.length) {
            nothingChanges = false;
        } else {
            //So when the opportunity components are same size you need to check
            //if they hold the same components
            firstOpp.components.forEach(c => {
                //If the id of the component in firstOpp is not exist in components of currentOpportunityOriginal
                //that means there are changes in both opportunities
                if (this.state.currentOpportunityOriginal.components.filter(com => com.id == c.id).length != 1) {
                    nothingChanges = false;
                }
            });
        }

        // this.props.reducer.opportunity and this.props.reducer.secondOpportunity
        // will be use to identify if there are chaanges in componet
        this.props.SaveMoveComponents(firstOpp,secondOpp,this.props.reducer.opportunities,nothingChanges,this.props.reducer.currentUser,this.props.reducer.opportunity,this.props.reducer.secondOpportunity);
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
        const {currentOpportunity,secondOpportunity,requireBigDealCode1,requireBigDealCode2,bigDealCode1,bigDealCode2,hasError,errorMessage} = this.state;

        let currentOpportunityComputed = computeOpportunityProperty(currentOpportunity);
        let secondOpportunityComputed = computeOpportunityProperty(secondOpportunity);

        return (
            <div className={styles.stcPipeline}>
                <h1>Move Components</h1>
                <form>
                    <div className={styles.formGroup}>
                        <label>Account</label>
                        <p>{currentOpportunity.account.name}</p>
                    </div>
                </form>
                <div className={`${styles.rowTop}`}>
                    <div className={`${styles.flexGrow1} ${styles.mr5}`}>
                        <h2>Current Opportunity</h2>
                        <form>
                            {
                                currentOpportunity.bigDealCode != "" &&
                                <div className={styles.formGroup}>
                                    <label>Big Deal Code</label>
                                    <p>{currentOpportunity.bigDealCode}</p>
                                </div>
                            }
                            <div className={styles.formGroup}>
                                <label>Deal Size</label>
                                <p>₱{numeral(currentOpportunityComputed.dealSize).format('0,0.00')}</p>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Gross Profit</label>
                                <p>₱{numeral(currentOpportunityComputed.grossProfit).format('0,0.00')}</p>
                            </div>
                            {
                                requireBigDealCode1 &&
                                <div className={styles.formGroup}>
                                    <label className={styles.required}>Big Deal Code</label>
                                    <input type="text" onChange={e => { this.setState({bigDealCode1: e.currentTarget.value })}} value={bigDealCode1} />
                                </div>
                            }
                            <div className={styles.formGroup}>
                                <label>Status</label>
                                <p>{STATUS[currentOpportunity.status]}</p>
                            </div>
                        </form>
                    </div>
                    <div className={`${styles.flexGrow1}`}>
                        <h2>Second Opportunity</h2>
                        <form>
                            {
                                secondOpportunity.bigDealCode != "" &&
                                <div className={styles.formGroup}>
                                    <label>Big Deal Code</label>
                                    <p>{secondOpportunity.bigDealCode}</p>
                                </div>
                            }
                            <div className={styles.formGroup}>
                                <label>Deal Size</label>
                                <p>₱{numeral(secondOpportunityComputed.dealSize).format('0,0.00')}</p>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Gross Profit</label>
                                <p>₱{numeral(secondOpportunityComputed.grossProfit).format('0,0.00')}</p>
                            </div>
                            {
                                requireBigDealCode2 &&
                                <div className={styles.formGroup}>
                                    <label className={styles.required}>Big Deal Code</label>
                                    <input type="text" onChange={e => { this.setState({bigDealCode2: e.currentTarget.value })}} value={bigDealCode2} />
                                </div>
                            }
                            <div className={styles.formGroup}>
                                <label>Status</label>
                                <p>{STATUS[secondOpportunity.status]}</p>
                            </div>
                        </form>
                    </div>
                </div>
                <br />
                <div className={`${styles.rowTop}`}>
                    <div className={`${styles.flexGrow1} ${styles.mr5}`}>
                        <h2>Components</h2>
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
                                    currentOpportunity.components.map(c =>
                                        <tr key={c.id} data-id={c.id} onClick={this.onLeftComponentClick}>
                                            <td>{c.componentType == null ? "--" : c.componentType.name}</td>
                                            <td>{c.product.name}</td>
                                            <td>₱{this.formatPrice(c.pricePerUnit * c.qty)}</td>
                                            <td>{`${c.stage.name} (${c.stage.percentage}%)`}</td>
                                            <td>{STATUS[c.status]}</td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                        <i>Select the component to move to right.</i>
                    </div>
                    <div className={`${styles.flexGrow1}`}>
                        <h2>Components</h2>
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
                                    secondOpportunity.components.map(c =>
                                        <tr key={c.id} data-id={c.id} onClick={this.onRightComponentClick}>
                                            <td>{c.componentType == null ? "--" : c.componentType.name}</td>
                                            <td>{c.product.name}</td>
                                            <td>₱{this.formatPrice(c.pricePerUnit * c.qty)}</td>
                                            <td>{`${c.stage.name} (${c.stage.percentage}%)`}</td>
                                            <td>{STATUS[c.status]}</td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>
                        <i>Select the component to move to left.</i>
                    </div>
                </div>
                {
                    hasError &&
                    <div className={styles.messageError}>
                        <p>{errorMessage}</p>
                    </div>
                }
                <br />
                <div className={styles.rowRight}>
                    <div onClick={this.onCancel} className={`${styles.stcButtonSecondary}`} style={{ marginRight: '5px' }}>Cancel</div>
                    <div onClick={this.onSave} className={`${styles.stcButtonPrimary}`}>Save</div>
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
    let a: any = actions;
    return bindActionCreators(a, dispatch);
}

export default connect(mapStateToProps, mapActionCreatorsToProps)(MoveComponentComponent);