export const SERVER = "https://stc-api.azurewebsites.net"; //https://stc-api.azurewebsites.net

export const STATUS_QUO = "STATUS_QUO";
export const LOADING = "LOADING";
export const BAD_REQUEST = "BAD_REQUEST";
export const INTERNAL_ERROR = "INTERNAL_ERROR";
export const SUCCESS = "SUCCESS";
export const ERROR = "ERROR";

export const VIEWS = {
    appCrashed: -4,
    userNotAllowed: -3,
    loadingScreen: -2,
    goBack: -1,
    opportunityList: 0,
    accountSelection: 1,
    newAccount: 2,
    newAccountSuccess: 3,
    newOpportunity: 4,
    newComponent: 5,
    viewComponent: 6,
    viewOpportunity: 7,
    editComponent: 8,
    selectOpportunityComponent: 9,
    moveComponent: 10,
}

export const STATUS = [
    "Open",
    "Approved",
    "For Approval",
    "For Revision",
    "Rejected",
    "Closed",
    "Archived",
    "Lost"
]

export const BOL_TXT = [
    "No",
    "Yes",
]

//Set only the user role that allowed to use the webpart
export const ALLOWED_ROLES = ["Solutions Architect","Account Executive","Global Administrator","Service Delivery Group Manager","Product Manager"];

//If you wish to get list of users by roles add the another role here
export const REQUIRED_USERS_BY_ROLE = ["Solutions Architect","Account Executive"];

export const SOLUTIONS_ARCHITECT = "Solutions Architect";
export const ACCOUNT_MANAGER = "Account Executive";

export const GLOBAL_ADMIN = "Global Administrator";

export const APPROVE = "Approve";
export const REJECT = "Reject";