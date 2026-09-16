"use client";
import { useState, useEffect, useCallback, ReactNode } from "react";
import Image from "next/image";

/** Read a picked file as a base64 data URI; the API uploads it to Cloudinary. */
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

/* ================= TYPES ================= */

type Category = {
  _id: string;
  name: string;
};

type SubCategory = {
  _id: string;
  name: string;
  /** Cloudinary URL returned by the API. */
  image?: string;
  /** Populated by the API as { _id, name, slug }; an unpopulated id can still come back. */
  category?: Category | string | null;
};

type FormType = {
  name: string;
  /** Parent category _id. */
  category: string;
  /** Either an existing Cloudinary URL, or a base64 data URI for a newly picked file. */
  image: string;
};

type FieldProps = {
  label: string;
  children: ReactNode;
};

type HeaderProps = {
  title: string;
  sub: string;
  onAdd: () => void;
  addDisabled?: boolean;
};

const EMPTY_FORM: FormType = { name: "", category: "", image: "" };

const categoryId = (cat: SubCategory["category"]): string =>
  typeof cat === "string" ? cat : cat?._id ?? "";

/* ================= COMPONENT ================= */

export default function SubCategories() {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormType>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const api = process.env.NEXT_PUBLIC_API_URL;

  const pickImage = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Image is larger than 5MB. Please choose a smaller one.");
      return;
    }
    const dataUri = await fileToBase64(file);
    setForm(f => ({ ...f, image: dataUri }));
  };

  const fetchSubCategories = useCallback(async () => {
    fetch(`${api}/subcategory`)
      .then(res => res.json())
      .then(data => {
        if (data.subCategories) setSubCategories(data.subCategories);
      })
      .catch(console.error);
  }, [api]);

  // The parent list feeds the form's dropdown, so a subcategory can never be
  // saved against a category that isn't really there.
  const fetchCategories = useCallback(async () => {
    fetch(`${api}/category`)
      .then(res => res.json())
      .then(data => {
        if (data.categories) setCategories(data.categories);
      })
      .catch(console.error);
  }, [api]);

  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, [fetchSubCategories, fetchCategories]);

  const categoryName = (cat: SubCategory["category"]): string => {
    if (cat && typeof cat !== "string" && cat.name) return cat.name;
    const id = categoryId(cat);
    return categories.find(c => c._id === id)?.name ?? "Uncategorised";
  };

  const openNew = () => {
    setEditId(null);
    // Pre-select when there's only one category — the common case early on.
    setForm({ ...EMPTY_FORM, category: categories.length === 1 ? categories[0]._id : "" });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setForm(EMPTY_FORM);
  };

  const handleEdit = (sub: SubCategory) => {
    setEditId(sub._id);
    setForm({
      name: sub.name,
      category: categoryId(sub.category),
      image: sub.image ?? "",
    });
    setShowModal(true);
  };

  const saveSubCategory = async () => {
    if (!form.name.trim() || saving) return;
    if (!form.category) {
      alert("Please choose a parent category.");
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("token") || "";
      let res;

      if (editId) {
        res = await fetch(`${api}/subcategory/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization": token },
          body: JSON.stringify({
            subCategory: {
              name: form.name,
              category: form.category,
              image: form.image,
              description: "Updated from Admin",
            },
          }),
        });
      } else {
        res = await fetch(`${api}/subcategory/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": token },
          body: JSON.stringify({
            name: form.name,
            category: form.category,
            image: form.image,
            description: "Added from Admin",
            isActive: true,
          }),
        });
      }

      if (!res.ok) {
        if (res.status === 401) {
          alert("Unauthorized. Please log in.");
          return;
        }
        const text = await res.text();
        alert(`Error: ${text}`);
        return;
      }

      const data = await res.json();
      if (data.success) {
        // Take the saved doc back from the API — its `image` is the Cloudinary
        // URL, not the base64 we sent, and `category` comes back populated.
        if (editId) {
          setSubCategories(prev =>
            prev.map(s =>
              s._id === editId
                ? {
                    ...s,
                    name: form.name,
                    image: data.subCategory?.image ?? s.image,
                    category: data.subCategory?.category ?? form.category,
                  }
                : s
            )
          );
        } else {
          setSubCategories(prev => [...prev, data.subCategory]);
        }
        closeModal();
      } else {
        alert(data.error || "Failed to save subcategory");
      }
    } catch (err) {
      console.error(err);
      alert("Could not save the subcategory. Check that the server is running.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`${api}/subcategory/delete/${id}`, {
        method: "DELETE",
        headers: { "Authorization": token }
      });

      if (!res.ok) {
        if (res.status === 401) return alert("Unauthorized. Please log in.");
        const text = await res.text();
        return alert(`Error: ${text}`);
      }

      const data = await res.json();
      if (data.success) {
        setSubCategories(prev => prev.filter(s => s._id !== id));
      } else {
        alert(data.error || "Failed to delete");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const visible =
    filter === "all"
      ? subCategories
      : subCategories.filter(s => categoryId(s.category) === filter);

  return (
    <div>
      <style>{`
        .card { background: #152341; border: 1px solid #2A3C5F; border-radius: 12px; transition: border-color 0.18s; }
        .card:hover { border-color: #18294A; }
        .btn-primary { background: #E8EFF8; color: #0C1626; border: none; border-radius: 8px; padding: 10px 20px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.15s; }
        .btn-primary:hover { background: #C9D9EE; }
        .btn-ghost { background: transparent; color: #7E93B4; border: 1px solid #2A3C5F; border-radius: 8px; padding: 8px 14px; font-family: 'DM Sans', sans-serif; font-size: 12px; cursor: pointer; transition: all 0.15s; }
        .btn-ghost:hover { color: #ef4444; border-color: #ef444440; }
        .input { background: #0C1626; border: 1px solid #2A3C5F; border-radius: 8px; color: #E8EFF8; font-family: 'DM Sans', sans-serif; font-size: 13px; padding: 10px 14px; width: 100%; outline: none; transition: border-color 0.15s; }
        .input:focus { border-color: #E8EFF8; }
        select.input { cursor: pointer; }
        select.input option { background: #0C1626; color: #E8EFF8; }
        .pill { font-size: 11px; font-weight: 600; color: #C9D9EE; background: #18294A; border: 1px solid #2A3C5F; border-radius: 999px; padding: 3px 10px; display: inline-block; max-width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .overlay { position: fixed; inset: 0; background: #000000aa; display: flex; align-items: center; justify-content: center; z-index: 100; padding: 16px; }

        @media (max-width: 768px) {
          .btn-primary { padding: 8px 16px; font-size: 12px; }
          .btn-ghost { padding: 6px 10px; font-size: 11px; }
          .input { font-size: 14px; padding: 8px 10px; }
        }
        @media (max-width: 640px) {
          .btn-primary { width: 100%; }
          .overlay { padding: 12px; }
        }
      `}</style>

      <PageHeader
        title="Subcategories"
        sub={`${subCategories.length} total`}
        onAdd={openNew}
        addDisabled={categories.length === 0}
      />

      {/* A subcategory has to hang off a category, so say so rather than
          opening a form with an empty dropdown. */}
      {categories.length === 0 && (
        <div className="card" style={{ marginTop: 24, padding: "clamp(14px, 3vw, 20px)", fontSize: 13, color: "#7E93B4" }}>
          Add a category first — every subcategory belongs to one.
        </div>
      )}

      {/* FILTER BY PARENT CATEGORY */}
      {categories.length > 0 && (
        <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "#7E93B4" }}>Category</span>
          <select
            className="input"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: "auto", minWidth: 180, maxWidth: "100%" }}
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* SUBCATEGORY LIST */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(clamp(200px, 90vw, 280px), 1fr))", gap: "clamp(12px, 3vw, 16px)", marginTop: 24, width: "100%" }}>
        {visible.map((sub) => (
          <div key={sub._id} className="card" style={{ padding: "clamp(12px, 3vw, 20px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
                <div style={{ position: "relative", width: 40, height: 40, borderRadius: 10, background: "#18294A", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {sub.image ? (
                    <Image src={sub.image} alt="" fill sizes="40px" unoptimized style={{ objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#7E93B4" }}>
                      {sub.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "clamp(12px, 2vw, 14px)", color: "#E8EFF8", wordBreak: "break-word" }}>{sub.name}</div>
                  <div style={{ marginTop: 5 }}>
                    <span className="pill">{categoryName(sub.category)}</span>
                  </div>
                </div>
              </div>
              <button className="btn-ghost" onClick={() => remove(sub._id)} style={{ flexShrink: 0 }}>✕</button>
            </div>

            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #2A3C5F", display: "flex", justifyContent: "flex-start" }}>
              <button className="btn-ghost" onClick={() => handleEdit(sub)}>Edit</button>
            </div>
          </div>
        ))}
      </div>

      {/* Filtered down to nothing — distinguish that from "none exist yet". */}
      {categories.length > 0 && visible.length === 0 && (
        <div style={{ marginTop: 24, fontSize: 13, color: "#5C7095" }}>
          {subCategories.length === 0
            ? "No subcategories yet."
            : "No subcategories in this category."}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="overlay" onClick={closeModal}>
          <div className="card" style={{ width: "clamp(300px, 90vw, 400px)", padding: "clamp(16px, 4vw, 28px)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(16px, 4vw, 18px)", fontWeight: 700, color: "#E8EFF8", marginBottom: 20 }}>
              {editId ? "Edit Subcategory" : "New Subcategory"}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <FieldLabel label="Parent Category">
                <select
                  className="input"
                  value={form.category}
                  onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </FieldLabel>

              <FieldLabel label="Subcategory Name">
                <input
                  className="input"
                  value={form.name}
                  placeholder="e.g. Face Wash"
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </FieldLabel>

              <FieldLabel label="Subcategory Image">
                {form.image ? (
                  <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 3", borderRadius: 10, overflow: "hidden", border: "1px solid #2A3C5F", background: "#0C1626" }}>
                    <Image
                      src={form.image}
                      alt="Subcategory preview"
                      fill
                      sizes="400px"
                      unoptimized
                      style={{ objectFit: "cover" }}
                    />
                    <button
                      type="button"
                      onClick={() => setForm(f => ({ ...f, image: "" }))}
                      title="Remove image"
                      style={{ position: "absolute", top: 8, right: 8, background: "#0C1626cc", color: "#E8EFF8", border: "1px solid #2A3C5F", borderRadius: 6, width: 28, height: 28, cursor: "pointer", lineHeight: 1 }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <label
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, width: "100%", aspectRatio: "4 / 3", border: "1px dashed #2A3C5F", borderRadius: 10, background: "#0C1626", cursor: "pointer", color: "#7E93B4", fontSize: 12, textAlign: "center", padding: 12 }}
                  >
                    <span style={{ fontSize: 22, lineHeight: 1 }}>＋</span>
                    <span>Choose an image</span>
                    <span style={{ fontSize: 10, opacity: 0.7 }}>JPG or PNG, up to 5MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => pickImage(e.target.files?.[0])}
                    />
                  </label>
                )}
              </FieldLabel>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end", flexWrap: "wrap" }}>
              <button className="btn-ghost" onClick={closeModal} style={{ flex: "1 0 auto", minWidth: "80px" }}>Cancel</button>
              <button className="btn-primary" onClick={saveSubCategory} disabled={saving} style={{ flex: "1 0 auto", minWidth: "80px", opacity: saving ? 0.6 : 1, cursor: saving ? "not-allowed" : "pointer" }}>
                {saving ? "Saving…" : editId ? "Save Changes" : "Add Subcategory"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function FieldLabel({ label, children }: FieldProps) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color: "#7E93B4", marginBottom: 6 }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function PageHeader({ title, sub, onAdd, addDisabled }: HeaderProps) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, width: "100%" }}>
      <div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(20px, 5vw, 26px)", fontWeight: 800, color: "#E8EFF8", margin: 0 }}>{title}</h1>
        <p style={{ fontSize: 13, color: "#5C7095", margin: "4px 0 0 0" }}>{sub}</p>
      </div>
      <button
        className="btn-primary"
        onClick={onAdd}
        disabled={addDisabled}
        style={{ opacity: addDisabled ? 0.5 : 1, cursor: addDisabled ? "not-allowed" : "pointer" }}
      >
        + Add New
      </button>
    </div>
  );
}
