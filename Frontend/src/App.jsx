import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NagrikAIChatbot from "./components/NagrikAIChatbot";
import Home from "./pages/Home";
import CitizenLogin from "./pages/CitizenLogin";
import GovernmentLogin from "./pages/GovernmentLogin";
import CitizenDashboard from "./pages/CitizenDashboard";
import GovernmentDashboard from "./pages/GovernmentDashboard";
import { getToken } from "./services/api";
import { getMe, logout as clearAuth } from "./services/authService";

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [currentUser, setCurrentUser] = useState(null);

  // Auth bypassed for open demo access — no session blocking
  useEffect(() => {
    const token = getToken();
    if (token) {
      getMe()
        .then((user) => {
          setCurrentUser(user);
        })
        .catch(() => {
          clearAuth();
        });
    }
  }, []);

  const navigateTo = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    if (user.role === "admin") {
      navigateTo("gov-dashboard");
    } else {
      navigateTo("citizen-dashboard");
    }
  };

  const handleLogout = () => {
    clearAuth();
    setCurrentUser(null);
    navigateTo("home");
  };

  // Fallback demo users for instant access without login
  const effectiveUser =
    currentUser ||
    (currentPage === "gov-dashboard"
      ? {
        id: "GOV-IAS-001",
        name: "Dr. Rajesh Mehta, IAS",
        role: "admin",
        designation: "District Magistrate & Municipal Commissioner",
        department: "GNIDA - Central Command & Administration",
        zone: "Greater Noida Metropolis HQ",
        avatar: ""
      }
      : {
        id: "CIT-UP-8821",
        name: "Ananya Sharma",
        role: "citizen",
        email: "ananya.sharma@example.com",
        phone: "+91 98765 43210",
        ward: "Ward 12, Knowledge Park, Greater Noida",
        avatar: ""
      });

  return (
    <div className="app-root gov-theme-app">
      {/* Top Main Government Navbar */}
      <Navbar
        currentPage={currentPage}
        navigateTo={navigateTo}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Page Routing */}
      <main className="main-content">
        {currentPage === "home" && <Home navigateTo={navigateTo} />}

        {currentPage === "citizen-login" && (
          <CitizenLogin onLogin={handleLogin} navigateTo={navigateTo} />
        )}

        {currentPage === "gov-login" && (
          <GovernmentLogin onLogin={handleLogin} navigateTo={navigateTo} />
        )}

        {currentPage === "citizen-dashboard" && (
          <CitizenDashboard
            currentUser={effectiveUser}
            navigateTo={navigateTo}
          />
        )}

        {currentPage === "gov-dashboard" && (
          <GovernmentDashboard
            currentUser={effectiveUser}
            navigateTo={navigateTo}
          />
        )}
      </main>

      {/* Official Government Footer on Public Pages */}
      {(currentPage === "home" ||
        currentPage === "citizen-login" ||
        currentPage === "gov-login") && (
          <Footer navigateTo={navigateTo} />
        )}

      {/* Nagrik AI - 24x7 Virtual Civic Assistant Widget */}
      <NagrikAIChatbot navigateTo={navigateTo} />
    </div>
  );
}

export default App;
