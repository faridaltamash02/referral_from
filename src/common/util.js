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
      
      

}