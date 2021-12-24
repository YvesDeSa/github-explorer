import React from 'react';
import { BrowserRouter } from 'react-router-dom'

import { Router } from './routes';
import GlobalStyle from './style/global'

const App: React.FC = () => (
  <>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
    <GlobalStyle />
  </>
);

export default App;
