import React, { useState } from 'react';
import  OtpForm from './otp-form';


function EquityChoiceForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    equityChoice: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    setFormData({ firstName: '', lastName: '', email: '', equityChoice: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="equity-form">
       <div className="flex gap30">
        <div className="form-group w-50">
          {/* <label htmlFor="firstName" className={formData.firstName ? 'hidden-label' : ''}>First Name</label> */}
          <input
            type="text"
            id="firstName"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group w-50">
          {/* <label htmlFor="lastName" className={formData.lastName ? 'hidden-label' : ''}>Last Name</label> */}
          <input
            type="text"
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="form-group">
        {/* <label htmlFor="email" className={formData.email ? 'hidden-label' : ''}>Email</label> */}
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group nf-select w-50">
        {/* <label htmlFor="equityChoice" className={formData.equityChoice ? 'hidden-label' : ''}>Equity Choice</label> */}
        <select
          id="equityChoice"
          name="equityChoice"
          value={formData.equityChoice}
          onChange={handleChange}
          placeholder="Equity Choice"
          required
        >
          <option value="" disabled>Equity Choice</option>
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </select>
      </div>
      <OtpForm/>
      <button className="nf-btn nf-btn-priamry mT30" type="submit">Submit</button>
    </form>
  );
}

export default EquityChoiceForm;

