import React from 'react';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import './index.css';
import GetStartedForm from './component/get-started-form';
import EquityChoiceForm from './component/equitychoice-form';
import {LoaderProvider, useLoader} from './common/services/context/loadingContext';



// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <LoaderProvider>
//       <GetStartedForm />
//     </LoaderProvider>
//   </React.StrictMode>
// );

const reactRoots = document.querySelectorAll('.react-root');

reactRoots.forEach((container, index) => {
  const component = container.getAttribute('data-component');
  const root = ReactDOM.createRoot(container);
  // root.render(<App />);
  // Render the appropriate component based on the attribute
  if (component == 'get-started') {
    root.render(<StrictMode><LoaderProvider><GetStartedForm key={index}/></LoaderProvider></StrictMode>);
  } else if (component == 'equityChoice') {
      root.render(<StrictMode><LoaderProvider><EquityChoiceForm key={index}/></LoaderProvider></StrictMode>);
  } else {
      root.render(<StrictMode><LoaderProvider><GetStartedForm key={index}/></LoaderProvider></StrictMode>);
  }
});


