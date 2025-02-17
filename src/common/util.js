export default class Util{
    validateName = (name) => {
        const nameRegex = /^[A-Za-z\s]+$/; // Only allows letters and spaces
        return nameRegex.test(name);
      };
      
    validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format
        return emailRegex.test(email);
      };
      
      formatPhoneNumber = (phoneNumber) => {
        const cleanedPhoneNumber = phoneNumber.replace(/\D/g, '');
        let formattedNumber = '';
      
        if (cleanedPhoneNumber.length > 0) {
          if (cleanedPhoneNumber.length <= 3) {
            formattedNumber = `(${cleanedPhoneNumber.slice(0, 3)}`;
          } else if (cleanedPhoneNumber.length <= 6) {
            formattedNumber = `(${cleanedPhoneNumber.slice(0, 3)}) ${cleanedPhoneNumber.slice(3, 6)}`;
          } else if (cleanedPhoneNumber.length <= 10) {
              formattedNumber = `(${cleanedPhoneNumber.slice(0, 3)}) ${cleanedPhoneNumber.slice(3, 6)}-${cleanedPhoneNumber.slice(6,10)}`;
          } else {
              formattedNumber = `(${cleanedPhoneNumber.slice(0, 3)}) ${cleanedPhoneNumber.slice(3, 6)}-${cleanedPhoneNumber.slice(6,10)}`;
          }
        }
      
      
        return formattedNumber;
      };
      
      formatCurrency(housePrice) {
        const numericValue = housePrice.replace(/[^0-9]/g, '');
        if (!numericValue) {  // Handles empty string or NaN resulting from parseInt("")
           return '';
        }
        const formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        });
        return formatter.format(numericValue); // No need for parseInt; numericValue is now always a valid numeric string or empty
    }

    formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
    };
}