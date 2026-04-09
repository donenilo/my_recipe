import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx'; 
import DetailPage from './pages/DetailPage.jsx';
import "./pages/HomePage.css";

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <header className="navbar">
          <div className="navbar-container">
            <Link to="/" className="logo">
              <span className="logo-icon">🍳</span>
              <span className="logo-text">RecipeHub</span>
              
            </Link>
            
            <nav className="nav-menu">
              {/* <Link to="/" className="nav-link active">Home</Link>
              <a href="#recipes" className="nav-link">Recipes</a>               */}
            </nav>

          </div>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/meal/:id" element={<div className="detail-page">Detail Page</div>} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="footer-content">
            <p>&copy; 2024 RecipeHub. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;