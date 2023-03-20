import * as types from './actionTypes';
import {SERVER,LOADING,ERROR,SUCCESS,VIEWS,ALLOWED_ROLES,REQUIRED_USERS_BY_ROLE,APPROVE,REJECT, STATUS} from '../utils/constant';
import { sp, EmailProperties } from "@pnp/sp";
import * as moment from 'moment';
import { computeDealSize } from '../utils/utils';

export function ChangeView(view) {
    return async dispatch => {
        dispatch({ type: types.CHANGE_VIEW, value: view });
    }
}

export function GetAllOpportunities() {
    return async dispatch => {
        dispatch({ type: types.UPDATE_GET_OPPORTUNITIES_STATUS, status: LOADING });

        fetch(`${SERVER}/opportunity`,{method: 'GET', headers: {'Accept': 'application/json'}})
            .then(response => {
                if (response.status == 200) {
                    return response.json();
                }
                throw response.statusText;
            })
            .then(result => {
                dispatch({ type: types.UPDATE_GET_OPPORTUNITIES_VALUE, value: result });
                dispatch({ type: types.UPDATE_GET_OPPORTUNITIES_STATUS, status: SUCCESS });
            })
            .catch(error => {
                dispatch({ type: types.UPDATE_GET_OPPORTUNITIES_STATUS, status: ERROR });
            });
    }
}

export function SelectOpportunity(value) {
    return async dispatch => {
        dispatch({ type: types.UPDATE_OPPORTUNITY_VALUE, value });
    }
}

export function GetAllAccounts() {
    return async dispatch => {
        dispatch({ type: types.UPDATE_GET_ACCOUNTS_STATUS, status: LOADING });

        fetch(`${SERVER}/accounts`,{method: 'GET', headers: {'Content-Type': 'application/json'}})
            .then(response => {
                if (response.status == 200) {
                    return response.json();
                }
                throw response.statusText;
            })
            .then(result => {
                dispatch({ type: types.UPDATE_GET_ACCOUNTS_VALUE, value: result });
                dispatch({ type: types.UPDATE_GET_ACCOUNTS_STATUS, status: SUCCESS });
            })
            .catch(error => {
                dispatch({ type: types.UPDATE_GET_ACCOUNTS_STATUS, status: ERROR });
            })

    }
}

export function GetAllCategories() {
    return async dispatch => {
        dispatch({ type: types.UPDATE_GET_CATEGORIES_STATUS, status: LOADING });

        fetch(`${SERVER}/opportunity/category`,{method: 'GET', headers: {'Content-Type': 'application/json'}})
            .then(response => {
                if (response.status == 200) {
                    return response.json();
                }
                throw response.statusText;
            })
            .then(result => {
                dispatch({ type: types.UPDATE_GET_CATEGORIES_VALUE, value: result });
                dispatch({ type: types.UPDATE_GET_CATEGORIES_STATUS, status: SUCCESS });
            })
            .catch(error => {
                dispatch({ type: types.UPDATE_GET_CATEGORIES_STATUS, status: ERROR });
            });
    }
}

export function GetAllComponentTypes() {
    return async dispatch => {
        dispatch({ type: types.UPDATE_GET_COMPONENT_TYPES_STATUS, status: LOADING });

        fetch(`${SERVER}/opportunity/componenttype`,{method: 'GET', headers: {'Content-Type': 'application/json'}})
            .then(response => {
                if (response.status == 200) {
                    return response.json();
                }
                throw response.statusText;
            })
            .then(result => {
                dispatch({ type: types.UPDATE_GET_COMPONENT_TYPES_VALUE, value: result });
                dispatch({ type: types.UPDATE_GET_COMPONENT_TYPES_STATUS, status: SUCCESS });
            })
            .catch(error => {
                dispatch({ type: types.UPDATE_GET_COMPONENT_TYPES_STATUS, status: ERROR });
            });
    }
}

export function SelectNewOpportunityAccount(value,user) {
    return async dispatch => {
        let newOpportunity = {
            id: 0,
            accountId: value.id,
            account: value,
            bigDealCode: "",
            dealSize: 0,
            totalQty: 0,
            created: new Date(),
            createdBy: user,
            modified: new Date(),
            modifiedBy: user,
            status: 2,
            components: []
        };
        dispatch({ type: types.UPDATE_NEW_OPPORTUNITY_VALUE, value: newOpportunity });
    }
}

export function NullNewOpportunityValue() {
    return async dispatch => {
        dispatch({ type: types.UPDATE_NEW_OPPORTUNITY_VALUE, value: null });
    }
}

export function GetAllProducts() {
    return async dispatch => {
        dispatch({ type: types.UPDATE_GET_PRODUCTS_STATUS, status: LOADING });

        fetch(`${SERVER}/principals`, {method: 'GET', headers: {'Content-Type': 'application/json'}})
            .then(response => {
                if (response.status == 200) {
                    return response.json();
                }
                throw response.statusText;
            })
            .then(result => {
                dispatch({ type: types.UPDATE_GET_PRODUCTS_VALUE, value: result });
                dispatch({ type: types.UPDATE_GET_PRODUCTS_STATUS, status: SUCCESS });
            })
            .catch(error => {
                dispatch({ type: types.UPDATE_GET_PRODUCTS_STATUS, status:ERROR });
            })

    }
}

export function GetAllStages() {
    return async dispatch => {
        
        dispatch({ type: types.UPDATE_GET_STAGES_STATUS, status: LOADING });

        fetch(`${SERVER}/opportunity/stage`,{method: 'GET', headers: {'Content-Type': 'application/json'}})
            .then(response => {
                if (response.status == 200) {
                    return response.json();
                }
                throw response.statusText;
            })
            .then(result => {
                dispatch({ type: types.UPDATE_GET_STAGES_VALUE, value: result });
                dispatch({ type: types.UPDATE_GET_STAGES_STATUS, status: SUCCESS });
            })
            .catch(error => {
                dispatch({ type: types.UPDATE_GET_STAGES_STATUS, status: ERROR });
            });
    }
}

export function GetAllIndustries() {
    return async dispatch => {
        dispatch({ type: types.UPDATE_GET_INDUSTRIES_STATUS, status: LOADING });

        fetch(`${SERVER}/accounts/industries`, {method: 'GET', headers: {'Content-Type': 'application/json'} })
            .then(response => {
                if (response.status == 200) {
                    return response.json();
                }
                throw response.statusText;
            })
            .then(result => {
                dispatch({ type: types.UPDATE_GET_INDUSTRIES_VALUE, value: result });
                dispatch({ type: types.UPDATE_GET_INDUSTRIES_STATUS, status: SUCCESS });
            })
            .catch(error => {
                dispatch({ type: types.UPDATE_GET_INDUSTRIES_STATUS, status: ERROR });
            })

    }
}

export function AddComponentInNewOpportunity(opportunity,component) {
    return async dispatch => {
        opportunity.components.push(component);
        dispatch({ type: types.UPDATE_NEW_OPPORTUNITY_VALUE, value: opportunity });
        dispatch({ type: types.CHANGE_VIEW, value: VIEWS.newOpportunity });
    }
}

export function SelectComponent(component) {
    return async dispatch => {
        dispatch({ type: types.UPDATE_COMPONENT_VALUE, value: component });
    }
}

export function UpdateComponentInNewOpportunity(opportunity,component) {
    return async dispatch => {
        let index = 0;
        opportunity.components.forEach((c,i) => {
            if (c.id == component.id) {
                index = i;
            }
        });
        opportunity.components[index] = component;
        dispatch({ type: types.UPDATE_NEW_OPPORTUNITY_VALUE, value: opportunity });
        dispatch({ type: types.CHANGE_VIEW, value: VIEWS.newOpportunity });
    }
}

export function AddComponentInOpportunity(component,bigDealCode,opportunity,opportunities,requireBigDealCode,user) {
    return async dispatch => {
        dispatch({ type: types.CHANGE_VIEW_DONT_LOG, value: VIEWS.loadingScreen });        

       //JSON parse and stringify use to copy the object value
       let tmpOpportunity = JSON.parse(JSON.stringify(opportunity));
       tmpOpportunity.bigDealCode = bigDealCode;

       //If the user is required to input the Big Deal Code
       //that meeans you need to update also the opportunity modifiedBy and modified properties
       if (requireBigDealCode) {
           tmpOpportunity["modified"] = new Date();
           tmpOpportunity["modifiedBy"] = user;
       }

       let opportunityComponents = tmpOpportunity.components.filter(i => i.id != component.id);
       opportunityComponents.unshift(component);
       tmpOpportunity.components = opportunityComponents;
       tmpOpportunity.status = STATUS.indexOf("For Approval");
       let dealSize = computeDealSize(tmpOpportunity);
       let data = {
            accountName: opportunity.account.name,
            dealSize,
            categoryName: component.category.name,
            componentTypeName: component.componentType == null ? "" : component.componentType.name,
            productName: component.product.name,
            stageName: component.stage.name,
            opportunityId: opportunity.id,
            targetCloseDateString: component.targetCloseDate == null ? "" : moment(component.targetCloseDate).format('MMMM YYYY'),
            validityDateString: component.validityDate == null ? "" : moment(component.validityDate).format('MMMM DD, YYYY'),
            createByName: `${user.firstName} ${user.lastName}`,
            accountExecutiveName: `${component.accountExecutive.firstName} ${component.accountExecutive.lastName}`,
            solutionsArchitectName: `${component.solutionsArchitect.firstName} ${component.solutionsArchitect.lastName}`,
            notifyToEmail: user.email,
           //Update only the bigDealCode when it only required
           bigDealCode: requireBigDealCode ? bigDealCode : "",
           description: component.description,
           categoryId: component.category.id,
           componentTypeId:  component.componentType == null ? "" : component.componentType.id,
           accountExecutiveId: component.accountExecutive.id,
           solutionsArchitectId: component.solutionsArchitect.id,
           targetCloseDate: component.targetCloseDate,
           stageId: component.stage.id,
           productId: component.product.id,
           qty: component.qty,
           pricePerUnit: component.pricePerUnit,
           costPerUnit: component.costPerUnit,
           poc: component.poc ? 1 : 0,
           validityDate: component.validityDate,
           status: component.status,
           remarks: component.remarks,
           modifiedById: user.id,
           createdById: user.id
       }

       dispatch({ type: types.UPDATE_ADD_COMPONENT_IN_OPPORTUNITY_STATUS, status: LOADING });

       fetch(`${SERVER}/opportunity/components`, { method: 'POST', body: JSON.stringify(data), headers: {'Content-Type': 'application/json'}})
            .then(response => {
                if (response.status == 200) {
                    return response.json();
                } 
                throw response.status;
            })
            .then(result => {
                let componentResult = result.component;

                component.id = componentResult.id;
                component.requestId = componentResult.requestId;
                tmpOpportunity.modified = new Date();
                tmpOpportunity.requestId = result.opportunity.requestId;
                //JSON parse and stringify use to copy the object value
                let tmpOpportunities = JSON.parse(JSON.stringify(opportunities)).filter(i => i.id != tmpOpportunity.id);
                tmpOpportunities.unshift(tmpOpportunity);
                dispatch({ type: types.UPDATE_COMPONENT_IN_OPPORTUNITY_VALUE, component: component, bigDealCode, opportunity: tmpOpportunity, opportunities: tmpOpportunities});
                dispatch({ type: types.UPDATE_ADD_COMPONENT_IN_OPPORTUNITY_STATUS, status: SUCCESS });
                dispatch({ type: types.CHANGE_VIEW, value: VIEWS.viewOpportunity });
            })
            .catch(error => {
                dispatch({ type: types.UPDATE_ADD_COMPONENT_IN_OPPORTUNITY_STATUS, status: ERROR });
            })

    }
}

export function UpdateComponentInOpportunity(component,bigDealCode,opportunity,opportunities,requireBigDealCode,user,oldComponent) {
    return async dispatch => {
        dispatch({ type: types.CHANGE_VIEW_DONT_LOG, value: VIEWS.loadingScreen });        
        
        //JSON parse and stringify use to copy the object value
        let tmpOpportunity = JSON.parse(JSON.stringify(opportunity));
        tmpOpportunity.bigDealCode = bigDealCode;

        //If the user is required to input the Big Deal Code
        //that meeans you need to update also the opportunity modifiedBy and modified properties
        if (requireBigDealCode) {
            tmpOpportunity["modified"] = new Date();
            tmpOpportunity["modifiedBy"] = user;
        }

        let opportunityComponents = tmpOpportunity.components.filter(i => i.id != component.id);
        opportunityComponents.unshift(component);
        tmpOpportunity.components = opportunityComponents;

        

        let data = {
            accountName: opportunity.account.name,
            dealSize: computeDealSize(tmpOpportunity),
            categoryName: component.category.name,
            componentTypeName: component.componentType == null ? "" : component.componentType.name,
            productName: component.product.name,
            stageName: component.stage.name,
            targetCloseDateString: component.targetCloseDate == null ? "" : moment(component.targetCloseDate).format('MMMM YYYY'),
            validityDateString: component.validityDate == null ? "" : moment(component.validityDate).format('MMMM DD, YYYY'),
            modifiedByName: `${user.firstName} ${user.lastName}`,
            accountExecutiveName: `${component.accountExecutive.firstName} ${component.accountExecutive.lastName}`,
            solutionsArchitectName: `${component.solutionsArchitect.firstName} ${component.solutionsArchitect.lastName}`,
            notifyToEmail: user.email,
            oldComponent: {
                categoryName: oldComponent.category.name,
                componentTypeName:  oldComponent.componentType == null ? "" : oldComponent.componentType.name,
                productName: oldComponent.product.name,
                stageName: oldComponent.stage.name,
                targetCloseDateString: oldComponent.targetCloseDate == null ? "" : moment(oldComponent.targetCloseDate).format('MMMM YYYY'),
                validityDateString: oldComponent.validityDate == null ? "" : moment(oldComponent.validityDate).format('MMMM DD, YYYY'),
                accountExecutiveName: `${oldComponent.accountExecutive.firstName} ${oldComponent.accountExecutive.lastName}`,
                solutionsArchitectName: `${oldComponent.solutionsArchitect.firstName} ${oldComponent.solutionsArchitect.lastName}`,
                costPerUnit: oldComponent.costPerUnit,
                description: oldComponent.description,
                poc: oldComponent.poc ? 1 : 0,
                pricePerUnit:  oldComponent.pricePerUnit,
                qty: oldComponent.qty,
                remarks: oldComponent.remarks,
                status: oldComponent.status
            },
            id: component.id,
            opportunityId: opportunity.id,
            //Update only the bigDealCode when it only required
            bigDealCode: requireBigDealCode ? bigDealCode : "",
            description: component.description,
            categoryId: component.category.id,
            componentTypeId: component.componentType.id,
            accountExecutiveId: component.accountExecutive.id,
            solutionsArchitectId: component.solutionsArchitect.id,
            targetCloseDate: component.targetCloseDate,
            stageId: component.stage.id,
            productId: component.product.id,
            qty: component.qty,
            pricePerUnit: component.pricePerUnit,
            costPerUnit: component.costPerUnit,
            poc: component.poc ? 1 : 0,
            validityDate: component.validityDate,
            status: 2,
            remarks: component.remarks,
            modifiedById: component.modifiedBy.id
        };

        dispatch({ type: types.UPDATE_COMPONENT_IN_OPPORTUNITY_STATUS, status: LOADING });

        fetch(`${SERVER}/opportunity/components`, { method: 'PUT', body: JSON.stringify(data), headers: {'Content-Type': 'application/json'}})
            .then(response => {
                if (response.status == 200) {
                    return response.json();
                } 
                throw response.status;
            })
            .then(result => {

                component.status = result.component.status;
                component.modified = new Date();
                component.requestId = result.component.requestId;
                
                tmpOpportunity.modified = new Date();
                tmpOpportunity.status = result.opportunity.status;
                tmpOpportunity.requestId = result.opportunity.requestId;

                //JSON parse and stringify use to copy the object value
                let tmpOpportunities = JSON.parse(JSON.stringify(opportunities)).filter(i => i.id != tmpOpportunity.id);
                tmpOpportunities.unshift(tmpOpportunity);
  
                dispatch({ type: types.UPDATE_COMPONENT_IN_OPPORTUNITY_VALUE, component: component, bigDealCode, opportunity: tmpOpportunity, opportunities: tmpOpportunities});
                dispatch({ type: types.UPDATE_COMPONENT_IN_OPPORTUNITY_STATUS, status: SUCCESS });
                dispatch({ type: types.CHANGE_VIEW, value: VIEWS.viewOpportunity });
            })
            .catch(error => {
                dispatch({ type: types.UPDATE_COMPONENT_IN_OPPORTUNITY_STATUS, status: ERROR });
            })
    }
}

export function AddOpportunity(opportunity) {
    return async dispatch => {

        dispatch({ type: types.CHANGE_VIEW_DONT_LOG, value: VIEWS.loadingScreen });
        dispatch({ type: types.UPDATE_ADD_OPPORTUNITY_STATUS, status: LOADING });
        let components = [];
        let createdByName = "";
        let notifyToEmail = "";
        opportunity.components.forEach(c => {
            let component = {
                description: c.description,
                categoryId: c.category.id,
                categoryName: c.category.name,
                componentTypeId: c.componentTypeId,
                componentTypeName:  c.componentType == null ? "" : c.componentType.name,
                accountExecutiveId: c.accountExecutive.id,
                accountExecutiveName: `${c.accountExecutive.firstName} ${c.accountExecutive.lastName}`,
                solutionsArchitectId: c.solutionsArchitect.id,
                solutionsArchitectName: `${c.solutionsArchitect.firstName} ${c.solutionsArchitect.lastName}`,
                targetCloseDate: c.targetCloseDate,
                targetCloseDateString: c.targetCloseDate == null ? "" : moment(c.targetCloseDate).format('MMMM YYYY'),
                stageId: c.stage.id,
                stageName: c.stage.name,
                productId: c.product.id,
                productName: c.product.name,
                qty: c.qty,
                pricePerUnit: c.pricePerUnit,
                costPerUnit: c.costPerUnit,
                poc: Number(c.poc),
                validityDate: c.validityDate,
                validityDateString: c.validityDate == null ? "" : moment(c.validityDate).format('MMMM DD, YYYY'),
                status: c.status,
                remarks: c.remarks,
                createdById: c.createdBy.id,
                modifiedById: c.modifiedBy.id
            };
            createdByName = `${c.createdBy.firstName} ${c.createdBy.lastName}`;
            notifyToEmail = c.createdBy.email;
            components.push(component);
        })

        let data = {
            accountId: opportunity.accountId,
            accountName: opportunity.account.name,
            bigDealCode: opportunity.bigDealCode,
            createdById: opportunity.createdBy.id,
            modifiedById: opportunity.modifiedBy.id,
            status: opportunity.status,
            createdByName: createdByName,
            notifyToEmail,
            dealSize: opportunity.dealSize,
            grossProfit: opportunity.grossProfit,
            components: components
        };

        fetch(`${SERVER}/opportunity`, {method: 'POST', body: JSON.stringify(data), headers: {'Content-type': 'application/json'}})
            .then(response => {
                if (response.status == 200) {
                    return response.json();
                }
                throw response.statusText;
            })
            .then(result => {
                dispatch({ type: types.UPDATE_ADD_OPPORTUNITY_VALUE, value: result });
                dispatch({ type: types.UPDATE_ADD_OPPORTUNITY_STATUS, status: SUCCESS });
            })
            .catch(error => {
                dispatch({ type: types.UPDATE_ADD_OPPORTUNITY_STATUS, status: ERROR });
            });
        
    }
}

export function ChangeNewOpportunityBGC(opportunity, value) {
    return async dispatch => {
        opportunity.bigDealCode = value;
        dispatch({ type: types.UPDATE_NEW_OPPORTUNITY_VALUE, value: opportunity });
    }
}

export function AddAccount(data,industryName,user) {
    return async dispatch => {
        dispatch({ type: types.CHANGE_VIEW_DONT_LOG, value: VIEWS.loadingScreen });
        dispatch({ type: types.UPDATE_NEW_ACCOUNT_STATUS, status: LOADING });

        fetch(`${SERVER}/accounts`, { method: 'POST', body: JSON.stringify(data), headers: {'Content-Type': 'application/json'}})
            .then(response => {
                if (response.status == 200) {
                    return response.json();
                } 
                throw response.status;
            })
            .then(result => {
                
                // let emailProps: EmailProperties = {
                //     From: "STC Pipeline",
                //     To: ["phen@shellsoft.com.ph"],
                //     CC: [user.email],
                //     Subject: "New Account Created - For Approval",
                //     Body: `<!DOCTYPE html><html xmlns='http://www.w3.org/1999/xhtml' xmlns:v='urn:schemas-microsoft-com:vml' xmlns:o='urn:schemas-microsoft-com:office:office'><head>  <title></title>  <!--[if !mso]><!-- -->  <meta http-equiv='X-UA-Compatible' content='IE=edge'>  <!--<![endif]--><meta http-equiv='Content-Type' content='text/html; charset=UTF-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><style type='text/css'>  #outlook a { padding: 0; }  .ReadMsgBody { width: 100%; }  .ExternalClass { width: 100%; }  .ExternalClass * { line-height:100%; }  body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }  table, td { border-collapse:collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }  img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }  p { display: block; margin: 13px 0; }</style><!--[if !mso]><!--><style type='text/css'>  @media only screen and (max-width:480px) {    @-ms-viewport { width:320px; }    @viewport { width:320px; }  }</style><!--<![endif]--><!--[if mso]><xml>  <o:OfficeDocumentSettings>    <o:AllowPNG/>    <o:PixelsPerInch>96</o:PixelsPerInch>  </o:OfficeDocumentSettings></xml><![endif]--><!--[if lte mso 11]><style type='text/css'>  .outlook-group-fix {    width:100% !important;  }</style><![endif]--><!--[if !mso]><!-->    <link href='https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700' rel='stylesheet' type='text/css'>    <style type='text/css'>        @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);    </style>  <!--<![endif]--><style type='text/css'>  @media only screen and (min-width:480px) {    .mj-column-per-100 { width:100%!important; }  }</style></head><body style='background: #FFFFFF;'>    <div class='mj-container' style='background-color:#FFFFFF;'><!--[if mso | IE]>      <table role='presentation' border='0' cellpadding='0' cellspacing='0' width='600' align='center' style='width:600px;'>        <tr>          <td style='line-height:0px;font-size:0px;mso-line-height-rule:exactly;'>      <![endif]--><div style='margin:0px auto;max-width:600px;'><table role='presentation' cellpadding='0' cellspacing='0' style='font-size:0px;width:100%;' align='center' border='0'><tbody><tr><td style='text-align:center;vertical-align:top;direction:ltr;font-size:0px;padding:9px 0px 9px 0px;'><!--[if mso | IE]>      <table role='presentation' border='0' cellpadding='0' cellspacing='0'>        <tr>          <td style='vertical-align:top;width:600px;'>      <![endif]--><div class='mj-column-per-100 outlook-group-fix' style='vertical-align:top;display:inline-block;direction:ltr;font-size:13px;text-align:left;width:100%;'><table role='presentation' cellpadding='0' cellspacing='0' style='vertical-align:top;' width='100%' border='0'><tbody><tr><td style='word-wrap:break-word;font-size:0px;padding:0px 0px 0px 0px;' align='left'><div style='cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;'><p><span style='font-size:22px;'><strong>Account Created</strong></span></p></div></td></tr><tr><td style='word-wrap:break-word;font-size:0px;padding:0px 0px 0px 0px;' align='left'><div style='cursor:auto;color:#000000;font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:11px;line-height:1.5;text-align:left;'><table border='0' cellpadding='1' cellspacing='1' style='width:100%;'>	<tbody>		<tr>			<td><span style='font-size:16px;'><strong>Name</strong></span></td>			<td><span style='font-size:16px;'>${data.name}</span></td>		</tr>		<tr>			<td><span style='font-size:16px;'><strong>Code</strong></span></td>			<td><span style='font-size:16px;'>${data.code}</span></td>		</tr>		<tr>			<td><strong><span style='font-size:16px;'>Address</span></strong></td>			<td><span style='font-size:16px;'>${data.address}</span></td>		</tr>		<tr>			<td><strong><span style='font-size:16px;'>Contact Details</span></strong></td>			<td><span style='font-size:16px;'>${data.contactDetails}</span></td>		</tr>		<tr>			<td><strong><span style='font-size:16px;'>Industry</span></strong></td>			<td><span style='font-size:16px;'>${industryName}</span></td>		</tr>		<tr>			<td><strong><span style='font-size:16px;'>Terms of Payments</span></strong></td>			<td><span style='font-size:16px;'>${data.termsOfPayment}</span></td>		</tr>		<tr>			<td><strong><span style='font-size:16px;'>Created By</span></strong></td>			<td><span style='font-size:16px;'>${`${user.firstName} ${user.lastName}`}</span></td>		</tr>	</tbody></table></div></td></tr><tr><td style='word-wrap:break-word;font-size:0px;padding:6px 6px 6px 6px;' align='center'><table role='presentation' cellpadding='0' cellspacing='0' style='border-collapse:separate;width:auto;' align='center' border='0'><tbody><tr><td style='border:0px solid #000;border-radius:24px;color:#fff;cursor:auto;padding:11px 32px;' align='center' valign='middle' bgcolor='#013243'><a href='${SERVER}/token/${result.token}' style='text-decoration:none;background:#013243;color:#fff;font-family:Ubuntu, Helvetica, Arial, sans-serif, Helvetica, Arial, sans-serif;font-size:16px;font-weight:normal;line-height:120%;text-transform:none;margin:0px;' target='_blank'>Click here to approve!</a></td></tr></tbody></table></td></tr></tbody></table></div><!--[if mso | IE]>      </td></tr></table>      <![endif]--></td></tr></tbody></table></div><!--[if mso | IE]>      </td></tr></table>      <![endif]--></div></body></html>`,
                // };

                dispatch({ type: types.UPDATE_NEW_ACCOUNT_STATUS, status: SUCCESS });
                dispatch({ type: types.CHANGE_VIEW_DONT_LOG, value: VIEWS.newAccountSuccess });
            })
            .catch(error => {
                dispatch({ type: types.UPDATE_NEW_ACCOUNT_STATUS, status: ERROR });
            })

    }
}

export function SelectSecondOpportunity(data) {
    return async dispatch => {
        dispatch({ type: types.UPDATE_SECOND_OPPORTUNITY_VALUE, value: data });
    }
}

export function SaveMoveComponents(currentOpportunity,secondOpportunity,opportunities,nothingChanges,user,origFirstComponet,origSecondComponent) {
    return async dispatch => {
     
        //Apply only when there are changes
        if (!nothingChanges) {
            dispatch({ type: types.CHANGE_VIEW_DONT_LOG, value: VIEWS.loadingScreen });
            dispatch({ type: types.UPDATE_MOVE_COMPONENTS_STATUS, status: LOADING });

            currentOpportunity["modified"] = new Date();
            currentOpportunity["modifiedBy"] = user;

            secondOpportunity["modified"] = new Date();
            secondOpportunity["modifiedBy"] = user;

            //Remove currentOpportunity and secondOpportunity in opportunities
            let tmpOpportunities = JSON.parse(JSON.stringify(opportunities.filter(o => o.id != currentOpportunity.id && o.id != secondOpportunity.id)));

            let components = [];
            currentOpportunity.components.forEach(c => {
                //Add only the component that need to be change the opportunityId
                if (origFirstComponet.components.filter(oc => oc.id == c.id).length == 0) {
                    components.push({id: c.id, newOpportunityId: currentOpportunity.id});
                    c.modified = new Date();
                }
            });
            secondOpportunity.components.forEach(c => {
                //Add only the component that need to be change the opportunityId
                if (origSecondComponent.components.filter(oc => oc.id == c.id).length == 0) {
                    components.push({id: c.id, newOpportunityId: secondOpportunity.id});
                    c.modified = new Date();
                }
            });

            let data = {
                firstOpportunityId: currentOpportunity.id,
                firstOpportunityIdBigDealCode: currentOpportunity.bigDealCode,
                secondOpportunityId: secondOpportunity.id,
                secondOpportunityIdBigDealCode: secondOpportunity.bigDealCode,
                modifiedById: user.id,
                components: components
            }

            fetch(`${SERVER}/opportunity/movecomponents`, {method: 'PUT', body: JSON.stringify(data), headers: {'Content-Type': 'application/json'}})
                .then(response => {
                    if (response.status == 200) {

                        //Add new the currentOpportunity and secondOpportunity in opportunities
                        tmpOpportunities.push(currentOpportunity);
                        tmpOpportunities.push(secondOpportunity);

                        dispatch({ type: types.UPDATE_OPPORTUNITY_VALUE, value: currentOpportunity });
                        dispatch({ type: types.UPDATE_GET_OPPORTUNITIES_VALUE, value: tmpOpportunities });
                        dispatch({ type: types.UPDATE_MOVE_COMPONENTS_STATUS, status: SUCCESS });
                        dispatch({ type: types.CHANGE_VIEW, value: VIEWS.viewOpportunity });                        
                    } else {
                        dispatch({ type: types.UPDATE_MOVE_COMPONENTS_STATUS, status: ERROR });
                        throw response.statusText;
                    }
                })
                .catch(error => {
                    dispatch({ type: types.UPDATE_MOVE_COMPONENTS_STATUS, status: ERROR });
                });
        } else {
            dispatch({ type: types.UPDATE_OPPORTUNITY_VALUE, value: currentOpportunity });
            dispatch({ type: types.UPDATE_GET_OPPORTUNITIES_VALUE, value: opportunities });
            dispatch({ type: types.UPDATE_MOVE_COMPONENTS_STATUS, status: SUCCESS });
            dispatch({ type: types.CHANGE_VIEW, value: VIEWS.viewOpportunity });
        }

    }
}

export function DeleteComponentInNewOpportunity(component) {
    return async dispatch => {
        dispatch({ type: types.DELETE_COMPONENT_IN_NEW_OPPORTUNITY, value: component });
    }
}

export function GetUserInfo() {
    return async dispatch => {
        dispatch({ type: types.UPDATE_GET_USER_INFO_STATUS, status: LOADING });

          let id = null;
            let failedToFetchInfo = true;

        while (failedToFetchInfo) {
            await sp.profiles.myProperties.select("UserProfileProperties").get()
              .then(result => {
                  let u = result.UserProfileProperties.filter(o => o.Key == "msOnline-ObjectId");
                      id = u[0].Value;
                failedToFetchInfo = false;
              })
              .catch(error => {
                  console.log(error);
              }) 
        }
            
            fetch(`${SERVER}/users/${id}`, {method: 'GET', headers: {'Content-Type': 'application/json'} })
            .then(response => {
                if (response.status == 200) {
                    return response.json();
                } 
                throw response.statusText;
            })
            .then(result => {
                dispatch({ type: types.UPDATE_GET_USER_INFO_VALUE, value: result });         
                dispatch({ type: types.UPDATE_GET_USER_INFO_STATUS, status: SUCCESS }); 

                //Check if user role is set
                if (result.role != null) {
                    //Check if user role exist in ALLOWED_ROLES
                    let isUserRoleAllowed = ALLOWED_ROLES.filter(r => r.toUpperCase().trim() == result.role.name.toUpperCase().trim()).length == 0 ? false : true;
                    if (!isUserRoleAllowed) {
                        //Make sure current user info is set properly before calling STOP_THE_APP
                        //Set the value to view that you want to show
                        dispatch({ type: types.STOP_THE_APP, value: VIEWS.userNotAllowed, currentUser: result});         
                    }
                }
                
            })
            .catch(error => {
                dispatch({ type: types.UPDATE_GET_USER_INFO_STATUS, status: ERROR });         
            });

    }
}

export function GetRequiredUsers() {
    return async dispatch => {
        dispatch({ type: types.UPDATE_GET_REQUIRED_USERS_STATUS, status: LOADING });
        //You need to get all users here even the inactive users so when the app fetch a user that is an inactive
        //It can still resolve it
        fetch(`${SERVER}/users/all`, {method: 'GET', headers: {'Accept': 'application/json'} })
            .then(response => {
                if (response.status == 200) {
                    return response.json();
                } 
                throw response.statusText;
            })
            .then(result => {
                let usersWithRole = [];
                result.forEach(u => {
                    if (u.role != null) {
                        usersWithRole.push(u);
                    }
                });
                dispatch({ type: types.UPDATE_GET_REQUIRED_USERS_VALUE, value: usersWithRole, allUsers: result });         
                dispatch({ type: types.UPDATE_GET_REQUIRED_USERS_STATUS, status: SUCCESS }); 
            })
            .catch(error => {
                dispatch({ type: types.UPDATE_GET_REQUIRED_USERS_STATUS, status: ERROR });         
            });
    }
}

//When this is called any call that changes in the state store will not take effect
export function ApplicationCrashed() {
    return async dispatch => {
        dispatch({ type: types.APP_CRASHED });
    }
}
export function SetPathResolveToTrue() {
    return async dispatch => {
        dispatch({ type: types.SET_TRUE_PATH_ALREADY_RESOLVE });
    }
}

export function ApproveOrRejectOpportunity(opportunity,status,opportunities) {
    return async dispatch => {
        dispatch({ type: types.CHANGE_VIEW_DONT_LOG, value: VIEWS.loadingScreen });        

        let url = "";

        if (status == APPROVE) {
            url = `${SERVER}/token/${opportunity.requestId}`;
        } else if (status == REJECT) {
            url = `${SERVER}/token/reject/${opportunity.requestId}`;
        }

        fetch(url, {method: 'GET'})
        .then(response => {
            if (response.status == 200) {
                return response.json();
            } else {
                throw response.statusText;
            }
        })
        .then(result => {
            let tmpOpportunities = opportunities.filter(o => o.id != opportunity.id);

                opportunity.status = result.status;
                opportunity.components.forEach(c => {
                    if (result.components.filter(a => a.id == c.id).length != 0) {
                        c.status = result.components.filter(a => a.id == c.id)[0].status;
                    }
                });                    

            tmpOpportunities.unshift(opportunity);

            dispatch({ type: types.UPDATE_OPPORTUNITY_VALUE, value: opportunity });
            dispatch({ type: types.UPDATE_GET_OPPORTUNITIES_VALUE, value: tmpOpportunities });
            dispatch({ type: types.CHANGE_VIEW_DONT_LOG, value: VIEWS.viewOpportunity }); 
        })
        .catch(error => {

        });
    }
}

export function ApproveOrRejectComponent(component,status,opportunity,opportunities) {
    return async dispatch => {
        dispatch({ type: types.CHANGE_VIEW_DONT_LOG, value: VIEWS.loadingScreen });        
        
        //JSON parse and stringify use to copy the object value
        let tmpOpportunity = JSON.parse(JSON.stringify(opportunity));
        let tmpComponent = JSON.parse(JSON.stringify(component));
        let opportunityComponents = tmpOpportunity.components.filter(i => i.id != component.id);
        let tmpOpportunities = JSON.parse(JSON.stringify(opportunities)).filter(i => i.id != tmpOpportunity.id);
        let url = "";

        if (status == APPROVE) {
            url = `${SERVER}/token/${component.requestId}`;
        } else if (status == REJECT) {
            url = `${SERVER}/token/reject/${component.requestId}`;
        }

        fetch(url, {method: 'GET'})
        .then(response => {
            if (response.status == 200) {
                return response.json();
            } else {
                throw response.statusText;
            }
        })
        .then(result => {
            tmpComponent = result.components.filter(c => c.id == tmpComponent.id)[0]
            opportunityComponents.unshift(tmpComponent);
            tmpOpportunity.components = opportunityComponents;
            tmpOpportunity.status = result.status;
            tmpOpportunities.unshift(tmpOpportunity);

            dispatch({ type: types.UPDATE_COMPONENT_IN_OPPORTUNITY_VALUE, component: tmpComponent, opportunity: tmpOpportunity, opportunities: tmpOpportunities});
            dispatch({ type: types.CHANGE_VIEW_DONT_LOG, value: VIEWS.viewComponent }); 
        })
        .catch(error => {

        });
    }
}