import * as React from 'react';
import styles from '../scss/StcPipeline.module.scss';
import {VIEWS,STATUS,SOLUTIONS_ARCHITECT,ACCOUNT_MANAGER} from '../utils/constant';

import {computeOpportunityProperty,onCategoryChange,onPrincipalChange,onPriceChange,onCostChange,onQuantityChange,onValidityDateYearChange,onValidityDateMonthChange,checkBigDealCode,validateComponent} from '../utils/utils';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../redux/actions';
import * as moment from 'moment';

import {Dropdown} from './CommonComponents';
import {isInteger,getDaysArray,getYearsArray,getMonthsArray} from '../utils/utils';

class NewComponentComponent extends React.Component<any, any> {

    state = {
        categoryId: null,
        componentTypeId: null,
        principalId: null,
        productId: null,
        pricePerUnit: "",
        costPerUnit: "",
        qty: "",
        stageId: null,
        description: "",
        remarks: "",
        bigDealCode: "",
        requireBigDealCode: false,
        poc: 0,
        targetCloseDate: null,
        targetCloseDateMonth: null,
        targetCloseDateYear: null,
        validityDate: null,
        validityDateMonth: null,
        validityDateDay: null,
        validityDateYear: null,
        solutionsArchitectId: null,
        accountExecutiveId: null,
        errors: []
    }

    onCancel = () => {
        this.props.ChangeView(VIEWS.goBack);
    }

    componentDidMount() {
        let id = this.props.reducer.currentUser.id;
        if (this.props.reducer.currentUser.role.name.trim().toUpperCase() == ACCOUNT_MANAGER.trim().toUpperCase()) {
            this.setState({accountExecutiveId: id});
        }
        if (this.props.reducer.currentUser.role.name.trim().toUpperCase() == SOLUTIONS_ARCHITECT.trim().toUpperCase()) {
            this.setState({solutionsArchitectId: id});
        }
    }

    onStageChange = (value) => {
        this.setState({stageId: value});
        if (this.props.reducer.newOpportunity == null) {
            checkBigDealCode(this,this.props.reducer.opportunity);
        } 
    }

    onSubmit = () => {
        const {categoryId,componentTypeId,principalId,productId,pricePerUnit,costPerUnit,qty,stageId,description,remarks,poc,targetCloseDateMonth,targetCloseDateYear,validityDateDay,validityDateMonth,validityDateYear,requireBigDealCode,bigDealCode} = this.state;
        
        let validateComponentResult = validateComponent(this.state, this.props.reducer.categories, this.props.reducer.products, this.props.reducer.stages, this.props.reducer.componentTypes);
        
        let category = validateComponentResult.category;
        let product = validateComponentResult.product;
        let stage = validateComponentResult.stage;
        let componentType = validateComponentResult.componentType;
        let errors = validateComponentResult.errors;

        this.setState({errors});
        
        if (errors.length == 0) {
            let data = {categoryId,componentTypeId,principalId,productId,stageId,description,remarks};
            data["pricePerUnit"] = Number(pricePerUnit);
            data["costPerUnit"] = Number(costPerUnit);
            data["qty"] = Number(qty);
            data["category"] = category;
            data["product"] = product;
            data["stage"] = stage;
            data["componentType"] = componentType;
            data["status"] = STATUS.indexOf("For Approval");
            data["poc"] = poc;
            data["created"] = new Date();
            data["createdBy"] = this.props.reducer.currentUser;
            data["modified"] = new Date();
            data["modifiedBy"] = this.props.reducer.currentUser;

            if (this.props.reducer.currentUser.role.name.trim().toUpperCase() == SOLUTIONS_ARCHITECT.trim().toUpperCase()) {
                data["solutionsArchitect"] = this.props.reducer.currentUser;
            } else {
                let sa = this.props.reducer.requiredUsers.filter(u => u.id == this.state.solutionsArchitectId)[0];
                data["solutionsArchitect"] = sa;
            }

            if (this.props.reducer.currentUser.role.name.trim().toUpperCase() == ACCOUNT_MANAGER.trim().toUpperCase()) {
                data["accountExecutive"] = this.props.reducer.currentUser;
            } else {
                let am = this.props.reducer.requiredUsers.filter(u => u.id == this.state.accountExecutiveId)[0];
                data["accountExecutive"] = am;
            }
            
            if (targetCloseDateYear != null && targetCloseDateMonth != null) {
                data["targetCloseDate"] = moment(new Date(targetCloseDateYear,targetCloseDateMonth-1,1)).format(moment.HTML5_FMT.DATETIME_LOCAL_MS);
            } else {
                data["targetCloseDate"] = null;
            }

            if (validityDateYear != null && validityDateMonth != null && validityDateDay != null) {
                data["validityDate"] = moment(new Date(validityDateYear,validityDateMonth-1,validityDateDay)).format(moment.HTML5_FMT.DATETIME_LOCAL_MS);
            } else {
                data["validityDate"] = null;
            }
                        
            if (this.props.reducer.newOpportunity == null) {
                this.props.AddComponentInOpportunity(data,bigDealCode,this.props.reducer.opportunity,this.props.reducer.opportunities,requireBigDealCode,this.props.reducer.currentUser);
            } else {
                let maxId = 0;
                this.props.reducer.opportunities.forEach(o => {
                    o.components.forEach(c => {
                        if (maxId < c.id) {
                            maxId = c.id;
                        }
                    });
                });
    
                //Check also the components in new opportuniy
                if (this.props.reducer.newOpportunity != null) {
                    this.props.reducer.newOpportunity.components.forEach(c => {
                        if (maxId < c.id) {
                            maxId = c.id;
                        }
                    });
                }
                maxId++;
                data["id"] = maxId;
                this.props.AddComponentInNewOpportunity(this.props.reducer.newOpportunity,data);
            }

        }

    }

    checkBigDealCode = () => {
        checkBigDealCode(this,this.props.reducer.opportunity);
    }

    public render(): React.ReactElement<any> {
        const {categoryId,componentTypeId,principalId,productId,pricePerUnit,costPerUnit,qty,stageId,description,remarks,errors,poc,targetCloseDateMonth,targetCloseDateYear,validityDateDay,validityDateMonth,validityDateYear,bigDealCode,requireBigDealCode,solutionsArchitectId,accountExecutiveId} = this.state;

        let principals = this.props.reducer.productsForSelection;
        let products = [];
        let tmpProducts = this.props.reducer.products.filter(p => p.id == principalId);

        if (tmpProducts.length != 0) {
            if (Array.isArray(tmpProducts[0].products)) {
                tmpProducts[0].products.forEach(x => {
                    products.push({text: x.name, value: x.id});
                })
            } 
        }

        let componentTypes = [];
        this.props.reducer.componentTypes.filter(t => t.categoryId == categoryId).forEach(ct => {
            componentTypes.push({text: ct.name, value: ct.id});
        });

        let isStageAbove5 = false;
        if (stageId != null) {
            isStageAbove5 = this.props.reducer.stages.filter(s => s.id == stageId)[0].percentage > 5;
        }

        let category = {name: ""};
        if (categoryId != null) {
            category = this.props.reducer.categories.filter(c => c.id == categoryId)[0];
        }

        let solutionsArchitects = [];
        //Add all sa in solutionsArchitects
        this.props.reducer.requiredUsers.filter(u => u.role.name.trim().toUpperCase() == SOLUTIONS_ARCHITECT.trim().toUpperCase()).forEach(a => {
            solutionsArchitects.push({text: `${a.firstName} ${a.lastName}`, value: a.id});
        });

        let accountExecutive = [];
        //Add all sa in accountExecutive
        this.props.reducer.requiredUsers.filter(u => u.role.name.trim().toUpperCase() == ACCOUNT_MANAGER.trim().toUpperCase()).forEach(a => {
            accountExecutive.push({text: `${a.firstName} ${a.lastName}`, value: a.id});
        });

    return (
        <div className={ styles.stcPipeline }>
            <h1>New Component</h1>
            <form>
                <div className={styles.formGroup}>
                    <label className={styles.required}>Category</label>
                    <Dropdown placeholder="Select component category" items={this.props.reducer.categoriesForSelection} flexGrow="true" onChange={value => { onCategoryChange(this,value); }} value={categoryId} name="category" />
                </div>
                <div className={styles.formGroup}>
                    <label className={isStageAbove5 ? `${styles.required}` : ``}>Type</label>
                    <Dropdown placeholder="Select component type" name="type" items={componentTypes} flexGrow="true" onChange={v => { this.setState({componentTypeId: v})}} value={componentTypeId} />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.required}>Product</label>
                    <Dropdown placeholder="Select principal" items={principals} flexGrow="true" onChange={value => { onPrincipalChange(this,value); }} value={principalId} enableSearch="true" />
                    <Dropdown placeholder="Select product" type="product" items={products} flexGrow="true" onChange={v => { this.setState({productId: v}) }} value={productId} enableSearch="true" />
                </div>
                <div className={styles.formGroup}>
                    <label className={isStageAbove5 ? `${styles.required}` : ``}>Price per unit</label>
                    <input type="text" onChange={e => { onPriceChange(this,e.currentTarget.value); }} value={pricePerUnit}  />
                    <label>Pesos</label>
                </div>
                <div className={styles.formGroup}>
                    <label className={isStageAbove5 ? `${styles.required}` : ``}>Cost per unit</label>
                    <input type="text" onChange={e => { onCostChange(this,e.currentTarget.value); }} value={costPerUnit} />
                    <label>Pesos</label>
                </div>
                <div className={styles.formGroup}>
                    <label className={isStageAbove5 ? `${styles.required}` : ``}>{category.name == "Service" ? `Man-Day` : `Quantity`}</label>                            
                    <input type="text" name="" onChange={e => { onQuantityChange(this,e.currentTarget.value); }} value={qty} />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.required}>Stage</label>
                    <Dropdown placeholder="Select component stage" items={this.props.reducer.stagesForSelection} flexGrow="true" onChange={this.onStageChange} value={stageId} />
                </div>
                <div className={styles.formGroup}>
                    <label>Already done POC?</label>
                    <Dropdown placeholder="" items={[{text: "Yes", value: 1}, {text: "No", value: 0}]} flexGrow="true" onChange={value => { this.setState({poc: value}) }} value={poc} />
                </div>
                <div className={styles.formGroup}>
                    <label>Target Close Date</label>
                    <Dropdown placeholder="Select year" items={getYearsArray()} flexGrow="true" onChange={value => { this.setState({targetCloseDateYear: value}) }} value={targetCloseDateYear} />
                    <Dropdown placeholder="Select month" items={getMonthsArray} flexGrow="true" onChange={value => { this.setState({targetCloseDateMonth: value}) }} value={targetCloseDateMonth} />
                </div>
                <div className={styles.formGroup}>
                    <label>Validity Date</label>
                    <Dropdown placeholder="Select year" items={getYearsArray()} flexGrow="true" onChange={value => { onValidityDateYearChange(this,value); }} value={validityDateYear} />
                    <Dropdown placeholder="Select month" items={getMonthsArray} flexGrow="true" onChange={value => { onValidityDateMonthChange(this,value); }} value={validityDateMonth} />
                    <Dropdown placeholder="Select day" items={getDaysArray(validityDateYear,validityDateMonth)} flexGrow="true" onChange={value => { this.setState({validityDateDay: value}) }} value={validityDateDay} />
                </div>
                <div className={styles.formGroupAlignTop}>
                    <label className={styles.required}>Description</label>
                    <textarea onChange={e => { this.setState({description: e.currentTarget.value }) }} value={description}></textarea>
                </div>
                <div className={styles.formGroupAlignTop}>
                    <label className={styles.required}>Remarks</label>
                    <textarea onChange={e => { this.setState({remarks: e.currentTarget.value }) }} value={remarks}></textarea>
                </div>
                {
                    this.props.reducer.currentUser.role.name.trim().toUpperCase() == SOLUTIONS_ARCHITECT.trim().toUpperCase() ?
                    <div className={styles.formGroupAlignTop}>
                        <label>{SOLUTIONS_ARCHITECT}</label>
                        <p>{`${this.props.reducer.currentUser.firstName} ${this.props.reducer.currentUser.lastName}`}</p>
                    </div>     
                    :
                    <div className={styles.formGroupAlignTop}>
                        <label className={styles.required}>{SOLUTIONS_ARCHITECT}</label>
                        <Dropdown placeholder="Select a user" items={solutionsArchitects} flexGrow="true" onChange={value => { this.setState({solutionsArchitectId: value}) }} value={solutionsArchitectId} />
                    </div>                 

                }
                {
                    this.props.reducer.currentUser.role.name.trim().toUpperCase() == ACCOUNT_MANAGER.trim().toUpperCase() ?
                    <div className={styles.formGroupAlignTop}>
                        <label>{ACCOUNT_MANAGER}</label>
                        <p>{`${this.props.reducer.currentUser.firstName} ${this.props.reducer.currentUser.lastName}`}</p>
                    </div>     
                    :
                    <div className={styles.formGroupAlignTop}>
                        <label className={styles.required}>{ACCOUNT_MANAGER}</label>
                        <Dropdown placeholder="Select a user" items={accountExecutive} flexGrow="true" onChange={value => { this.setState({accountExecutiveId: value}) }} value={accountExecutiveId} />
                    </div>                 
                }
                {
                    requireBigDealCode &&
                    <div>
                        <div className={styles.formGroup}>
                            <label className={`${styles.required}`}>Opportunity Big Deal Code</label>
                            <input type="text" onChange={e => { this.setState({bigDealCode: e.currentTarget.value }) }} value={bigDealCode} />
                        </div>
                        <i>The opportunity of this component meets the criteria to have a big deal code.</i>
                    </div>
                }
                <i>Fields with <label className={styles.required}> </label> are required.</i>
            </form>
            {
                errors.length != 0 &&
                <div className={styles.messageError}>
                    <p>There are some errors:</p>
                    <ul>
                        {
                            errors.map((value,index) => <li key={index}>{value}</li>)
                        }
                    </ul>
                </div>
            }
            <div className={styles.rowRight}>
              <div onClick={this.onCancel} className={`${styles.stcButtonSecondary}`} style={{marginRight: '5px'}}>Cancel</div>
              <div onClick={this.onSubmit} className={`${styles.stcButtonPrimary}`}>Submit</div>
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
  
export default connect(mapStateToProps,mapActionCreatorsToProps)(NewComponentComponent);