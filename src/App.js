import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import useAutCheck from './hooks/useAuthCheck';
import Login from './pages/Login';
import Projects from './pages/Projects';
import Teams from './pages/Teams';

function App() {
  const authCheck = useAutCheck();

  return !authCheck ? (
    <div>Checking Authentication...</div>
  ) : (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      {/* <Route
        path="/inbox"
        element={
          <PrivateRoute>
            <Conversation />
          </PrivateRoute>
        }
      />
      <Route
        path="/inbox/:id"
        element={
          <PrivateRoute>
            <Inbox />
          </PrivateRoute>
        }
      /> */}
      <Route
        path="/teams"
        element={
          <PrivateRoute>
            <Teams />
          </PrivateRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <PrivateRoute>
            <Projects />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default App;
