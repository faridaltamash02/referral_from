import React, { useEffect, useRef } from 'react';
export default function Dropdown({options, onChange, name, onBlur, onFocus}){
    const selectRef = useRef(null);
    useEffect(() => { if (selectRef.current) { selectRef.current.tabIndex = 3; } }, []);
    return(
      <select ref={selectRef}
      onChange={onChange} 
      onBlur={onBlur} 
      onFocus={onFocus}
      name={name} 
      className="nf-select nf-form-select" 
      data-exclude-select2="true"
  >
      <option value="">Property State</option>
      {options.map((state) => (
          <option key={state.id} value={state.stateName}>
              {state.stateName}
          </option>
      ))}
  </select>
    )
}
