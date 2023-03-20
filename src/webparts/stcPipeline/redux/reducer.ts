import * as types from './actionTypes';
import {VIEWS,STATUS_QUO, SUCCESS, ERROR} from '../utils/constant';

const defaultState = {
    view: VIEWS.loadingScreen,
    viewHistory: [],
    opportunities: [],
    opportunitiesStatus: STATUS_QUO,
    opportunity: null,
    accounts: [],
    accountsStatus: STATUS_QUO,
    accountsForSelection: [],
    newOpportunity: null,
    categories: [],
    categoriesForSelection: [],
    categoriesStatus: STATUS_QUO,
    componentTypes: [],
    componentTypesStatus: STATUS_QUO,
    products: [],
    productsForSelection: [],
    productsStatus: STATUS_QUO,
    stages: [],
    stagesForSelection: [],
    stagesStatus: STATUS_QUO,
    industries: [],
    industriesForSelection: [],
    industriesStatus: STATUS_QUO,
    component: null,
    addOpportunityStatus: STATUS_QUO,
    editComponentStatus: STATUS_QUO,
    addComponentStatus: STATUS_QUO,
    newAccountStatus: STATUS_QUO,
    secondOpportunity: null,
    currentUser: null,
    currentUserStatus: STATUS_QUO,
    
    //When this set to true any call to change the state will not take effect
    //This is used when a user access the app with role that are not set in ALLOWED_ROLES
    stopTheApp: false,

    //this is use to store the list of users that the app required (e.g. Solutions Architect, and etc.)
    //see REQUIRED_USERS_BY_ROLE to view all roles
    requiredUsers: [],
    requiredUsersStatus: STATUS_QUO,
    allUsers: [],

    //This used to track the last action of the HTTP request
    //This is usefult to show in the error message to where went wrong
    lastAction: 'LAST ACTION NOT SET',
    
    //this is variable use to check if the application already went to the view
    //that define in componentDidMount of OpportunityListComponent
    pathResolve: false,
}

export default function reducer(state = defaultState, action) {
    let tmp = [];

    //Prevent any changes in the state 
    if (state.stopTheApp) {
        return {...state};
    }

    switch(action.type) {
        case types.CHANGE_VIEW:
        let history = state.viewHistory;
            if (action.value == VIEWS.goBack) {
                if (history.length != 0) {
                    let prevView = history.pop();
                    return {...state, view: prevView, viewHistory: history}
                } else {
                    console.log('no more back');
                    return {...state, view: VIEWS.opportunityList, viewHistory: history}
                }
            } else {
                history.push(state.view); 
                return {...state, view: action.value, viewHistory: history}
            }
        case types.SET_TRUE_PATH_ALREADY_RESOLVE:
            return {...state, pathResolve: true}
        case types.CHANGE_VIEW_DONT_LOG:
            return {...state, view: action.value}

        case types.STOP_THE_APP:
            return {...state, view: action.value, stopTheApp: true, currentUser: action.currentUser}

        case types.UPDATE_GET_OPPORTUNITIES_STATUS:
            return {...state, opportunitiesStatus: action.status}
        case types.UPDATE_GET_OPPORTUNITIES_VALUE:
            return {...state, opportunities: action.value}
        case types.UPDATE_OPPORTUNITY_VALUE:
    
            // let tmpSelectedOpportunity = JSON.parse(JSON.stringify(action.value));
            Object.keys(action.value).forEach(propertyName => {
                if (action.value[propertyName] == null || action.value[propertyName] == undefined) {
                    action.value[propertyName] = updateNullValue(state,action.value[propertyName+"Id"],propertyName);
                }
            });
            action.value.components.forEach(component => {
                Object.keys(component).forEach(componentName => {
                    if (component[componentName] == null || component[componentName] == undefined) {
                        component[componentName] = updateNullValue(state, component[componentName+"Id"],componentName);
                    }
                });
            });

            return {...state, opportunity: action.value}

        case types.UPDATE_GET_ACCOUNTS_STATUS:
            return {...state, accountsStatus: action.status, view: checkAllResourcesLoad("accountsStatus", action.status, state), lastAction: 'Fetching accounts'}
        case types.UPDATE_GET_ACCOUNTS_VALUE:
            tmp = [];
            action.value.forEach(a => {
                tmp.push({text: a.name, value: a.id});
            });
            return {...state, accounts: action.value, accountsForSelection: tmp}
        
        case types.UPDATE_NEW_OPPORTUNITY_VALUE:
            return {...state, newOpportunity: action.value}

        case types.UPDATE_GET_CATEGORIES_STATUS:
            return {...state, categoriesStatus: action.status, view: checkAllResourcesLoad("categoriesStatus", action.status, state), lastAction: 'Fetching categories'}
        case types.UPDATE_GET_CATEGORIES_VALUE:
            tmp = [];
            action.value.forEach(a => {
                tmp.push({text: a.name, value: a.id});
            });
            return {...state, categories: action.value, categoriesForSelection: tmp}

        case types.UPDATE_GET_COMPONENT_TYPES_STATUS:
            return {...state, componentTypesStatus: action.status, view: checkAllResourcesLoad("componentTypesStatus", action.status, state), lastAction: 'Fetching component types'}
        case types.UPDATE_GET_COMPONENT_TYPES_VALUE:
            return {...state, componentTypes: action.value}

        case types.UPDATE_GET_PRODUCTS_STATUS:
            return {...state, productsStatus: action.status, view: checkAllResourcesLoad("productsStatus", action.status, state), lastAction: 'Fetching products'}
        case types.UPDATE_GET_PRODUCTS_VALUE:
            tmp = [];
            action.value.forEach(a => {
                tmp.push({text: a.name, value: a.id});
            });
            return {...state, products: action.value, productsForSelection: tmp}

        case types.UPDATE_GET_STAGES_STATUS:
            return {...state, stagesStatus: action.status,  view: checkAllResourcesLoad("stagesStatus", action.status, state), lastAction: 'Fetching stages'}
        case types.UPDATE_GET_STAGES_VALUE:
            tmp = [];
            action.value.forEach(a => {
                tmp.push({text: `${a.name} (${a.percentage}%)`, value: a.id});
            });
            return {...state, stages: action.value, stagesForSelection: tmp}

        case types.UPDATE_GET_INDUSTRIES_STATUS:
            return {...state, industriesStatus: action.status, view: checkAllResourcesLoad("industriesStatus", action.status, state), lastAction: 'fetching industries'}
        case types.UPDATE_GET_INDUSTRIES_VALUE:
            tmp = [];
            action.value.forEach(a => {
                tmp.push({text: `${a.name}`, value: a.id});
            });
            return {...state, industries: action.value, industriesForSelection: tmp}
        
        case types.UPDATE_COMPONENT_VALUE:
            return {...state, component: action.value}

        case types.UPDATE_ADD_OPPORTUNITY_STATUS:
            return {...state, addOpportunityStatus: action.status}
        case types.UPDATE_ADD_OPPORTUNITY_VALUE:
            let tmpOpportunities = state.opportunities;
            let tmpOpportunity = JSON.parse(JSON.stringify(action.value));
            Object.keys(tmpOpportunity).forEach(propertyName => {
                if (tmpOpportunity[propertyName] == null) {
                    tmpOpportunity[propertyName] = updateNullValue(state,tmpOpportunity[propertyName+"Id"],propertyName);
                }
            });
            tmpOpportunity.components.forEach(component => {
                Object.keys(component).forEach(componentName => {
                    if (component[componentName] == null) {
                        component[componentName] = updateNullValue(state, component[componentName+"Id"],componentName);
                    }
                });
            });
            tmpOpportunities.unshift(tmpOpportunity);
            return {...state, opportunities: tmpOpportunities, newOpportunity: null, view: VIEWS.opportunityList}
        
        case types.UPDATE_ADD_COMPONENT_IN_OPPORTUNITY_STATUS:
            return {...state, addComponentStatus: action.status}

        case types.UPDATE_COMPONENT_IN_OPPORTUNITY_STATUS:
            return {...state, editComponentStatus: action.status}
        case types.UPDATE_COMPONENT_IN_OPPORTUNITY_VALUE:
            let tmpComponent1 = JSON.parse(JSON.stringify(action.component));
            let tmpOpportunity1 = JSON.parse(JSON.stringify(action.opportunity));
            let tmpOpportunities1 = JSON.parse(JSON.stringify(action.opportunities));

            Object.keys(tmpComponent1).forEach(componentName => {
                if (tmpComponent1[componentName] == null) {
                    tmpComponent1[componentName] = updateNullValue(state, tmpComponent1[componentName+"Id"],componentName);
                }
            });

            tmpOpportunity1.components = tmpOpportunity1.components.filter(c => c.id != tmpComponent1.id);
            tmpOpportunity1.components.unshift(tmpComponent1);

            tmpOpportunities1 = tmpOpportunities1.filter(o => o.id != tmpOpportunity1.id);
            tmpOpportunities1.unshift(tmpOpportunity1);

            return {...state, component: tmpComponent1, opportunity: tmpOpportunity1, opportunities: tmpOpportunities1, view: VIEWS.goBack}

        case types.UPDATE_NEW_ACCOUNT_STATUS:
            return {...state, newAccountStatus: action.status}
        case types.UPDATE_NEW_ACCOUNT_VALUE:
            let tmpAccounts = state.accounts;
            let tmpAccountsForSelection = state.accountsForSelection;
            tmpAccounts.unshift(action.value);
            tmpAccountsForSelection.unshift({text: action.value.name, value: action.value.id});
            return {...state, accounts: tmpAccounts, accountsForSelection: tmpAccountsForSelection }

        case types.UPDATE_SECOND_OPPORTUNITY_VALUE:

            // let tmpSelectedOpportunity = JSON.parse(JSON.stringify(action.value));
            Object.keys(action.value).forEach(propertyName => {
                if (action.value[propertyName] == null) {
                    action.value[propertyName] = updateNullValue(state,action.value[propertyName+"Id"],propertyName);
                }
            });
            action.value.components.forEach(component => {
                Object.keys(component).forEach(componentName => {
                    if (component[componentName] == null) {
                        component[componentName] = updateNullValue(state, component[componentName+"Id"],componentName);
                    }
                });
            });

            return {...state, secondOpportunity: action.value, view: VIEWS.moveComponent}

        case types.DELETE_COMPONENT_IN_NEW_OPPORTUNITY:
            let newOpportunity = state.newOpportunity;
            newOpportunity.components = newOpportunity.components.filter(c => c.id != action.value.id);
            return {...state, newOpportunity: newOpportunity, view: VIEWS.newOpportunity}

        case types.UPDATE_GET_USER_INFO_VALUE:
            return {...state, currentUser: action.value }
        case types.UPDATE_GET_USER_INFO_STATUS:
            return {...state, currentUserStatus: action.status, view: checkAllResourcesLoad("currentUserStatus", action.status, state), lastAction: 'fetching current user information'}

        case types.UPDATE_GET_REQUIRED_USERS_VALUE:
            return {...state, requiredUsers: action.value, allUsers: action.allUsers}
        case types.UPDATE_GET_REQUIRED_USERS_STATUS:
            return {...state, requiredUsersStatus: action.status, view: checkAllResourcesLoad("requiredUsersStatus", action.status, state), lastAction: 'fetching required users'}
        
        case types.APP_CRASHED:
            return {...state, stopTheApp: true, view: VIEWS.appCrashed }

        default:
            return state;
    }
}

//This is use to check if all http request in ComponentSwitch are all success
function checkAllResourcesLoad(propFrom, proFromStatus, state) {

    //If one of the HTTP requests are failed stop the app
    if (proFromStatus == ERROR) {
        return VIEWS.appCrashed;
    }

    //The new status is still not updated in state so you need to update the new status
    let s = JSON.parse(JSON.stringify(state));
    s[propFrom] = proFromStatus;
    

    let allLoad = false;
    //If you add another http request in ComponentSwitch please update the condition
    if (s.currentUserStatus == SUCCESS && s.productsStatus == SUCCESS && s.accountsStatus == SUCCESS && s.industriesStatus == SUCCESS && s.requiredUsersStatus == SUCCESS && s.categoriesStatus == SUCCESS && s.componentTypesStatus == SUCCESS && s.stagesStatus == SUCCESS) {
        allLoad = true;
    }

    //If all request are loaded change the view to opportunityList
    if (allLoad) {    
        return VIEWS.opportunityList;
    }
    return state.view;
}

function updateNullValue(state,propertyId,propertyName) {
    if (propertyName == "account") {
        return state.accounts.filter(a => a.id == propertyId)[0];
    } else if (propertyName == "accountExecutive" || propertyName == "solutionsArchitect" || propertyName == "createdBy" || propertyName == "modifiedBy") {
        return state.allUsers.filter(a => a.id == propertyId)[0];
    } else if (propertyName == "category") {
        return state.categories.filter(a => a.id == propertyId)[0];
    } else if (propertyName == "componentType") {
        return state.componentTypes.filter(a => a.id == propertyId)[0];
    } else if (propertyName == "product") {
        let prod = null;
            state.products.forEach(principal => {
                if (principal.products != null) {
                    principal.products.forEach(p => {
                       if (p.id == propertyId) {
                           prod = p;
                       } 
                    });
                }
            });
        return prod;
    } else if (propertyName == "stage") {
        return state.stages.filter(a => a.id == propertyId)[0];
    } else {
        return null;
    }
}