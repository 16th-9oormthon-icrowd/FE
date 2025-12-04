import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './layout/Layout';
import SelectPage from './pages/Selection/SelectPage';
import QuestionPage from './pages/Question/Question';
import Completion from './pages/onboarding/Completion';
import SelectCompletion from './pages/Selection/SelectCompletion';
import Start from './pages/onboarding/Start';
import Final from './pages/Final/Final';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path='/selection/select' element={<SelectPage />} />
            <Route path='/onboarding/completion' element={<Completion />} />
            <Route path='/selection/completion' element={<SelectCompletion />} />
          </Route>
          <Route index element={<Start />} />
          <Route path='/question' element={<QuestionPage />} />
          <Route path='/final' element={<Final />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
