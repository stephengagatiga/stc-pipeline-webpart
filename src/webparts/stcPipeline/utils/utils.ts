export function isInteger(value) {
    return typeof value === 'number' && 
      isFinite(value) && 
      Math.floor(value) === value;
};

export function onFieldChange(e,thisObj) {
    let name = e.target.getAttribute('name');
    let value = e.target.value;
    thisObj.setState({
      [name]: value
    });
}

export function getDaysArray(year, month) {
    const date = new Date(year, month - 1, 1);
    const result = [];
    while (date.getMonth() == month - 1) {
      result.push({text: date.getDate().toString(), value: date.getDate()});
      date.setDate(date.getDate() + 1);
    }
    return result;
}



export const getMonthsArray = [
  {text: "January", value: 1},
  {text: "February", value: 2},
  {text: "March", value: 3},
  {text: "April", value: 4},
  {text: "May", value: 5},
  {text: "June", value: 6},
  {text: "July", value: 7},
  {text: "August", value: 8},
  {text: "September", value: 9},
  {text: "October", value: 10},
  {text: "November", value: 11},
  {text: "December", value: 12}
];

export function getYearsArray(inputYear = new Date().getFullYear()) {
  let years = [];
  let startYear = null;

  if (inputYear == null) {
    startYear = new Date().getFullYear();
  } else {
    //if inputYear is greater than current year start from current year
    //this need when editing the year when user selected a higher year from current year
    //then during edit mode you need show tha years from current year not from inputYear
    startYear = inputYear > new Date().getFullYear() ? new Date().getFullYear() : inputYear;
  }

  let curYearPlus5 = new Date().getFullYear()+5;
  for(let i = startYear; i <= curYearPlus5; i++) {
    years.push({text: i.toString(), value: i});
  }
  return years;
}

export function computeOpportunityProperty(opportunity) {
  let revenue = 0;
  let requireBigDealCode = false;
  let bigDealCode = "";
  let totalCost = 0;
  let highestStage = 0;
  let countCategoryIsSoftware = 0;
  let hasComponentServiceAndPercentAbove25 = false;

  // Big Deal Code is required if one of the following conditions has been met:
  // 1. Has Component stage with greater than 25% and category is service. Opportunity with deal size of 1M and above.
  // 2. Has Component stage with greater than 25%. Opportunity with multiple software with deal size of 1M and above.
  // 3. Has Component stage with greater than 25%. Opportunity with total Deal Size equal to 5M and above.
  // 4. Account industry is equal to "Government".

  opportunity.components.forEach(c => {           
      let tmpPrice = (c.pricePerUnit * c.qty);
      let tmpCost = (c.costPerUnit * c.qty);
      revenue += tmpPrice;
      totalCost += tmpCost;

      if (highestStage < c.stage.percentage) {
        highestStage = c.stage.percentage;
      }

      if (c.category.name == "Software") {
        countCategoryIsSoftware++;
      }

      if (c.stage.percentage > 25 && c.category.name == "Service") {
        hasComponentServiceAndPercentAbove25 = true;
      }
  });

  //No. 1 rule in Big Deal Code requirement
  if (hasComponentServiceAndPercentAbove25 && revenue >= 1000000 ) {
    requireBigDealCode = true;
    bigDealCode = opportunity.bigDealCode;
  }

  //No. 2 rule in Big Deal Code requirement
  if (highestStage > 25 && countCategoryIsSoftware >= 2 && revenue >= 1000000) {
    requireBigDealCode = true;
    bigDealCode = opportunity.bigDealCode;
  }

  //No. 3 rule in Big Deal Code requirement
  if (highestStage > 25 && revenue >= 5000000) {
    requireBigDealCode = true;
    bigDealCode = opportunity.bigDealCode;
  }

  //No. 4 rule in Big Deal Code requirement
  if (opportunity.account.industry != null) {
    if (opportunity.account.industry.name == "Government") {
        requireBigDealCode = true;
        bigDealCode = opportunity.bigDealCode;
    }
  }
  
  return {dealSize: revenue, requireBigDealCode, bigDealCode, grossProfit: (revenue - totalCost)};
}

export function computeDealSize(opportunity) {
  let dealSize = 0;
  opportunity.components.forEach(c => {
    dealSize += (c.pricePerUnit * c.qty); 
  });
  return dealSize;
}

export function onCategoryChange (thisObject, value) {
  let componentTypeId = thisObject.state.componentTypeId;

  //When category change set the componentTypeId to null if it doesnt exist 
  //in current value of componentType
  if (thisObject.props.reducer.componentTypes.filter(t => t.categoryId == value).filter(a => a.id == thisObject.state.componentTypeId).length == 0) {
      componentTypeId = null;
  }

  thisObject.setState({categoryId: value, componentTypeId}, function() {
      //Check if the opportunity meets the requirement to have Big Deal Code
      // Check only if current opportunity is already added
      if (thisObject.props.reducer.newOpportunity == null) { 
        thisObject.checkBigDealCode();
      }
  });

}

export function onPrincipalChange(thisObject, value)  {
  let productId = thisObject.state.productId;
  //Get the principal 
  let tmpPrincipals = thisObject.props.reducer.products.filter(p => p.id == value);

  //When principal value changed set the productId to null
  //If productId doesnt exist in current principal products
  if (tmpPrincipals.length != 0) {
      if (Array.isArray(tmpPrincipals[0].products)) {
          if (tmpPrincipals[0].products.filter(p => p.id == productId).length == 0) {
              productId =  null;
          }   
      } else {
          productId = null;
      } 
  } else {
      productId = null;
  }

  thisObject.setState({principalId: value, productId }); 
}

export function onPriceChange(thisObject, value) {

  //Dont allow user adding wholenumber after 0
  if (value == "0") {
      thisObject.setState({pricePerUnit: value });
      return true;
  }
  //Accept only valid price number
  let result = /^(?!0)[\d]*[.]?[\d]*$/g.test(value);
  if (result) {
      thisObject.setState({pricePerUnit: value }, function() {
          //Check if the opportunity meets the requirement to have Big Deal Code
          // Check only if current opportunity is already added
          if (thisObject.props.reducer.newOpportunity == null) {
              thisObject.checkBigDealCode();
          }
      });
  }
}

export function onCostChange(thisObject, value) {

  //Dont allow user adding wholenumber after 0
  if (value == "0") {
      thisObject.setState({costPerUnit: value });
      return true;
  }
  //Accept only valid price number
  let result = /^(?!0)[\d]*[.]?[\d]*$/g.test(value);
  if (result) {
      thisObject.setState({costPerUnit: value });
  }
}

export function onQuantityChange(thisObject, value) {
  //prevent adding number with leading zero
  if (value == "0") {
      return false;
  }

  value = Number(value);
  //Allow only whole number and blank value
  if (isInteger(value) || String(value) == "") {
      thisObject.setState({qty: value }, function() {
          //Check if the opportunity meets the requirement to have Big Deal Code
          // Check only if current opportunity is already added
          if (thisObject.props.reducer.newOpportunity == null) {
              thisObject.checkBigDealCode();
          }
      });
  }
}

export function onValidityDateYearChange(thisObject, value) {
  let year = value;
  let month = thisObject.state.validityDateMonth;
  thisObject.setState({validityDateYear: year});

  //If the validiDateDay value doesnt exist in current month set it to null
  //This applies during month of feb ir the year is leap year
  if (getDaysArray(year,month).filter(i => i.value == thisObject.state.validityDateDay).length == 0) {
    thisObject.setState({validityDateDay: null});
  }
}

export function onValidityDateMonthChange(thisObjet,value) {
  let month = value;
  let year = thisObjet.state.validityDateYear;
  thisObjet.setState({validityDateMonth: month});

  //If the validiDateDay value doesnt exist in current month set it to null
  if (getDaysArray(year,month).filter(i => i.value == thisObjet.state.validityDateDay).length == 0) {
    thisObjet.setState({validityDateDay: null});
  }
}

export function checkBigDealCode(thisObject, opportunity) {
  const {categoryId,pricePerUnit,costPerUnit,qty,stageId} = thisObject.state;

  let category = {};
  let stage = {};

  //Get the value of category
  if (categoryId == null) {
      category["name"] = "";
  } else {
      category = thisObject.props.reducer.categories.filter(c => c.id == categoryId)[0];
  }

  //Get the value of stage
  if (stageId == null) {
      stage["percentage"] = 0;
  } else {
      stage = thisObject.props.reducer.stages.filter(s => s.id == stageId)[0];
  }

  let data = {};
  data["pricePerUnit"] = Number(pricePerUnit);
  data["costPerUnit"] = Number(costPerUnit);
  data["qty"] = Number(qty);

  data["stageId"] = Number(stageId);
  data["stage"] = stage;

  data["categoryId"] = Number(categoryId);
  data["category"] = category;
  
  //JSON.parse & JSON.stringify prevent the object copying by reference
  let tmpOpportunity = JSON.parse(JSON.stringify(opportunity)); 
  tmpOpportunity["components"].push(data);

  let tmpOpportunityProperty = computeOpportunityProperty(tmpOpportunity);

  //Show only the big deal code field when the opportunity big deal code is unset
  if (tmpOpportunityProperty.requireBigDealCode && tmpOpportunity["bigDealCode"] == "") {
    thisObject.setState({requireBigDealCode: true});
  } else {
    thisObject.setState({requireBigDealCode: false});
  }

}

export function validateComponent(state,propsCategories,propsProducts,propsStages,propsComponentTypes) {
  let category = null;
  let product = null;
  let stage = null;
  let componentType = null;
  let errors = [];

  if (state.categoryId == null) {
      errors.push('Category is required');
  } else {
      category = propsCategories.filter(c => c.id == state.categoryId)[0];
  }

  if (state.productId == null) {
      errors.push('Product is required');
  } else {
      product  = propsProducts.filter(p => p.id == state.principalId)[0].products.filter(p => p.id == state.productId)[0];
  }

  if (state.targetCloseDateMonth != null || state.targetCloseDateYear != null) {
      if (state.targetCloseDateMonth == null) {
          errors.push('Month is empty in target close date');
      }
      if (state.targetCloseDateYear == null) {
          errors.push('Year is empty in target close date');
      }
  }

  if (state.description.trim() == "") {
      errors.push('Description is required');
  }

  if (state.remarks.trim() == "") {
      errors.push('Remarks is required');
  }

  if (state.validityDateDay != null || state.validityDateMonth != null || state.validityDateYear != null) {
      if (state.validityDateDay == null) {
          errors.push('Day is empty in validity date');
      }
      if (state.validityDateMonth == null) {
          errors.push('Month is empty in validity date');
      }
      if (state.validityDateYear == null) {
          errors.push('Year is empty in validity date');
      }
  }

  if (state.requireBigDealCode) {
      if (state.bigDealCode.trim() == "") {
          errors.push('Big deal code is required');
      }
  }

  if (state.stageId == null) {
      errors.push('Stage is required');
  } else {
      stage = propsStages.filter(s => s.id == state.stageId)[0];

      if (state.componentTypeId != null) {
          componentType = propsComponentTypes.filter(c => c.id == state.componentTypeId)[0];
      }

      if (stage.percentage > 5) {
          if (state.componentTypeId == null) {
              errors.push('Component type is required');
          }
          if (Number(state.pricePerUnit) == 0) {
              errors.push('Price per unit is required');
          }
          if (String(state.costPerUnit) == "") {
              errors.push('Cost per unit is required');
          }
          if (Number(state.quantity) == 0) {
              errors.push('Quantity is required');
          }
      }
  }

  if (state.accountExecutiveId == null) {
    errors.push('Account Executive is required');
  }

  if (state.solutionsArchitectId == null) {
    errors.push('Solutions Architect is required');
  }

  return {category, product, stage, componentType, errors};

}