import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Header from './components/Header';
import ThemeContext from './context/ThemeContext';
import AddNewPage from './pages/AddNewPage';
import ArchivePage from './pages/ArchivePage';
import DetailPage from './pages/DetailPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NoMatchPage from './pages/NoMatchPage';
import RegisterPage from './pages/RegisterPage';
import { getUserLogged, putAccessToken } from './utils/network-data';

function App() {
  const [authedUser, setAuthedUser] = React.useState(null);
  const [initializing, setInitializing] = React.useState(true);
  const [theme, setTheme] = React.useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      const newTheme = prevTheme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  const themeContextValue = React.useMemo(() => {
    return {
      theme,
      toggleTheme,
    };
  }, [theme]);

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const onLoginSuccess = async ({ accessToken }) => {
    putAccessToken(accessToken);

    const { data } = await getUserLogged();
    setAuthedUser(data);
  };

  const onLogout = () => {
    setAuthedUser(null);
    putAccessToken('');
  };

  React.useEffect(() => {
    const fetchUserLogged = async () => {
      const { data } = await getUserLogged();
      setAuthedUser(data);
      setInitializing(false);
    };

    fetchUserLogged();
  }, []);

  return initializing ? null : (
    <ThemeContext.Provider value={themeContextValue}>
      <div className='app-container'>
        <Header logout={onLogout} isAuthed={authedUser !== null} />
        <main>
          {authedUser ? (
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/notes/:id' element={<DetailPage />} />
              <Route path='/notes/new' element={<AddNewPage />} />
              <Route path='/archives' element={<ArchivePage />} />
              <Route path='*' element={<NoMatchPage />} />
            </Routes>
          ) : (
            <Routes>
              <Route path='/*' element={<LoginPage loginSuccess={onLoginSuccess} />} />
              <Route path='/register' element={<RegisterPage />} />
            </Routes>
          )}
        </main>
      </div>
    </ThemeContext.Provider>
  );
}

export default App;
