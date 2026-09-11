// "use client";
// import { useState } from "react";

// const INITIAL = [
//   { id: 1, name: "Electronics", slug: "electronics", count: 142, color: "#6366f1" },
//   { id: 2, name: "Clothing", slug: "clothing", count: 89, color: "#ec4899" },
//   { id: 3, name: "Home & Garden", slug: "home-garden", count: 57, color: "#10b981" },
//   { id: 4, name: "Sports", slug: "sports", count: 33, color: "#f59e0b" },
//   { id: 5, name: "Books", slug: "books", count: 210, color: "#3b82f6" },
// ];

// export default function Categories() {
//   const [categories, setCategories] = useState(INITIAL);
//   const [showModal, setShowModal] = useState(false);
//   const [form, setForm] = useState({ name: "", slug: "", color: "#7E93B4" });

//   const addCategory = () => {
//     if (!form.name.trim()) return;
//     setCategories([...categories, { id: Date.now(), ...form, count: 0 }]);
//     setForm({ name: "", slug: "", color: "#7E93B4" });
//     setShowModal(false);
//   };

//   const remove = (id) => setCategories(categories.filter((c) => c.id !== id));

//   return (
//     <div>
//       <style>{`
//         .card { background: #152341; border: 1px solid #2A3C5F; border-radius: 12px; transition: border-color 0.18s; }
//         .card:hover { border-color: #18294A; }
//         .btn-primary { background: #2F4E86; color: #fff; border: none; border-radius: 8px; padding: 10px 20px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: background 0.15s; }
//         .btn-primary:hover { background: #24406F; }
//         .btn-ghost { background: transparent; color: #7E93B4; border: 1px solid #2A3C5F; border-radius: 8px; padding: 8px 14px; font-family: 'DM Sans', sans-serif; font-size: 12px; cursor: pointer; transition: all 0.15s; }
//         .btn-ghost:hover { color: #ef4444; border-color: #ef444440; }
//         .input { background: #0C1626; border: 1px solid #2A3C5F; border-radius: 8px; color: #E8EFF8; font-family: 'DM Sans', sans-serif; font-size: 13px; padding: 10px 14px; width: 100%; outline: none; transition: border-color 0.15s; }
//         .input:focus { border-color: #2F4E86; }
//         .overlay { position: fixed; inset: 0; background: #000000aa; display: flex; align-items: center; justify-content: center; z-index: 100; }
//       `}</style>

//       <PageHeader title="Categories" sub={`${categories.length} total`} onAdd={() => setShowModal(true)} />

//       <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginTop: 24 }}>
//         {categories.map((cat) => (
//           <div key={cat.id} className="card" style={{ padding: 20 }}>
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//               <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                 <div style={{ width: 40, height: 40, borderRadius: 10, background: cat.color + "22", display: "flex", alignItems: "center", justifyContent: "center" }}>
//                   <div style={{ width: 14, height: 14, borderRadius: 3, background: cat.color }} />
//                 </div>
//                 <div>
//                   <div style={{ fontWeight: 600, fontSize: 14, color: "#E8EFF8" }}>{cat.name}</div>
//                   <div style={{ fontSize: 11, color: "#5C7095", marginTop: 2 }}>/{cat.slug}</div>
//                 </div>
//               </div>
//               <button className="btn-ghost" onClick={() => remove(cat.id)}>✕</button>
//             </div>
//             <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #2A3C5F", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//               <span style={{ fontSize: 12, color: "#7E93B4" }}>Products</span>
//               <span style={{ fontSize: 20, fontWeight: 700, color: cat.color, fontFamily: "'Syne', sans-serif" }}>{cat.count}</span>
//             </div>
//           </div>
//         ))}
//       </div>

//       {showModal && (
//         <div className="overlay" onClick={() => setShowModal(false)}>
//           <div className="card" style={{ width: 400, padding: 28 }} onClick={(e) => e.stopPropagation()}>
//             <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: "#E8EFF8", marginBottom: 20 }}>New Category</div>
//             <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
//               <FieldLabel label="Name">
//                 <input className="input" value={form.name} placeholder="e.g. Accessories"
//                   onChange={(e) => setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} />
//               </FieldLabel>
//               <FieldLabel label="Slug">
//                 <input className="input" value={form.slug} placeholder="auto-generated"
//                   onChange={(e) => setForm({ ...form, slug: e.target.value })} />
//               </FieldLabel>
//               <FieldLabel label="Color">
//                 <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//                   <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}
//                     style={{ width: 40, height: 36, border: "none", borderRadius: 6, cursor: "pointer", background: "transparent" }} />
//                   <span style={{ fontSize: 12, color: "#7E93B4" }}>{form.color}</span>
//                 </div>
//               </FieldLabel>
//             </div>
//             <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
//               <button className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
//               <button className="btn-primary" onClick={addCategory}>Add Category</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// function FieldLabel({ label, children }) {
//   return (
//     <div>
//       <div style={{ fontSize: 11, fontWeight: 600, color: "#7E93B4", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
//       {children}
//     </div>
//   );
// }

// function PageHeader({ title, sub, onAdd }) {
//   return (
//     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//       <div>
//         <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, fontWeight: 800, color: "#E8EFF8", letterSpacing: "-0.02em" }}>{title}</h1>
//         <p style={{ fontSize: 13, color: "#5C7095", marginTop: 2 }}>{sub}</p>
//       </div>
//       <button className="btn-primary" onClick={onAdd}>+ Add New</button>
//     </div>
//   );
// }
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
  /** Cloudinary URL returned by the API. */
  image?: string;
  color?: string;
  count?: number;
};

type FormType = {
  name: string;
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
};

/* ================= COMPONENT ================= */

/* ================= COMPONENT ================= */

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormType>({ name: "", image: "" });
  const [saving, setSaving] = useState(false);
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

  const fetchCategories = useCallback(async () => {
    fetch(`${api}/category`)
      .then(res => res.json())
      .then(data => {
        if (data.categories) setCategories(data.categories);
      })
      .catch(console.error);
  }, [api]);
  
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);
  const handleEdit = (cat: Category) => {
    setEditId(cat._id);
    setForm({ name: cat.name, image: cat.image ?? "" });
    setShowModal(true);
  };

  const addCategory = async () => {
    if (!form.name.trim() || saving) return;

    setSaving(true);
    try {
      const token = localStorage.getItem("token") || "";
      let res;

      if (editId) {
        res = await fetch(`${api}/category/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json", "Authorization": token },
          body: JSON.stringify({ category: { name: form.name, image: form.image, description: "Updated from Admin" } }),
        });
      } else {
        res = await fetch(`${api}/category/add`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": token },
          body: JSON.stringify({ name: form.name, image: form.image, description: "Added from Admin", isActive: true }),
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
        // URL, not the base64 we sent, so the list shows the hosted picture.
        if (editId) {
          setCategories(prev =>
            prev.map(c =>
              c._id === editId
                ? { ...c, name: form.name, image: data.category?.image ?? c.image }
                : c
            )
          );
        } else {
          setCategories(prev => [...prev, data.category]);
        }
        setForm({ name: "", image: "" });
        setEditId(null);
        setShowModal(false);
      } else {
        alert(data.error || "Failed to save category");
      }
    } catch (err) {
      console.error(err);
      alert("Could not save the category. Check that the server is running.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`${api}/category/delete/${id}`, {
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
        setCategories(prev => prev.filter(c => c._id !== id));
      } else {
        alert(data.error || "Failed to delete");
      }
    } catch (err) {
      console.error(err);
    }
  };

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

      <PageHeader title="Categories" sub={`${categories.length} total`} onAdd={() => setShowModal(true)} />

      {/* CATEGORY LIST */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(clamp(200px, 90vw, 280px), 1fr))", gap: "clamp(12px, 3vw, 16px)", marginTop: 24, width: "100%" }}>
        {categories.map((cat) => (
          <div key={cat._id!} className="card" style={{ padding: "clamp(12px, 3vw, 20px)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0, flex: 1 }}>
                <div style={{ position: "relative", width: 40, height: 40, borderRadius: 10, background: "#18294A", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {cat.image ? (
                    <Image src={cat.image} alt="" fill sizes="40px" unoptimized style={{ objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#7E93B4" }}>
                      {cat.name?.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: "clamp(12px, 2vw, 14px)", color: "#E8EFF8", wordBreak: "break-word" }}>{cat.name}</div>
                </div>
              </div>
              <button className="btn-ghost" onClick={() => remove(cat._id!)} style={{ flexShrink: 0 }}>✕</button>
            </div>

            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #2A3C5F", display: "flex", justifyContent: "flex-start" }}>
              <button className="btn-ghost" onClick={() => handleEdit(cat)}>Edit</button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="overlay" onClick={() => setShowModal(false)}>
          <div className="card" style={{ width: "clamp(300px, 90vw, 400px)", padding: "clamp(16px, 4vw, 28px)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(16px, 4vw, 18px)", fontWeight: 700, color: "#E8EFF8", marginBottom: 20 }}>
              {editId ? "Edit Category" : "New Category"}
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <FieldLabel label="Category Name">
                <input
                  className="input"
                  value={form.name}
                  placeholder="e.g. Accessories"
                  onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                />
              </FieldLabel>

              <FieldLabel label="Category Image">
                {form.image ? (
                  <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 3", borderRadius: 10, overflow: "hidden", border: "1px solid #2A3C5F", background: "#0C1626" }}>
                    <Image
                      src={form.image}
                      alt="Category preview"
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
              <button className="btn-ghost" onClick={() => { setShowModal(false); setEditId(null); setForm({ name: "", image: "" }); }} style={{ flex: "1 0 auto", minWidth: "80px" }}>Cancel</button>
              <button className="btn-primary" onClick={addCategory} disabled={saving} style={{ flex: "1 0 auto", minWidth: "80px", opacity: saving ? 0.6 : 1, cursor: saving ? "not-allowed" : "pointer" }}>
                {saving ? "Saving…" : editId ? "Save Changes" : "Add Category"}
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

function PageHeader({ title, sub, onAdd }: HeaderProps) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, width: "100%" }}>
      <div>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(20px, 5vw, 26px)", fontWeight: 800, color: "#E8EFF8", margin: 0 }}>{title}</h1>
        <p style={{ fontSize: 13, color: "#5C7095", margin: "4px 0 0 0" }}>{sub}</p>
      </div>
      <button className="btn-primary" onClick={onAdd}>+ Add New</button>
    </div>
  );
}