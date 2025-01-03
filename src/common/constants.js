export default class CommonConstants{
    /* for getting loan Type from URL */
    getLoanType(btnText, equityLoan=false) {
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
        if(final.indexOf('get-started')>-1 == 'get-started' || final == 'step-up'){
          loanManagerEmail = 'glenn@newfi.com';
        }
      
        return {leadPurpose, loanManagerEmail};
      }
      
}
