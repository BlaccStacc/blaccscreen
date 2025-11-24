// src/pages/Garage.jsx
import React, { useEffect, useState } from "react";
import { apiFetch } from "../api";

export default function Garage() {
  const [spaces, setSpaces] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedSpaceId, setSelectedSpaceId] = useState(null);

  const [loadingSpaces, setLoadingSpaces] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [error, setError] = useState("");

  const [newSpace, setNewSpace] = useState({
    name: "",
    description: "",
    location: "",
  });

  const [newItem, setNewItem] = useState({
    name: "",
    quantity: 1,
    notes: "",
  });

  // ----- LOAD SPACES -----
  const fetchSpaces = async () => {
    setLoadingSpaces(true);
    setError("");
    try {
      const data = await apiFetch("/garage/spaces");
      const arr = Array.isArray(data) ? data : [];
      setSpaces(arr);

      if (arr.length > 0 && !selectedSpaceId) {
        setSelectedSpaceId(arr[0].id);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load spaces");
    } finally {
      setLoadingSpaces(false);
    }
  };

  // ----- LOAD ITEMS -----
  const fetchItems = async (spaceId) => {
    if (!spaceId) {
      setItems([]);
      return;
    }
    setLoadingItems(true);
    setError("");
    try {
      const data = await apiFetch(`/garage/items?space_id=${spaceId}`);
      const arr = Array.isArray(data) ? data : [];
      setItems(arr);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to load items");
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedSpaceId) {
      fetchItems(selectedSpaceId);
    }
  }, [selectedSpaceId]);

  // ----- CREATE SPACE -----
  const handleCreateSpace = async (e) => {
    e.preventDefault();
    setError("");

    if (!newSpace.name.trim()) {
      setError("Space name is required");
      return;
    }

    try {
      await apiFetch("/garage/spaces", {
        method: "POST",
        body: JSON.stringify({
          name: newSpace.name,
          description: newSpace.description || null,
          location: newSpace.location || null,
        }),
      });

      setNewSpace({ name: "", description: "", location: "" });
      await fetchSpaces();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create space");
    }
  };

  // ----- CREATE ITEM -----
  const handleCreateItem = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedSpaceId) {
      setError("Select a space first");
      return;
    }
    if (!newItem.name.trim()) {
      setError("Item name is required");
      return;
    }

    const qty = Number(newItem.quantity) || 1;

    try {
      await apiFetch("/garage/items", {
        method: "POST",
        body: JSON.stringify({
          space_id: selectedSpaceId,
          name: newItem.name,
          quantity: qty,
          notes: newItem.notes || null,
        }),
      });

      setNewItem({ name: "", quantity: 1, notes: "" });
      await fetchItems(selectedSpaceId);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to create item");
    }
  };

  // ----- DELETE ITEM -----
  const handleDeleteItem = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      await apiFetch(`/garage/items/${id}`, {
        method: "DELETE",
      });

      await fetchItems(selectedSpaceId);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to delete item");
    }
  };

  // safety: chiar dacă spaces / items ar deveni null
  const safeSpaces = Array.isArray(spaces) ? spaces : [];
  const safeItems = Array.isArray(items) ? items : [];
  const selectedSpace = safeSpaces.find((s) => s.id === selectedSpaceId);

  return (
    <div>
      <h1>Garage storage</h1>

      {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 2fr",
          gap: "2rem",
          alignItems: "flex-start",
        }}
      >
        {/* LEFT: spaces */}
        <div>
          <h2>Spaces</h2>

          {loadingSpaces ? (
            <p>Loading spaces...</p>
          ) : safeSpaces.length === 0 ? (
            <p>No spaces yet. Add one below.</p>
          ) : (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                marginBottom: "1rem",
              }}
            >
              {safeSpaces.map((s) => (
                <li
                  key={s.id}
                  style={{
                    padding: "0.5rem 0.75rem",
                    marginBottom: "0.25rem",
                    borderRadius: "4px",
                    border:
                      s.id === selectedSpaceId
                        ? "2px solid #007bff"
                        : "1px solid #ccc",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedSpaceId(s.id)}
                >
                  <strong>{s.name}</strong>
                  {s.location && (
                    <span style={{ marginLeft: "0.5rem", color: "#666" }}>
                      ({s.location})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}

          <h3>Add new space</h3>
          <form onSubmit={handleCreateSpace}>
            <div style={{ marginBottom: "0.5rem" }}>
              <label>
                Name
                <br />
                <input
                  type="text"
                  value={newSpace.name}
                  onChange={(e) =>
                    setNewSpace((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  style={{ width: "100%" }}
                  required
                />
              </label>
            </div>

            <div style={{ marginBottom: "0.5rem" }}>
              <label>
                Location (optional)
                <br />
                <input
                  type="text"
                  value={newSpace.location}
                  onChange={(e) =>
                    setNewSpace((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  style={{ width: "100%" }}
                />
              </label>
            </div>

            <div style={{ marginBottom: "0.5rem" }}>
              <label>
                Description (optional)
                <br />
                <textarea
                  value={newSpace.description}
                  onChange={(e) =>
                    setNewSpace((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  style={{ width: "100%", minHeight: "60px" }}
                />
              </label>
            </div>

            <button type="submit">Create space</button>
          </form>
        </div>

        {/* RIGHT: items */}
        <div>
          <h2>
            Items{" "}
            {selectedSpace && selectedSpace.name
              ? `in "${selectedSpace.name}"`
              : ""}
          </h2>

          {!selectedSpaceId ? (
            <p>Select a space to view its items.</p>
          ) : loadingItems ? (
            <p>Loading items...</p>
          ) : safeItems.length === 0 ? (
            <p>No items in this space yet.</p>
          ) : (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "1rem",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      borderBottom: "1px solid #ccc",
                      textAlign: "left",
                      padding: "0.25rem",
                    }}
                  >
                    Name
                  </th>
                  <th
                    style={{
                      borderBottom: "1px solid #ccc",
                      textAlign: "left",
                      padding: "0.25rem",
                    }}
                  >
                    Qty
                  </th>
                  <th
                    style={{
                      borderBottom: "1px solid #ccc",
                      textAlign: "left",
                      padding: "0.25rem",
                    }}
                  >
                    Notes
                  </th>
                  <th
                    style={{
                      borderBottom: "1px solid #ccc",
                      textAlign: "left",
                      padding: "0.25rem",
                    }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {safeItems.map((it) => (
                  <tr key={it.id}>
                    <td
                      style={{
                        borderBottom: "1px solid #eee",
                        padding: "0.25rem",
                      }}
                    >
                      {it.name}
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid #eee",
                        padding: "0.25rem",
                      }}
                    >
                      {it.quantity}
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid #eee",
                        padding: "0.25rem",
                      }}
                    >
                      {it.notes}
                    </td>
                    <td
                      style={{
                        borderBottom: "1px solid #eee",
                        padding: "0.25rem",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(it.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedSpaceId && (
            <>
              <h3>Add new item</h3>
              <form onSubmit={handleCreateItem}>
                <div style={{ marginBottom: "0.5rem" }}>
                  <label>
                    Name
                    <br />
                    <input
                      type="text"
                      value={newItem.name}
                      onChange={(e) =>
                        setNewItem((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      style={{ width: "100%" }}
                      required
                    />
                  </label>
                </div>

                <div style={{ marginBottom: "0.5rem" }}>
                  <label>
                    Quantity
                    <br />
                    <input
                      type="number"
                      min="1"
                      value={newItem.quantity}
                      onChange={(e) =>
                        setNewItem((prev) => ({
                          ...prev,
                          quantity: e.target.value,
                        }))
                      }
                      style={{ width: "100%" }}
                    />
                  </label>
                </div>

                <div style={{ marginBottom: "0.5rem" }}>
                  <label>
                    Notes (optional)
                    <br />
                    <textarea
                      value={newItem.notes}
                      onChange={(e) =>
                        setNewItem((prev) => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      style={{ width: "100%", minHeight: "60px" }}
                    />
                  </label>
                </div>

                <button type="submit">Add item</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
