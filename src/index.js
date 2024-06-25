import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
// import { PostHogProvider } from 'posthog-js/react'

import './output.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <PostHogProvider
      apiKey={'phc_syDjDAqxZrpHGRktHaKwxB7vIecREHjjHkuW2qiuuhs'}
      options={{
        api_host: '"https://us.i.posthog.com"',
      }}
    > */}
      <App />
      
    {/* </PostHogProvider> */}
  </React.StrictMode>
);