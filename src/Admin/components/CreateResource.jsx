import { useState } from "react";
import { apiFetch } from "./adminApi";
import "./adminTabs.css";

const DEFAULT_FORM = {
  resource_name: "",
  resource_type: "",
  description: "",
  location: "",
  capacity: "",
  availability_status: true,
  approval_required: true,
  image_url: "",
};

export default function CreateResource({ onNotify }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.resource_name.trim() || !form.resource_type.trim()) {
      setError("Resource name and type are required.");
      return;
    }

    const payload = {
      resource_name: form.resource_name.trim(),
      resource_type: form.resource_type.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      capacity: form.capacity === "" ? null : Number(form.capacity),
      availability_status: Boolean(form.availability_status),
      approval_required: Boolean(form.approval_required),
      image_url: form.image_url.trim(),
    };

    setSubmitting(true);
    try {
      const created = await apiFetch("/resources", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      setSuccess("Resource created successfully.");
      setForm(DEFAULT_FORM);
      onNotify?.({
        title: "Resource Created",
        message: `${payload.resource_name} has been added to the system.`,
        tone: "success",
      });
      return created;
    } catch (e2) {
      setError(e2?.message || "Failed to create resource.");
      return null;
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="at-root">
      <div className="at-card">
        <div className="at-card__head">
          <h2>Create Resource</h2>
        </div>

        {error && <div className="at-banner at-banner--error">{error}</div>}
        {success && <div className="at-banner at-banner--success">{success}</div>}

        <form className="at-form" onSubmit={submit}>
          <div className="at-grid">
            <div className="at-field">
              <label>Resource Name</label>
              <input
                value={form.resource_name}
                onChange={(e) => onChange("resource_name", e.target.value)}
                placeholder="Computer Lab 3"
              />
            </div>

            <div className="at-field">
              <label>Type</label>
              <input
                value={form.resource_type}
                onChange={(e) => onChange("resource_type", e.target.value)}
                placeholder="Lab"
              />
            </div>

            <div className="at-field at-field--full">
              <label>Description</label>
              <textarea
                rows={3}
                value={form.description}
                onChange={(e) => onChange("description", e.target.value)}
                placeholder="Lab for programming classes"
              />
            </div>

            <div className="at-field">
              <label>Location</label>
              <input
                value={form.location}
                onChange={(e) => onChange("location", e.target.value)}
                placeholder="Engineering Block"
              />
            </div>

            <div className="at-field">
              <label>Capacity</label>
              <input
                type="number"
                min="0"
                value={form.capacity}
                onChange={(e) => onChange("capacity", e.target.value)}
                placeholder="40"
              />
            </div>

            <div className="at-field at-field--full">
              <label>Image URL</label>
              <input
                value={form.image_url}
                onChange={(e) => onChange("image_url", e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="at-toggles at-field--full">
              <label className="at-toggle">
                <input
                  type="checkbox"
                  checked={form.availability_status}
                  onChange={(e) => onChange("availability_status", e.target.checked)}
                />
                <span>Availability status</span>
              </label>

              <label className="at-toggle">
                <input
                  type="checkbox"
                  checked={form.approval_required}
                  onChange={(e) => onChange("approval_required", e.target.checked)}
                />
                <span>Approval required</span>
              </label>
            </div>
          </div>

          <div className="at-footer">
            <button className="at-btn at-btn--primary" type="submit" disabled={submitting}>
              {submitting ? "Creating…" : "Create Resource"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

