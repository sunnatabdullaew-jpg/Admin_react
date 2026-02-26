import { useEffect, useState } from "react";

const USER_API = "https://dummyjson.com/users/1";

const DashboardSetting = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    gender: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(USER_API);
        if (!response.ok) {
          throw new Error("Failed to load settings.");
        }

        const data = await response.json();
        if (isMounted) {
          setForm({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            username: data.username || "",
            gender: data.gender || "",
          });
        }
      } catch (requestError) {
        if (isMounted) {
          const message =
            requestError instanceof Error
              ? requestError.message
              : "Failed to load settings.";
          setError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchUser();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  if (isLoading) {
    return <p>Loading settings...</p>;
  }

  return (
    <section className="settings-box">
      <h3>Account Settings</h3>
      <p>Update your account details and save changes.</p>

      <form className="settings-form" onSubmit={handleSubmit}>
        <div className="settings-grid">
          <div>
            <label className="field-label" htmlFor="firstName">
              First Name
            </label>
            <input
              id="firstName"
              className="input"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="field-label" htmlFor="lastName">
              Last Name
            </label>
            <input
              id="lastName"
              className="input"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="field-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="input"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="field-label" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              className="input"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="gender">
            Gender
          </label>
          <input
            id="gender"
            className="input"
            name="gender"
            value={form.gender}
            onChange={handleChange}
          />
        </div>

        <button className="submit-btn settings-save-btn" type="submit">
          Save Settings
        </button>
      </form>

      {error ? <p className="message message-error">{error}</p> : null}
    </section>
  );
};

export default DashboardSetting;
