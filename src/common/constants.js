export default class CommonConstants{
    /* for getting loan Type from URL */
  getLoanType(btnText, equityLoan = false) {
    let id = window.location.href;
    let final = id.split('/')[3];
    if (final == 'refinance') {
      final = id.split('/')[4] || 'get-started';
    }

    const btnTextLower = btnText.toLowerCase();
    let leadPurpose;
    let g_loanType = (btnTextLower.indexOf('refinance') > -1) ? 'REF' : 'PUR';

    if (final == 'investment-property-loans-made-easy') {
      final = 'get-started';
      g_loanType = (btnTextLower.indexOf('refinance') > -1) ? 'REF' : 'PUR';
    } else if (final == 'step-up-mortgages') {
      final = 'step-up';
      g_loanType = (btnTextLower.indexOf('refinance') > -1) ? 'REFSTEPUP' : 'PURSTEPUP';
    } else if (equityLoan == 'equitychoice') {
      final = 'equitychoice';
    }

    const leadPurposeMap = {
      'fortyyearmortgage': 'REFFYP',
      '40-year-mortgage': 'REFFYP',
      'lower-mortgage-payment': 'REFLMP',
      'pay-off-mortgage-early': 'REFFMP',
      'no-closing-costs': 'REFLMP',
      'cash-out-refinance': 'REFCO',
      'debt-consolidation': 'REFCD',
      'adjustable-rate-mortgages-arms': 'REFAF',
      'equitychoice': 'REFNSAM',
      'equitychoice-transunion': 'REFNSAM',
      'ecmailer': 'REFNSAM',
      'bankrate-x-newfi': 'REFCES',
      'get-started': g_loanType,
      'step-up': g_loanType,
    };

    leadPurpose = leadPurposeMap[final] || g_loanType;
    let loanManagerEmail = '';
    if (final.indexOf('get-started') > -1 == 'get-started' || final == 'step-up') {
      loanManagerEmail = 'glenn@newfi.com';
    }

    return { leadPurpose, loanManagerEmail };
  }

  getEquityChoiceState(){
   return {
      "resultObject": [
          {
              "id": 16,
              "stateCode": "AZ",
              "stateName": "Arizona"
          },
          {
              "id": 31,
              "stateCode": "CA",
              "stateName": "California"
          },
          {
              "id": 46,
              "stateCode": "CO",
              "stateName": "Colorado"
          },{
            "id": 38,
              "stateCode": "CT",
              "stateName": "Connecticut"
          },{
            "id": 8,
              "stateCode": "DE",
              "stateName": "Delaware"
          },{
              "id": 29,
              "stateCode": "GA",
              "stateName": "Georgia"
            },{
              "id": 7,
              "stateCode": "ID",
              "stateName": "Idaho"
            },{
              "id": 41,
              "stateCode": "KY",
              "stateName": "Kentucky"
            }, {
              "id": 44,
              "stateCode": "LA",
              "stateName": "Louisiana"
            },{
              "id": 4,
              "stateCode": "ME",
              "stateName": "Maine"
            },{
              "id": 6,
              "stateCode": "MI",
              "stateName": "Michigan"
            },{
              "id": 22,
              "stateCode": "MO",
              "stateName": "Missouri"
            },{
              "id": 33,
              "stateCode": "NC",
              "stateName": "North Carolina"
            },{
              "id": 27,
              "stateCode": "NJ",
              "stateName": "New Jersey"
            },{
              "id": 28,
              "stateCode": "NM",
              "stateName": "New Mexico"
            },{
              "id": 34,
              "stateCode": "OH",
              "stateName": "Ohio"
            },{
              "id": 32,
              "stateCode": "OK",
              "stateName": "Oklahoma"
            },{
              "id": 43,
              "stateCode": "OR",
              "stateName": "Oregon"
            },{
              "id": 47,
              "stateCode": "SC",
              "stateName": "South Carolina"
            }
      ]
    }
  }
      
}
