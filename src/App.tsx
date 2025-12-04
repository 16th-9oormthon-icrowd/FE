import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './pages/Home/Home';
import Completion from './pages/onboarding/Completion';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='/onboarding/completion' element={<Completion />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
