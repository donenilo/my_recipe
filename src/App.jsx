import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx'; 
import DetailPage from './pages/DetailPage.jsx';
import "./pages/HomePage.css";

function App() {
  return (
    <Router>
      <header className="header-center">
        <h1>SEAFOOD RECIPES</h1>
        <nav className="nav-links">
          <Link to="/">Home</Link> | <a href="#featured">Featured</a>
        </nav>
      </header>
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/meal/:id" element={<DetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;