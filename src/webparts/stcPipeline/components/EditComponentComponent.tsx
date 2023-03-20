import * as React from 'react';
import styles from '../scss/StcPipeline.module.scss';
import {VIEWS,STATUS,SOLUTIONS_ARCHITECT, ACCOUNT_MANAGER} from '../utils/constant';
import * as moment from 'moment';

import {computeOpportunityProperty,onCategoryChange,onPrincipalChange,onPriceChange,onCostChange,onQuantityChange,onValidityDateYearChange,onValidityDateMonthChange,checkBigDealCode,validateComponent} from '../utils/utils';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../redux/actions';

import {Dropdown} from './CommonComponents';
import {isInteger,getDaysArray,getYearsArray,getMonthsArray} from '../utils/utils';

class EditComponentComponent extends React.Component<any, any> {

    state = {
        categoryId: this.props.reducer.component.categoryId,
        componentTypeId: this.props.reducer.component.componentTypeId,
        //principalId doesnt exist in component table
        //so you need to update it in componentDidMount
        principalId: null,
        productId: this.props.reducer.component.productId,
        pricePerUnit: this.props.reducer.component.pricePerUnit,
        costPerUnit: this.props.reducer.component.costPerUnit,
        qty: this.props.reducer.component.qty,
        stageId: this.props.reducer.component.stageId,
        status: this.props.reducer.status,
        description: this.props.reducer.component.description,
        remarks: this.props.reducer.component.remarks,
        bigDealCode: this.props.reducer.opportunity == null ?  this.props.reducer.newOpportunity.bigDealCode : this.props.reducer.opportunity.bigDealCode,
        requireBigDealCode: false,
        poc: this.props.reducer.component.poc,
        targetCloseDate: this.props.reducer.component.targetCloseDate,
        targetCloseDateMonth: this.props.reducer.component.targetCloseDate == null ? null : Number(moment(this.props.reducer.component.targetCloseDate).format("M")),
        targetCloseDateYear: this.props.reducer.component.targetCloseDate == null ? null : Number(moment(this.props.reducer.component.targetCloseDate).format("YYYY")),
        validityDate: this.props.reducer.component.validityDate,
        validityDateMonth: this.props.reducer.component.validityDate == null ? null : Number(moment(this.props.reducer.component.validityDate).format("M")),
        validityDateDay: this.props.reducer.component.validityDate == null ? null : Number(moment(this.props.reducer.component.validityDate).format("D")),
        validityDateYear: this.props.reducer.component.validityDate == null ? null : Number(moment(this.props.reducer.component.validityDate).format("YYYY")),
        solutionsArchitectId: this.props.reducer.component.solutionsArchitect.id,   
        accountExecutiveId: this.props.reducer.component.accountExecutive.id,        
        errors: [],
        oldComponent: JSON.parse(JSON.stringify(this.props.reducer.component))
    }

    componentDidMount() {
        //find principal id
        let principalId = null;
        this.props.reducer.products.forEach(principal => {
            if (principal.products != null) {
                principal.products.forEach(p => {
                    if (p.id == this.props.reducer.component.productId) {
                        principalId = principal.id;
                    } 
                });
            }
        });
        this.setState({principalId: principalId});
    }


    onCancel = () => {
        this.props.ChangeView(VIEWS.goBack);
    }

    onSave = () => {
        const {categoryId,componentTypeId,principalId,productId,pricePerUnit,costPerUnit,qty,stageId,description,remarks,poc,targetCloseDateMonth,targetCloseDateYear,validityDateDay,validityDateMonth,validityDateYear,requireBigDealCode,bigDealCode,solutionsArchitectId,accountExecutiveId} = this.state;
        
        let validateComponentResult = validateComponent(this.state, this.props.reducer.categories, this.props.reducer.products, this.props.reducer.stages, this.props.reducer.componentTypes);
        
        let category = validateComponentResult.category;
        let product = validateComponentResult.product;
        let stage = validateComponentResult.stage;
        let componentType = validateComponentResult.componentType;
        let errors = validateComponentResult.errors;


        this.setState({errors});
        
        if (errors.length == 0) {
            //get all data original so that data that arent defined below will still exist
            let data = this.props.reducer.component;
            data.categoryId = categoryId;
            data.componentTypeId = componentTypeId;
            data.principalId = principalId;
            data.productId = productId;
            data.stageId = stageId;
            data.description = description;
            data.remarks = remarks;
            
            data["pricePerUnit"] = Number(pricePerUnit);
            data["costPerUnit"] = Number(costPerUnit);
            data["qty"] = Number(qty);
            data["category"] = category;
            data["product"] = product;
            data["stage"] = stage;
            data["componentType"] = componentType;
            data["status"] = STATUS.indexOf("Open");
            data["poc"] = poc;
            data["bigDealCode"] = bigDealCode;
            data["modified"] = new Date();
            data["modifiedBy"] = this.props.reducer.currentUser;
            data["solutionsArchitect"] = this.props.reducer.requiredUsers.filter(u => u.id == solutionsArchitectId)[0];
            data["accountExecutive"] = this.props.reducer.requiredUsers.filter(u => u.id == accountExecutiveId)[0];

            //Convert the data to SQL Server datetime2
            data["targetCloseDate"] = moment(new Date(targetCloseDateYear,targetCloseDateMonth-1,1)).format(moment.HTML5_FMT.DATETIME_LOCAL_MS);

            data["validityDate"] = moment(new Date(validityDateYear,validityDateMonth-1,validityDateDay)).format(moment.HTML5_FMT.DATETIME_LOCAL_MS);


            if (this.props.reducer.newOpportunity == null) {
                this.props.UpdateComponentInOpportunity(data, bigDealCode,this.props.reducer.opportunity,this.props.reducer.opportunities,requireBigDealCode,this.props.reducer.currentUser,this.state.oldComponent);
            } else {
                this.props.UpdateComponentInNewOpportunity(this.props.reducer.newOpportunity,data);
            }
        }
    }

    onStageChange = (value) => {
        this.setState({stageId: value});
        if (this.props.reducer.newOpportunity == null) {
            checkBigDealCode(this,this.props.reducer.opportunity);
        } 
    }

    checkBigDealCode = () => {
        checkBigDealCode(this,this.props.reducer.opportunity);
    }
    
    public render(): React.ReactElement<any> {
        const {categoryId,componentTypeId,principalId,productId,pricePerUnit,costPerUnit,qty,stageId,description,remarks,errors,poc,targetCloseDateMonth,targetCloseDateYear,validityDateDay,validityDateMonth,validityDateYear,bigDealCode,requireBigDealCode,solutionsArchitectId,accountExecutiveId,} = this.state;

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
        // This used to check if the component SA is still exist un the current list of solutions architects
        let saExistInList = false;

        //Add all sa in solutionsArchitects
        this.props.reducer.requiredUsers.filter(u => u.role.name.trim().toUpperCase() == SOLUTIONS_ARCHITECT.trim().toUpperCase()).forEach(a => {
            solutionsArchitects.push({text: `${a.firstName} ${a.lastName}`, value: a.id});
            
            //set to true if the component SA is still exist in the current list of solutions architects
            if (solutionsArchitectId == a.id) {
                saExistInList = true;
            }
        });

        //Add the component SA in the current list of solutions architects
        if (!saExistInList) {
            solutionsArchitects.push({text: `${this.props.reducer.component.solutionsArchitect.firstName} ${this.props.reducer.component.solutionsArchitect.lastName}`, value: this.props.reducer.component.solutionsArchitect.id});
        }

        let accountExecutives = [];
        // This used to check if the component AM is still exist un the current list of account managers
        let amExistInList = false;

        //Add all sa in accountExecutives
        this.props.reducer.requiredUsers.filter(u => u.role.name.trim().toUpperCase() == ACCOUNT_MANAGER.trim().toUpperCase()).forEach(a => {
            accountExecutives.push({text: `${a.firstName} ${a.lastName}`, value: a.id});
            
            //set to true if the component AM is still exist in the current list of account managers
            if (accountExecutiveId == a.id) {
                amExistInList = true;
            }
        });

        //Add the component AM in the current list of account managers
        if (!amExistInList) {
            accountExecutives.push({text: `${this.props.reducer.component.accountExecutive.firstName} ${this.props.reducer.component.accountExecutive.lastName}`, value: this.props.reducer.component.accountExecutive.id});
        }

    return (
        <div className={ styles.stcPipeline }>
            <h1>Edit Component</h1>
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
                    <input type="text" onChange={e => { onPriceChange(this, e.currentTarget.value) }} value={pricePerUnit}  />
                    <label>Pesos</label>
                </div>
                <div className={styles.formGroup}>
                    <label className={isStageAbove5 ? `${styles.required}` : ``}>Cost per unit</label>
                    <input type="text" onChange={e => { onCostChange(this,e.currentTarget.value) }} value={costPerUnit} />
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
                    <Dropdown placeholder="" items={[{text: "Yes", value: true}, {text: "No", value: false}]} flexGrow="true" onChange={value => { this.setState({poc: value}) }} value={poc} />
                </div>
                <div className={styles.formGroup}>
                    <label>Target Close Date</label>
                    <Dropdown placeholder="Select year" items={getYearsArray(targetCloseDateYear)} flexGrow="true" onChange={value => { this.setState({targetCloseDateYear: value}) }} value={targetCloseDateYear} />
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
                <div className={styles.formGroupAlignTop}>
                    <label className={styles.required}>{SOLUTIONS_ARCHITECT}</label>
                    <Dropdown placeholder="Select a user" items={solutionsArchitects} flexGrow="true" onChange={value => { this.setState({solutionsArchitectId: value}) }} value={solutionsArchitectId} />
                </div> 
                <div className={styles.formGroupAlignTop}>
                    <label className={styles.required}>{ACCOUNT_MANAGER}</label>
                    <Dropdown placeholder="Select a user" items={accountExecutives} flexGrow="true" onChange={value => { this.setState({accountExecutiveId: value}) }} value={accountExecutiveId} />
                </div> 
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
  let a : any = actions;
  return bindActionCreators(a,dispatch);
}
  
export default connect(mapStateToProps,mapActionCreatorsToProps)(EditComponentComponent);