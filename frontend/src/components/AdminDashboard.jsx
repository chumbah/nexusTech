import React, { useState } from "react";
import {
  Lock,
  X,
  LogOut,
  MessageSquare,
  Calculator,
  Landmark,
  Database,
} from "lucide-react";

export default function AdminDashboard({ isOpen, onClose }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState("");

  const [errorMsg, setErrorMsg] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  const [inquiries, setInquiries] = useState([]);
  const [estimates, setEstimates] = useState([]);

  const [activeTab, setActiveTab] = useState("inquiries");
  const [loadingData, setLoadingData] = useState(false);

  const fetchData = async (auth) => {
    setLoadingData(true);

    try {
      const headers = {
        Authorization: `Bearer ${auth}`,
      };

      const inqRes = await fetch("/api/admin/inquiries", { headers });

      const estRes = await fetch("/api/admin/estimates", { headers });

      const inqData = await inqRes.json();
      const estData = await estRes.json();

      setInquiries(inqData.inquiries || []);

      setEstimates(estData.estimates || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoggingIn(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      setToken(data.token);

      setIsLoggedIn(true);

      await fetchData(data.token);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoggingIn(false);
    }
  };

  // LOGOUT
  const logout = () => {
    setIsLoggedIn(false);

    setToken("");

    setUsername("");
    setPassword("");

    setInquiries([]);
    setEstimates([]);
  };

  // RESET DASHBOARD ONLY
  const resetDashboard = () => {
    setInquiries([]);

    setEstimates([]);

    setActiveTab("inquiries");

    setErrorMsg("");
  };

  if (!isOpen) return null;

  const totalPipeline = estimates.reduce(
    (sum, e) => sum + Number(e.totalPrice || e.total_price || 0),
    0,
  );

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(26,20,18,.55)",
        backdropFilter: "blur(16px)",
        zIndex: 5000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        className="glass-panel"
        style={{
          maxWidth: isLoggedIn ? "1100px" : "440px",
          width: "100%",
          height: isLoggedIn ? "85vh" : "auto",
          background: "#fff",
          borderRadius: "20px",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 20px 50px rgba(0,0,0,.5)",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            padding: "20px 28px",
            borderBottom: "1px solid #eee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
            }}
          >
            <Database size={22} className="text-cyan" />

            <h3>
              Nexus Portal:
              {isLoggedIn ? " Central Command" : " Admin Gate"}
            </h3>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
            }}
          >
            {isLoggedIn && (
              <button
                onClick={resetDashboard}
                style={{
                  background: "rgba(6,182,212,.1)",
                  border: "1px solid rgba(6,182,212,.2)",
                  color: "#06b6d4",
                  padding: "8px 12px",
                  borderRadius: 8,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <Database size={14} />
                Reset
              </button>
            )}

            {isLoggedIn && (
              <button
                onClick={logout}
                style={{
                  background: "rgba(255,95,86,.1)",
                  border: "1px solid rgba(255,95,86,.2)",
                  color: "#ff5f56",
                  padding: "8px 12px",
                  borderRadius: 8,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <LogOut size={14} />
                Logout
              </button>
            )}

            <button
              onClick={onClose}
              style={{
                border: "none",
                background: "transparent",
                cursor: "pointer",
              }}
            >
              <X />
            </button>
          </div>
        </div>
        {/* LOGIN */}

        {!isLoggedIn ? (
          <form
            onSubmit={handleLogin}
            style={{
              padding: 40,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <div
              style={{
                textAlign: "center",
              }}
            >
              <Lock size={40} className="text-cyan" />

              <h3>Sign in to Admin Dashboard</h3>

              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#777",
                }}
              >
                Secure database access
              </p>
            </div>

            <input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ddd",
              }}
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ddd",
              }}
            />

            {errorMsg && (
              <div
                style={{
                  color: "#ff5f56",
                  background: "rgba(255,95,86,.1)",
                  padding: 10,
                  borderRadius: 8,
                }}
              >
                {errorMsg}
              </div>
            )}

            <button className="btn btn-glow" disabled={loggingIn}>
              {loggingIn ? "Connecting..." : "Authorize Session"}
            </button>
          </form>
        ) : (
          <>
            {/* STATS */}

            <div
              className="stats-row"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 16,
                padding: "24px 28px",
                background: "rgba(0,0,0,.02)",
              }}
            >
              <div
                style={{
                  padding: 16,
                  borderRadius: 10,
                  background: "rgba(139,92,246,.08)",
                }}
              >
                <MessageSquare size={20} />

                <h2>{inquiries.length}</h2>

                <p>CONTACT TICKETS</p>
              </div>

              <div
                style={{
                  padding: 16,
                  borderRadius: 10,
                  background: "rgba(6,182,212,.08)",
                }}
              >
                <Calculator size={20} />

                <h2>{estimates.length}</h2>

                <p>QUOTE REQUESTS</p>
              </div>

              <div
                style={{
                  padding: 16,
                  borderRadius: 10,
                  background: "rgba(219,39,119,.08)",
                }}
              >
                <Landmark size={20} />

                <h2>KES {totalPipeline.toLocaleString()}</h2>

                <p>PIPELINE VALUE</p>
              </div>
            </div>

            {/* TABS */}

            <div
              style={{
                display: "flex",
                gap: 20,
                padding: "0 28px",
                borderBottom: "1px solid #eee",
              }}
            >
              <button
                onClick={() => setActiveTab("inquiries")}
                style={{
                  padding: 16,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  borderBottom:
                    activeTab === "inquiries" ? "2px solid #8b5cf6" : "none",
                }}
              >
                Messages ({inquiries.length})
              </button>

              <button
                onClick={() => setActiveTab("estimates")}
                style={{
                  padding: 16,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  borderBottom:
                    activeTab === "estimates" ? "2px solid #06b6d4" : "none",
                }}
              >
                Quotes ({estimates.length})
              </button>
            </div>

            {/* DATA */}

            <div
              style={{
                overflowY: "auto",
                padding: "24px 28px",
                flex: 1,
              }}
            >
              {loadingData ? (
                <p>Loading registry...</p>
              ) : activeTab === "inquiries" ? (
                inquiries.length === 0 ? (
                  <p>No messages found in DB.</p>
                ) : (
                  inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      style={{
                        background: "rgba(0,0,0,.02)",
                        border: "1px solid #eee",
                        borderRadius: 12,
                        padding: 20,
                        marginBottom: 16,
                      }}
                    >
                      <h3>{inq.name}</h3>

                      <p>📧 {inq.email}</p>

                      {inq.phone && <p>📞 {inq.phone}</p>}

                      {inq.company && <p>🏢 {inq.company}</p>}

                      <p
                        style={{
                          color: "#555",
                        }}
                      >
                        {inq.message}
                      </p>

                      <span
                        style={{
                          background: "rgba(139,92,246,.15)",
                          padding: "4px 8px",
                          borderRadius: 5,
                        }}
                      >
                        {inq.serviceType || inq.service_type || "General"}
                      </span>
                    </div>
                  ))
                )
              ) : estimates.length === 0 ? (
                <p>No estimates found in DB.</p>
              ) : (
                estimates.map((est) => {
                  let specs = {};

                  try {
                    specs =
                      typeof est.itemsSelected === "string"
                        ? JSON.parse(est.itemsSelected)
                        : est.itemsSelected || {};
                  } catch {
                    specs = {};
                  }

                  return (
                    <div
                      key={est.id}
                      style={{
                        background: "rgba(0,0,0,.02)",
                        border: "1px solid #eee",
                        borderRadius: 12,
                        padding: 20,
                        marginBottom: 16,
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 20,
                      }}
                    >
                      <div>
                        <h3>{est.name}</h3>

                        <p>📧 {est.email}</p>

                        <p>📞 {est.phone}</p>

                        <div
                          style={{
                            display: "flex",
                            gap: 8,
                            flexWrap: "wrap",
                          }}
                        >
                          {Object.entries(specs).map(([k, v]) => (
                            <span
                              key={k}
                              style={{
                                fontSize: 12,
                                background: "rgba(6,182,212,.1)",
                                padding: "4px 8px",
                                borderRadius: 5,
                              }}
                            >
                              {k}: {String(v)}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div
                        style={{
                          background: "rgba(6,182,212,.1)",
                          padding: 15,
                          borderRadius: 10,
                          height: "fit-content",
                        }}
                      >
                        <small>QUOTE VALUE</small>

                        <h2
                          style={{
                            color: "#06b6d4",
                          }}
                        >
                          KES{" "}
                          {Number(
                            est.totalPrice || est.total_price || 0,
                          ).toLocaleString()}
                        </h2>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
