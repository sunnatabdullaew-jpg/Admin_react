import { useEffect, useState } from "react";
import {
  Navigate,
  NavLink,
  Outlet,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardProfile from "../router/profil";
import DashboardSetting from "../router/setting";
import DashboardStats from "../router/stats";
import "../App.css";

const LOGIN_API = "https://dummyjson.com/auth/login";
const TOKEN_KEY = "auth_token";

const PATHS = {
  login: "/login",
  home: "/",
  about: "/about",
  dashboard: "/dashboard",
};

const getToken = () =>
  typeof window === "undefined" ? "" : localStorage.getItem(TOKEN_KEY) || "";

const isAuthenticated = () => Boolean(getToken());
const navLinkClass = ({ isActive }) => (isActive ? "active" : "");
const tabLinkClass = ({ isActive }) => (isActive ? "active-tab" : "tab");

function RequireAuth() {
  return isAuthenticated() ? <Outlet /> : <Navigate to={PATHS.login} replace />;
}

function GuestOnly() {
  return isAuthenticated() ? <Navigate to={PATHS.dashboard} replace /> : <Outlet />;
}

function MainLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY);
    navigate(PATHS.login, { replace: true });
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <nav className="main-nav">
          <NavLink to={PATHS.home} end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to={PATHS.about} className={navLinkClass}>
            About
          </NavLink>
          <NavLink to={PATHS.dashboard} className={navLinkClass}>
            Dashboard
          </NavLink>
        </nav>
        <div className="topbar-right">
          <span className="username">Authenticated</span>
          <button className="logout-btn" onClick={handleLogout} type="button">
            Logout
          </button>
        </div>
      </header>

      <main className="page">
        <Outlet />
      </main>
    </div>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "miar",
    password: "miarpass",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const applyDemoCredentials = () => {
    setCredentials({
      username: "miar",
      password: "miarpass",
    });
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const username = credentials.username.trim();
    const password = credentials.password.trim();

    if (!username || !password) {
      setError("Username va password kiriting.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(LOGIN_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          expiresInMins: 30,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.message || "Login xatoligi.");
      }

      const token = data.accessToken || data.token;
      if (!token) {
        throw new Error("Token topilmadi.");
      }

      localStorage.setItem(TOKEN_KEY, token);
      toast.success("Successfully logged in");
      navigate(PATHS.dashboard, { replace: true });
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Server bilan ulanishda xatolik.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-wrap">
        <section className="login-side">
          <p className="login-kicker">Admin Control</p>
          <h2>Panelga xavfsiz kirish</h2>
          <p>
            Loyihangiz statistikasi, profilingiz va sozlamalaringiz bitta
            zamonaviy panel ichida boshqariladi.
          </p>
          <div className="login-points">
            <span>Real-time dashboard</span>
            <span>Protected routes</span>
            <span>Token auth</span>
          </div>
        </section>

        <form className="login-card" onSubmit={handleSubmit}>
          <h1>Welcome Back</h1>
          <p className="login-hint">Tizimga kirish uchun hisobingizni tasdiqlang.</p>
          <label className="field-label" htmlFor="username">
            Username
          </label>
          <input
            id="username"
            className="input"
            type="text"
            name="username"
            placeholder="username"
            value={credentials.username}
            onChange={handleChange}
            autoComplete="username"
          />
          <label className="field-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className="input"
            type="password"
            name="password"
            placeholder="password"
            value={credentials.password}
            onChange={handleChange}
            autoComplete="current-password"
          />
          <div className="login-actions">
            <button className="submit-btn" type="submit" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
            <button
              className="ghost-btn"
              type="button"
              onClick={applyDemoCredentials}
            >
              Demo account
            </button>
          </div>
          <p className="login-note">Test login: miar / miarpass</p>
          {error ? <p className="message message-error">{error}</p> : null}
        </form>
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <section className="card">
      <h2>Home</h2>
      <p>Bu protected Home sahifa.</p>
    </section>
  );
}

function AboutPage() {
  return (
    <section className="card">
      <h2>About</h2>
      <p>Bu protected About sahifa.</p>
    </section>
  );
}

function DashboardLayout() {
  return (
    <section className="card">
      <h2>Dashboard</h2>
      <div className="dashboard-nav">
        <NavLink to={PATHS.dashboard} end className={tabLinkClass}>
          Overview
        </NavLink>
        <NavLink to="/dashboard/profile" className={tabLinkClass}>
          Profile
        </NavLink>
        <NavLink to="/dashboard/settings" className={tabLinkClass}>
          Settings
        </NavLink>
        <NavLink to="/dashboard/stats" className={tabLinkClass}>
          Stats
        </NavLink>
      </div>
      <div className="dashboard-content">
        <Outlet />
      </div>
    </section>
  );
}

function DashboardOverview() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch("https://fakestoreapi.com/products");
        if (!response.ok) {
          throw new Error("Failed to fetch products.");
        }

        const data = await response.json();
        if (isMounted) {
          setProducts(Array.isArray(data) ? data : []);
        }
      } catch (requestError) {
        if (isMounted) {
          const message =
            requestError instanceof Error
              ? requestError.message
              : "Something went wrong while loading products.";
          setError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p className="message message-error">{error}</p>;
  }

  return (
    <div>
      <p>Latest products from Fake Store API.</p>
      <div className="overview-grid">
        {products.slice(0, 8).map((product) => (
          <article key={product.id} className="overview-item">
            <h4>{product.title}</h4>
            <p>${Number(product.price).toFixed(2)}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function FallbackRedirect() {
  return <Navigate to={isAuthenticated() ? PATHS.home : PATHS.login} replace />;
}

function Routs() {
  return (
    <>
      <Routes>
        <Route element={<GuestOnly />}>
          <Route path={PATHS.login} element={<LoginPage />} />
        </Route>

        <Route element={<RequireAuth />}>
          <Route element={<MainLayout />}>
            <Route path={PATHS.home} element={<HomePage />} />
            <Route path={PATHS.about} element={<AboutPage />} />
            <Route path={PATHS.dashboard} element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="profile" element={<DashboardProfile />} />
              <Route path="settings" element={<DashboardSetting />} />
              <Route path="stats" element={<DashboardStats />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<FallbackRedirect />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default Routs;
