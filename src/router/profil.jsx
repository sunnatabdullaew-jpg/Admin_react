import { useEffect, useState } from "react";

const LOGIN_API = "https://dummyjson.com/auth/login";

const demoAccounts = [
  { username: "emilys", password: "emilyspass" },
  { username: "kminchelle", password: "0lelplR" },
];

const DashboardProfile = () => {
  const [profile, setProfile] = useState(null);
  const [activeUser, setActiveUser] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      setIsLoading(true);
      setError("");

      try {
        let successData = null;
        let usedUsername = "";

        for (const account of demoAccounts) {
          const response = await fetch(LOGIN_API, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: account.username,
              password: account.password,
              expiresInMins: 30,
            }),
          });

          const data = await response.json().catch(() => ({}));
          if (response.ok) {
            successData = data;
            usedUsername = account.username;
            break;
          }
        }

        if (!successData) {
          throw new Error("Profile API login failed.");
        }

        if (isMounted) {
          setProfile(successData);
          setActiveUser(usedUsername);
        }
      } catch (requestError) {
        if (isMounted) {
          const message =
            requestError instanceof Error
              ? requestError.message
              : "Failed to load profile.";
          setError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p className="message message-error">{error}</p>;
  }

  if (!profile) {
    return <p className="message message-error">No profile found.</p>;
  }

  return (
    <section className="profile-box">
      <div className="profile-head">
        <img
          className="profile-avatar"
          src={profile.image}
          alt={profile.firstName || "Profile"}
        />
        <div>
          <h3>
            {profile.firstName} {profile.lastName}
          </h3>
          <p>@{profile.username || activeUser}</p>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-item">
          <span>Email</span>
          <strong>{profile.email || "-"}</strong>
        </div>
        <div className="profile-item">
          <span>Gender</span>
          <strong>{profile.gender || "-"}</strong>
        </div>
      </div>
    </section>
  );
};

export default DashboardProfile;
