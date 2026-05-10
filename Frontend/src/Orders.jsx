import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext.jsx";
import { API } from "./api.js";
import Navbar from "./Navbar.jsx";
import "./styles.css";

export default function Orders() {
  const { user, can } = useAuth();

  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [toast, setToast]       = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm]         = useState({ item: "", qty: "", price: "" });

  // Permissions decoded from JWT
  const canRead   = can("orders:read");
  const canWrite  = can("orders:write");
  const canDelete = can("orders:delete");

  const role = user?.roles?.[0] || "user";

  useEffect(() => {
    if (canRead) fetchOrders();
    else {
      setError("You don't have permission to view orders. Required: orders:read");
      setLoading(false);
    }
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchOrders = async () => {
    setLoading(true); setError("");
    try {
      const data = await API.getOrders();
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.item || !form.qty || !form.price) return;
    setCreating(true);
    try {
      const newOrder = await API.createOrder({
        item:  form.item,
        qty:   Number(form.qty),
        price: Number(form.price),
      });
      setOrders((prev) => [...prev, newOrder]);
      setForm({ item: "", qty: "", price: "" });
      setShowForm(false);
      showToast("Order created successfully");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(id);
    try {
      await API.deleteOrder(id);
      setOrders((prev) => prev.filter((o) => o._id !== id));
      showToast("Order deleted");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setDeleting(null);
    }
  };

  // Banner config per role
  const bannerConfig = {
    admin: {
      icon: "👑",
      color: "var(--purple)",
      bg: "rgba(129,140,248,0.06)",
      border: "rgba(129,140,248,0.2)",
      text: "Full access — you can view, create and delete orders.",
    },
    manager: {
      icon: "🧑‍💼",
      color: "var(--yellow)",
      bg: "rgba(251,191,36,0.06)",
      border: "rgba(251,191,36,0.2)",
      text: "You can view and create orders. Delete is restricted (orders:delete not assigned).",
    },
    user: {
      icon: "👤",
      color: "var(--text-muted)",
      bg: "rgba(148,163,184,0.05)",
      border: "rgba(148,163,184,0.15)",
      text: "Read-only access. You can only view orders.",
    },
  };
  const banner = bannerConfig[role] || bannerConfig.user;

  return (
    <div className="orders-page">
      <Navbar />

      {/* Toast */}
      {toast && (
        <div className={`toast ${toast.type}`}>
          {toast.type === "error" ? "⚠ " : "✓ "}{toast.msg}
        </div>
      )}

      <div className="orders-container">

        {/* ── Page Header ────────────────────────────────────────────── */}
        <div className="page-header">
          <div>
            <h1 className="page-title">Orders</h1>
            <p className="page-sub">
              Protected resource — access is controlled by your role's permissions
            </p>
          </div>

          {/* RBAC permission badges */}
          <div className="rbac-legend">
            <span className={`rbac-badge ${canRead   ? "granted" : "denied"}`}>
              {canRead   ? "✓" : "✗"} orders:read
            </span>
            <span className={`rbac-badge ${canWrite  ? "granted" : "denied"}`}>
              {canWrite  ? "✓" : "✗"} orders:write
            </span>
            <span className={`rbac-badge ${canDelete ? "granted" : "denied"}`}>
              {canDelete ? "✓" : "✗"} orders:delete
            </span>
          </div>
        </div>

        {/* ── Role Banner ─────────────────────────────────────────────── */}
        <div
          className="perm-banner"
          style={{ background: banner.bg, border: `1px solid ${banner.border}`, color: banner.color }}
        >
          <span style={{ fontSize: "18px" }}>{banner.icon}</span>
          <span>
            <strong style={{ textTransform: "capitalize" }}>{role}</strong> — {banner.text}
          </span>
        </div>

        {/* ── Toolbar ─────────────────────────────────────────────────── */}
        <div className="toolbar">
          <span className="order-count">
            {loading ? "Loading..." : `${orders.length} order${orders.length !== 1 ? "s" : ""}`}
          </span>
          <div className="toolbar-actions">
            <button className="refresh-btn" onClick={fetchOrders} disabled={loading}>
              ↻ Refresh
            </button>

            {/* Show create button only if user has orders:write */}
            {canWrite ? (
              <button className="create-btn" onClick={() => setShowForm(!showForm)}>
                {showForm ? "✕ Cancel" : "+ New Order"}
              </button>
            ) : (
              <button className="locked-btn" disabled title="Requires orders:write permission">
                🔒 New Order
              </button>
            )}
          </div>
        </div>

        {/* ── Create Order Form ────────────────────────────────────────── */}
        {showForm && canWrite && (
          <div className="form-card">
            <h3>Create New Order</h3>
            <form className="form-row" onSubmit={handleCreate}>
              <div className="form-field">
                <label className="form-label">ITEM NAME</label>
                <input
                  className="form-input"
                  placeholder="e.g. Laptop"
                  value={form.item}
                  onChange={(e) => setForm({ ...form, item: e.target.value })}
                  required
                />
              </div>
              <div className="form-field">
                <label className="form-label">QTY</label>
                <input
                  className="form-input sm"
                  type="number" min="1"
                  placeholder="1"
                  value={form.qty}
                  onChange={(e) => setForm({ ...form, qty: e.target.value })}
                  required
                />
              </div>
              <div className="form-field">
                <label className="form-label">PRICE (₹)</label>
                <input
                  className="form-input sm"
                  type="number" min="1"
                  placeholder="1000"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                />
              </div>
              <button className="form-submit" type="submit" disabled={creating}>
                {creating ? "Creating..." : "Create →"}
              </button>
            </form>
          </div>
        )}

        {/* ── Error State ──────────────────────────────────────────────── */}
        {error && (
          <div className="state-box" style={{ borderColor: "rgba(248,113,113,0.25)" }}>
            <span className="state-icon">⚠️</span>
            <p style={{ color: "var(--red)" }}>{error}</p>
            <p style={{ fontSize: "12px" }}>
              Logged in as: <strong>{role}</strong> |
              orders:read: <strong>{canRead ? "✓ granted" : "✗ denied"}</strong>
            </p>
          </div>
        )}

        {/* ── Loading State ────────────────────────────────────────────── */}
        {loading && (
          <div className="state-box">
            <div className="spinner" />
            <p>Fetching orders from resource service...</p>
          </div>
        )}

        {/* ── Empty State ──────────────────────────────────────────────── */}
        {!loading && !error && orders.length === 0 && (
          <div className="state-box">
            <span className="state-icon">📦</span>
            <p>No orders yet</p>
            {canWrite && <p style={{ fontSize: "12px" }}>Click "+ New Order" to create one</p>}
            {!canWrite && <p style={{ fontSize: "12px", color: "var(--text-faint)" }}>
              You don't have permission to create orders
            </p>}
          </div>
        )}

        {/* ── Orders Table ─────────────────────────────────────────────── */}
        {!loading && !error && orders.length > 0 && (
          <div className="table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Created By</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order,index) => (
                  <tr key={order._id}>
                    <td><span className="id-badge">#{index + 1}</span></td>
                    <td><span className="item-name">{order.item}</span></td>
                    <td>{order.qty}</td>
                    <td><span className="price-val">₹{Number(order.price).toLocaleString()}</span></td>
                    <td><span className="created-by">{order.createdBy}</span></td>
                    <td>
                      {/* Show delete only if user has orders:delete permission */}
                      {canDelete ? (
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(order._id)}
                          disabled={deleting === order._id}
                        >
                          {deleting === order._id ? "..." : "Delete"}
                        </button>
                      ) : (
                        <span className="locked-action" title="Requires orders:delete">
                          🔒 Delete
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
