import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import QuestionPage from '../pages/QuestionPage';
import ResultPage from '../pages/ResultPage';

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/question" element={<QuestionPage />} />
      <Route path="/result/:type" element={<ResultPage />} />
    </Routes>
  );
}

export default AppRouter;
