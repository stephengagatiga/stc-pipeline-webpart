import * as React from 'react';
import styles from '../scss/StcPipeline.module.scss';
import {VIEWS,STATUS,STATUS_QUO} from '../utils/constant';
import {computeDealSize,onFieldChange} from '../utils/utils';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../redux/actions';
import * as moment from 'moment';
import numeral from 'numeral';

const HEADER = {
  ACCOUNT: 1,
  DEAL_SIZE: 2,
  DESCRIPTION: 3,
  STAGE: 4,
  CLOSE_DATE: 5,
  ACCOUNT_EXECUTIVE: 6,
  STATUS: 7
}

class OpportunityListComponent extends React.Component<any, any> {

  state = {
    showFilters: false,
    accountsFilter: [],
    statusFilter: [],
    stagesFilter: [],
    aeFilter: [],
    opportunities: [],
    searchAccount: "",
    headerClick: HEADER.ACCOUNT,
    sortAscending: true,
    listIsFilteredBy: []
  }

  componentDidMount() {

    if (localStorage.getItem('sortAscending') != null) {
      this.setState({sortAscending: Boolean(localStorage.getItem('sortAscending')) });
    }

    if (localStorage.getItem('headerClick') != null) {
      this.setState({headerClick: localStorage.getItem('headerClick') });
    }

    if (!this.props.reducer.pathResolve) {
      let url = window.location.href;
      if (url.split("?").length > 1) {
          let urlParams =  new URLSearchParams(url.split("?")[1]);
          let opportunityId = Number(urlParams.get("opportunityId"));
          if (opportunityId != 0 && opportunityId != NaN) {
              let opportunity = this.props.reducer.opportunities.filter(o => o.id == opportunityId)[0];
              if (opportunity != undefined) {
                this.props.NullNewOpportunityValue();
                this.props.SelectOpportunity(opportunity);
                this.props.SetPathResolveToTrue();
                this.props.ChangeView(VIEWS.viewOpportunity);
              }
          }
      }
    }

    let tmp = this.props.reducer.opportunities;
    tmp.sort((a,b) => {
        let name1 = `${a.account.name.toUpperCase()} ${a.account.name.toUpperCase()}`;
        let name2 = `${b.account.name.toUpperCase()} ${b.account.name.toUpperCase()}`;

          if (name1 < name2) {
              return -1;
          }

          if (name1 > name2) {
              return 1;
          }

        return 0;
    });

    this.setState({opportunities: tmp});

    let accountsFilter = [];
    let statusFilter = [];
    let stagesFilter = [];
    let aeFilter = [];

    this.props.reducer.opportunities.forEach(opportunity => {

      if (accountsFilter.filter(a => a.id == opportunity.account.id).length == 0 ) {
        accountsFilter.push({id: opportunity.account.id, name: opportunity.account.name, isCheck: true});
      }

      if (statusFilter.filter(a => a.id == opportunity.status).length == 0 ) {
        statusFilter.push({id: opportunity.status, name: STATUS[opportunity.status], isCheck: true});
      }

      let stage = this.props.reducer.stages.filter(s => s.id == this.getHighestComponentByPrice(opportunity).stageId)[0];
      if (stagesFilter.filter(a => a.id == stage.id).length == 0 ) {
        stagesFilter.push({id: stage.id, name: `${stage.name} (${stage.percentage}%)`, value: stage.percentage, isCheck: true});
      }
      opportunity.components.forEach(c => {
        if (aeFilter.filter(a => a.id == c.accountExecutiveId).length == 0 ) {
          let user = this.resolveUser(c.accountExecutiveId);
          aeFilter.push({id: c.accountExecutiveId, name: `${user.firstName} ${user.lastName}`, isCheck: true});
        }
      });

    });

    accountsFilter.sort((a,b) => {
      let x = a.name.toLowerCase();
      let y = b.name.toLowerCase();
      if (x < y) { return -1};
      if (x > y) { return 1};
      return 0;
    });

    statusFilter.sort((a,b) => {
      let x = a.name.toLowerCase();
      let y = b.name.toLowerCase();
      if (x < y) { return -1};
      if (x > y) { return 1};
      return 0;
    });

    stagesFilter.sort((a,b) => {
      let x = a.value;
      let y = b.value;
      if (x < y) { return -1};
      if (x > y) { return 1};
      return 0;
    });

    aeFilter.sort((a,b) => {
      let x = a.name.toLowerCase();
      let y = b.name.toLowerCase();
      if (x < y) { return -1};
      if (x > y) { return 1};
      return 0;
    });


    if (accountsFilter.length != 0) {
      accountsFilter.unshift({id: -1, name: 'All', isCheck: true});
    }

    if (statusFilter.length != 0) {
      statusFilter.unshift({id: -1, name: 'All', isCheck: true});
    }

    if (stagesFilter.length != 0) {
      stagesFilter.unshift({id: -1, name: 'All', isCheck: true});
    }

    if (aeFilter.length != 0) {
      aeFilter.unshift({id: -1, name: 'All', isCheck: true});
    }

    this.setState({accountsFilter, statusFilter, stagesFilter, aeFilter});


    if (localStorage.getItem('accountsFilter') != null) {
      let tmp = JSON.parse(localStorage.getItem('accountsFilter'));
      this.setState({accountsFilter: tmp}, this.filterAll);
    }

    if (localStorage.getItem('statusFilter') != null) {
      this.setState({statusFilter: JSON.parse(localStorage.getItem('statusFilter'))}, this.filterAll);
    }

    if (localStorage.getItem('stagesFilter') != null) {
      this.setState({stagesFilter: JSON.parse(localStorage.getItem('stagesFilter'))}, this.filterAll );
    }

    if (localStorage.getItem('aeFilter') != null) {
      this.setState({aeFilter: JSON.parse(localStorage.getItem('aeFilter'))}, this.filterAll );
    }

    
  }

  onNewClick = () => {
    this.props.ChangeView(VIEWS.accountSelection);
  }

  onOpportunityClick = (e) => {
    let opportunity = this.props.reducer.opportunities.filter(o => o.id == e.currentTarget.getAttribute("data-id"))[0];
    this.props.NullNewOpportunityValue();
    this.props.SelectOpportunity(opportunity);
    this.props.ChangeView(VIEWS.viewOpportunity);
  }

  getDealSize = (opportunity) => {
    let deal = computeDealSize(opportunity);
    if (deal >= 1000000) {
      return numeral(deal).format('0.00a');
    } else if (deal >= 1000) {
       return numeral(deal).format('0a');
    } else {
      return deal;
    }
  }

  getHighestComponentByPrice = (opportunity) => {
    let x = opportunity.components[0];
    opportunity.components.forEach(c => {
      if ( (c.pricePerUnit * c.qty) > (x.pricePerUnit * x.qty)) {
        x = c;
      }
    });
    return x;
  }

  resolveUser = (userId) => {
    return this.props.reducer.allUsers.filter(u => u.id == userId)[0];
  }

  getAccountExecutiveInComponents = (components) => {
    let ae = [];
    components.forEach(c => {
      if (ae.indexOf(c.accountExecutiveId) == -1) {
        ae.push(c.accountExecutiveId);
      }
    });

    let txt = "";
    if (ae.length == 1) {
      txt = this.resolveUser(ae[0]).firstName
    } else {
      txt = this.resolveUser(ae[0]).firstName
      for (let index = 1; index < ae.length; index++) {
        if (index+1==ae.length) {
          txt += `, & ${this.resolveUser(ae[index]).firstName}`;
        } else {
          txt += `, ${this.resolveUser(ae[index]).firstName}`;
        }
        
      }
    }

    return txt;
  }

  onCheckboxClick = (stateName, checkbox) => {
    let stateProperty = JSON.parse(JSON.stringify(this.state[stateName]));
    let isCheck = !checkbox.isCheck;
    let isAllSelected = true;

    // -1 means user click All
    if (checkbox.id == -1) {
      stateProperty.forEach(x => {
          x.isCheck = isCheck;
      });
    } else {
      stateProperty.forEach(x => {
        if (x.id == checkbox.id) {
          x.isCheck = isCheck;
        }
      });
    }

    //Check if all is selected
    stateProperty.forEach(x => {
      //x.id != -1 skip All checkbox
      if (x.isCheck == false && x.id != -1 ) { 
        isAllSelected = false;
      }
    });
    stateProperty[0] = {id: -1, name: 'All', isCheck: isAllSelected};
    //store the filter
    localStorage.setItem(stateName, JSON.stringify(stateProperty));
    this.setState({[stateName]: stateProperty, }, this.filterAll);
  }

  filterAll = () => {
    let opportunities = this.props.reducer.opportunities;

    let listIsFilteredByTmp = [];
    
    //the first index is always All checkbox
    if (this.state.accountsFilter[0].isCheck == false) {
      listIsFilteredByTmp.push('Accounts');
    }

    if (this.state.statusFilter[0].isCheck == false) {
      listIsFilteredByTmp.push('Status');
    }

    if (this.state.stagesFilter[0].isCheck == false) {
      listIsFilteredByTmp.push('Stages');
    }

    if (this.state.aeFilter[0].isCheck == false) {
      listIsFilteredByTmp.push('Account Executives');
    }


    this.setState({listIsFilteredBy: listIsFilteredByTmp});


    let accountsFilter = this.state.accountsFilter.filter(a => a.isCheck && a.id != -1);
    let statusFilter = this.state.statusFilter.filter(a => a.isCheck && a.id != -1);
    let stagesFilter = this.state.stagesFilter.filter(a => a.isCheck && a.id != -1);
    let aeFilter = this.state.aeFilter.filter(a => a.isCheck && a.id != -1);

    opportunities = opportunities.filter(o => accountsFilter.filter(b => b.id == o.account.id).length == 1);
    opportunities = opportunities.filter(o => statusFilter.filter(b => b.id == o.status).length == 1);
    opportunities = opportunities.filter(o => stagesFilter.filter(b => b.id == this.getHighestComponentByPrice(o).stageId).length == 1);
    let tmpOpp = [];

    opportunities.forEach(opportunitiy => {
      let hasAE = false;
      opportunitiy.components.forEach(c => {
        if (aeFilter.filter(f => f.id == c.accountExecutiveId).length >=1) {
          hasAE = true;
        }
      });
      if (hasAE) {
        tmpOpp.push(opportunitiy);
      }
    });


    this.setState({opportunities: tmpOpp});
  }

  searchAccountOpportunity = (keyword) => {
    if (keyword == "") {
      this.clearSearch();
    } else {
      let tmp = this.state.opportunities.filter(o => o.account.name.toUpperCase().indexOf(keyword.toUpperCase()) != -1);
      this.setState({opportunities: tmp});
    }
  }

  clearSearch = () => {
    this.setState({opportunities: this.props.reducer.opportunities, searchAccount: ""});
  }

  sort = (sortAsc, value1, value2) => {
    if (sortAsc) {
      if (value1 < value2) {
          return -1;
      }

      if (value1 > value2) {
          return 1;
      }
    } else {
      if (value1 < value2) {
        return 1;
      }
      if (value1 > value2) {
          return -1;
      }
    }

    return 0;
  }

  onAccountHeaderClick = () => {
    let sortAsc = !this.state.sortAscending;
    let tmp = this.state.opportunities;

    tmp.sort((a,b) => {
        let value1 = `${a.account.name.toUpperCase()} ${a.account.name.toUpperCase()}`;
        let value2 = `${b.account.name.toUpperCase()} ${b.account.name.toUpperCase()}`;
        return this.sort(sortAsc, value1, value2);  
    });

    this.setState({opportunities: tmp, sortAscending: sortAsc, headerClick: HEADER.ACCOUNT});
    localStorage.setItem('sortAscending', String(sortAsc));
    localStorage.setItem('headerClick', String(HEADER.ACCOUNT));

  }

  onDealSizeHeaderClick = () => {
    let sortAsc = !this.state.sortAscending;
    let tmp = this.state.opportunities;

    tmp.sort((a,b) => {
        let value1 = computeDealSize(a);
        let value2 = computeDealSize(b);
        return this.sort(sortAsc, value1, value2);  
    });

    this.setState({opportunities: tmp, sortAscending: sortAsc, headerClick: HEADER.DEAL_SIZE});
    localStorage.setItem('sortAscending', String(sortAsc));
    localStorage.setItem('headerClick', String(HEADER.DEAL_SIZE));
  }

  onDescriptionHeaderClick = () => {
    let sortAsc = !this.state.sortAscending;
    let tmp = this.state.opportunities;

    tmp.sort((a,b) => {
        let value1 = this.getHighestComponentByPrice(a).description;
        let value2 = this.getHighestComponentByPrice(b).description
        return this.sort(sortAsc, value1, value2);  
    });

    this.setState({opportunities: tmp, sortAscending: sortAsc, headerClick: HEADER.DESCRIPTION});
    localStorage.setItem('sortAscending', String(sortAsc));
    localStorage.setItem('headerClick', String(HEADER.DESCRIPTION));
  }

  onStageHeaderClick = () => {
    let sortAsc = !this.state.sortAscending;
    let tmp = this.state.opportunities;

    tmp.sort((a,b) => {
        let value1 = this.props.reducer.stages.filter(s => s.id == this.getHighestComponentByPrice(a).stageId)[0].percentage;
        let value2 = this.props.reducer.stages.filter(s => s.id == this.getHighestComponentByPrice(b).stageId)[0].percentage;
        return this.sort(sortAsc, value1, value2);  
    });

    this.setState({opportunities: tmp, sortAscending: sortAsc, headerClick: HEADER.STAGE});
    localStorage.setItem('sortAscending', String(sortAsc));
    localStorage.setItem('headerClick', String(HEADER.STAGE));
  }

  onCloseDateHeaderClick = () => {
    let sortAsc = !this.state.sortAscending;
    let tmp = this.state.opportunities;

    tmp.sort((a,b) => {
      let hca = this.getHighestComponentByPrice(a);
      let hcb = this.getHighestComponentByPrice(b);

      let d = new Date();
      let d2 = new Date();

      let value1;
      let value2;
     
      if (hca.targetCloseDate == null) {
        d.setFullYear(1899);
        value1 = d;
      } else {
        d.setFullYear(Number(moment(hca.targetCloseDate).format('YYYY')));
        d.setMonth(Number(moment(hca.targetCloseDate).format('M'))-1);
        value1 = d;
      }

      if (hcb.targetCloseDate == null) {
        d2.setFullYear(1899);
        value2 = d2;
      } else {
        d2.setFullYear(Number(moment(hcb.targetCloseDate).format('YYYY')));
        d.setMonth(Number(moment(hcb.targetCloseDate).format('M'))-1);
        value2 = d2;
      }
        
        return this.sort(sortAsc, value1, value2);  
    });

    this.setState({opportunities: tmp, sortAscending: sortAsc, headerClick: HEADER.CLOSE_DATE});
    localStorage.setItem('sortAscending', String(sortAsc));
    localStorage.setItem('headerClick', String(HEADER.CLOSE_DATE));
  }

  onAccountExecutiveHeaderClick = () => {
    let sortAsc = !this.state.sortAscending;
    let tmp = this.state.opportunities;

    tmp.sort((a,b) => {
        let value1 = String(this.getAccountExecutiveInComponents(a.components)).toUpperCase();
        let value2 = String(this.getAccountExecutiveInComponents(b.components)).toUpperCase();
        return this.sort(sortAsc, value1, value2);  
    });

    this.setState({opportunities: tmp, sortAscending: sortAsc, headerClick: HEADER.ACCOUNT_EXECUTIVE});
    localStorage.setItem('sortAscending', String(sortAsc));
    localStorage.setItem('headerClick', String(HEADER.ACCOUNT_EXECUTIVE));
  }

  onStatusHeaderClick = () => {
    let sortAsc = !this.state.sortAscending;
    let tmp = this.state.opportunities;

    tmp.sort((a,b) => {
        let value1 = STATUS[a.status];
        let value2 = STATUS[b.status];
        return this.sort(sortAsc, value1, value2);  
    });

    this.setState({opportunities: tmp, sortAscending: sortAsc, headerClick: HEADER.STATUS});
  }

  public render(): React.ReactElement<any> {
    let totalDealSize = 0;
    let totalDealSizeTimesPercent = 0;
    let i = [];
    for (let index = 0; index < 100; index++) {
      i.push(index);
    }

    const {searchAccount, headerClick, sortAscending} = this.state;

    return (
        <div className={ styles.stcPipeline }>
            <div className={`${styles.row}`}>
              <h1>Opportunities</h1>
              <div className={`${styles.leftAuto} ${styles.row}`}>
                <div className={`${styles.stcButtonSecondary}`} onClick={e => { this.setState({showFilters: true}) }} >Filters</div>
                <div className={`${styles.stcButtonPrimary}`} onClick={this.onNewClick}>New</div>
              </div>
            </div>
            <form>
              <div className={styles.formGroup}>
                  <label>Search Account</label>
                  <input type="text" name="searchAccount" value={searchAccount} onChange={e => { onFieldChange(e,this); this.searchAccountOpportunity(e.currentTarget.value);  }} />
                  <div className={`${styles.stcButtonWithInput}`} onClick={this.clearSearch} >Clear</div>
              </div>
            </form>
            {
              this.state.listIsFilteredBy.length != 0 &&
              <p style={{fontWeight: 'bold'}}>List is filtered by: {this.state.listIsFilteredBy.toString()}</p>
            }
            <table className={styles.simpleList}>
              <thead>
                <tr>
                  <td onClick={this.onAccountHeaderClick} style={{cursor: 'pointer'}}>
                    <div className={headerClick == HEADER.ACCOUNT && `${sortAscending ? styles.arrow_up : styles.arrow_down }`}>Account</div>
                  </td>
                  <td onClick={this.onDealSizeHeaderClick} style={{cursor: 'pointer'}}>
                    <div className={headerClick == HEADER.DEAL_SIZE && `${sortAscending ? styles.arrow_up : styles.arrow_down }`}>Deal Size</div>
                  </td>
                  <td onClick={this.onDescriptionHeaderClick} style={{cursor: 'pointer'}}>
                    <div className={headerClick == HEADER.DESCRIPTION && `${sortAscending ? styles.arrow_up : styles.arrow_down }`}>Description</div>
                  </td>
                  <td onClick={this.onStageHeaderClick} style={{cursor: 'pointer'}}>
                    <div className={headerClick == HEADER.STAGE && `${sortAscending ? styles.arrow_up : styles.arrow_down }`}>Stage</div>
                  </td>
                  <td onClick={this.onCloseDateHeaderClick} style={{cursor: 'pointer'}}>
                    <div className={headerClick == HEADER.CLOSE_DATE && `${sortAscending ? styles.arrow_up : styles.arrow_down }`}>Close Date</div>
                  </td>
                  <td onClick={this.onAccountExecutiveHeaderClick} style={{cursor: 'pointer'}}>
                    <div className={headerClick == HEADER.ACCOUNT_EXECUTIVE && `${sortAscending ? styles.arrow_up : styles.arrow_down }`}>Account Executive</div>
                  </td>
                  <td onClick={this.onStatusHeaderClick} style={{cursor: 'pointer'}}>
                    <div className={headerClick == HEADER.STATUS && `${sortAscending ? styles.arrow_up : styles.arrow_down }`}>Status</div>
                  </td>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.opportunities.map(opportunity => {
                    let hc = this.getHighestComponentByPrice(opportunity);
                    let percent = this.props.reducer.stages.filter(s => s.id == hc.stageId)[0].percentage;
                    let ds = computeDealSize(opportunity);
                    totalDealSize += ds;
                    totalDealSizeTimesPercent += ds * (percent/100);
                    return <tr key={opportunity.id} onClick={this.onOpportunityClick} data-id={opportunity.id}>
                    <td>{opportunity.account.name}</td>
                    <td>₱{this.getDealSize(opportunity)}</td>
                    <td>{hc.description}</td>
                    <td>{percent}%</td>
                    <td>{hc.targetCloseDate == null || hc.targetCloseDate == "1899-12-01T00:00:00" ? "" : moment(hc.targetCloseDate).format('MMM YYYY') }</td>
                    <td>{this.getAccountExecutiveInComponents(opportunity.components)}</td>
                    <td>{STATUS[opportunity.status]}</td>
                  </tr>
                  })
                }
              </tbody>
            </table>
            <div>
              <p><b>Total Deal Size:</b> ₱{numeral(totalDealSize).format('0,0.00')}<br/>
              <b>Total of Deal Size x Percent: </b>₱{numeral(totalDealSizeTimesPercent).format('0,0.00')}</p>
            </div>
            <div className={this.state.showFilters ? `${styles.filter} ${styles.showFilter}` : `${styles.filter} ${styles.hideFilter}`}>
              <div className={`${styles.row}`}>
                <div className={`${styles.stcButtonSecondary} ${styles.leftAuto}`} onClick={e => { this.setState({showFilters: false}) }} >Hide Filters</div>
              </div>
              <div style={{padding: '10px'}}>
                <p className={styles.filterName}>Accounts</p>
                  <div className={`${styles.filterContainer}`}>
                    {
                      this.state.accountsFilter.map(a => <div key={a.id} className={`${styles.filterCheckbox}`}><input type="checkbox" value={a.id} checked={a.isCheck} onClick={e => { this.onCheckboxClick('accountsFilter',a);  }} /> <span>{a.name}</span> <br/></div>)
                    }
                  </div>
                <p className={styles.filterName}>Status</p>
                  <div className={`${styles.filterContainer}`}>
                    {
                      this.state.statusFilter.map(a => <div key={a.id} className={`${styles.filterCheckbox}`}><input type="checkbox" value={a.id} checked={a.isCheck} onClick={e => { this.onCheckboxClick('statusFilter',a);  }} /> <span>{a.name}</span> <br/></div>)
                    }
                  </div>
                <p className={styles.filterName}>Stage</p>
                  <div className={`${styles.filterContainer}`}>
                    {
                      this.state.stagesFilter.map(a => <div key={a.id} className={`${styles.filterCheckbox}`}><input type="checkbox" value={a.id} checked={a.isCheck} onClick={e => { this.onCheckboxClick('stagesFilter',a);  }} /> <span>{a.name}</span> <br/></div>)
                    }
                  </div>
                <p className={styles.filterName}>Account Executive</p>
                <div className={`${styles.filterContainer}`}>
                    {
                      this.state.aeFilter.map(a => <div key={a.id} className={`${styles.filterCheckbox}`}><input type="checkbox" value={a.id} checked={a.isCheck} onClick={e => { this.onCheckboxClick('aeFilter',a);  }} /> <span>{a.name}</span> <br/></div>)
                    }
                  </div>
              </div>
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
  
export default connect(mapStateToProps,mapActionCreatorsToProps)(OpportunityListComponent);