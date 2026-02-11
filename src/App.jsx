import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Chat from './Chat';
import Layout from './Layout';
import Modules from './Modules';
import Lessons from './Lessons';
import LessonPlayer from './LessonPlayer';
import Feed from './Feed';

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rotas Protegidas dentro do Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/modules" />} />
          <Route path="dashboard" element={<Navigate to="/modules" />} />

          <Route path="modules" element={<Modules />} />
          <Route path="modules/:id" element={<Lessons />} />
          <Route path="lessons/:id" element={<LessonPlayer />} />

          <Route path="feed" element={<Feed />} />
          <Route path="chat" element={<Chat />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;