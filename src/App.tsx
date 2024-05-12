import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Welcome from './Welcome';
import Main from './Main';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/obk-console" Component={Welcome} />
        <Route path="/obk-console/:namespace/:authorizator/main" Component={Main} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;
