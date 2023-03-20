import * as React from 'react';
import styles from '../scss/StcPipeline.module.scss';
import {VIEWS} from '../utils/constant';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../redux/actions';

import {Dropdown} from './CommonComponents';
import {isInteger,onFieldChange} from '../utils/utils';

class NewAccountComponent extends React.Component<any, any> {

    
    state = {
        name: "",
        code: "",
        address: "",
        contactDetails: "",
        accountIndustryId: null,
        termsOfPayment: 0,
        errors: []
    }
    
    onCancel = () => {
        this.props.ChangeView(VIEWS.goBack);
    }

    onSubmit = () => {
        const {name,code,address,contactDetails,termsOfPayment,accountIndustryId} = this.state;
        let terms = Number(termsOfPayment);

        let errors = [];

        if (!isInteger(terms) || (terms < 0 || terms > 365 ) ) {
            errors.push("Invalid Terms of Payments. Input between 0 to 365 only");
        }

        if (name.trim() == "") {
            errors.push("Company name is empty");
        } else if (this.props.reducer.accounts.filter(a => a.name.toUpperCase().trim() == name.toUpperCase().trim()).length != 0) {
            errors.push("Company name is already exist");
        }

        if (address.trim() == "") {
            errors.push("Company Address is empty");
        }

        if (accountIndustryId == null) {
            errors.push("No industry selected");
        }

        this.setState({errors});

        if (errors.length == 0) {
            let industry = this.props.reducer.industries.filter(i => i.id == accountIndustryId)[0]
            let data = {name,code,address,contactDetails,accountIndustryId,termsOfPayment: terms,notifToEmail: this.props.reducer.currentUser.email,notiifToName: this.props.reducer.currentUser.firstName};
            this.props.AddAccount(data,industry.name,this.props.reducer.currentUser);
        }
    }

    onTermsChange = (e) => {
        let value = e.currentTarget.value;
        if (value == "0") {
            this.setState({termsOfPayment: value });
            return true;
        }
        let result = /^(?!0)[\d]*$/g.test(value);
        if (result) {
            if (e.currentTarget.value <= 365) {
                this.setState({termsOfPayment: value });
            }
        }
    }

    public render(): React.ReactElement<any> {
        const {name,code,address,contactDetails,termsOfPayment,accountIndustryId,errors} = this.state;


    return (
        <div className={ styles.stcPipeline }>
            <div className={`${styles.row}`}>
              <h1>New Account</h1>
            </div>
            <form>
                <div className={styles.formGroup}>
                    <label className={styles.required}>Name</label>
                    <input type="text" name="name" value={name} onChange={e => { onFieldChange(e,this); }} />
                </div>
                <div className={styles.formGroup}>
                    <label>Code</label>
                    <input type="text" name="code" value={code} onChange={e => { onFieldChange(e,this); }} />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.required}>Address</label>
                    <input type="text" name="address" value={address} onChange={e => { onFieldChange(e,this); }} />
                </div>
                <div className={styles.formGroup}>
                    <label>Contact Details</label>
                    <input type="text" name="contactDetails" value={contactDetails} onChange={e => { onFieldChange(e,this); }} />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.required}>Industry</label>
                    <Dropdown placeholder="Select the company industry" value={accountIndustryId} items={this.props.reducer.industriesForSelection}  flexGrow="true" onChange={v => { this.setState({accountIndustryId: v}) }} />
                </div>
                <div className={styles.formGroup}>
                    <label>Terms of Payments</label>
                    <input type="text" value={termsOfPayment} onChange={this.onTermsChange} />
                    <label>days</label>
                </div>
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
              <div onClick={this.onCancel} className={`${styles.stcButtonSecondary} ${styles.mr5}`}>Cancel</div>
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
  
export default connect(mapStateToProps,mapActionCreatorsToProps)(NewAccountComponent);