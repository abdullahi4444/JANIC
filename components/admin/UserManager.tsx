"use client";

import React, { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, KeyRound, UserCog } from "lucide-react";

interface UserItem {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

export function UserManager() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "", role: "STAFF" });
  const [creating, setCreating] = useState(false);

  const load = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to load users");
      setUsers(data.items);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const id = setTimeout(() => {
      void load();
    }, 0);
    return () => clearTimeout(id);
  }, []);

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to create user");
      setForm({ name: "", username: "", email: "", password: "", role: "STAFF" });
      load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error");
    } finally {
      setCreating(false);
    }
  };

  const changeRole = async (id: string, role: string) => {
    const res = await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) return alert(data.error || "Failed to update role");
    load();
  };

  const resetPassword = async (id: string) => {
    const password = prompt("Enter a new password (min 6 characters):");
    if (!password) return;
    const res = await fetch(`/api/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) return alert(data.error || "Failed to reset password");
    alert("Password updated");
  };

  const removeUser = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok || !data.success) return alert(data.error || "Failed to delete user");
    load();
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-border/80 shadow-sm space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-border">
        <UserCog className="w-4 h-4 text-blue-600" />
        <h3 className="text-sm font-bold text-foreground">User Management</h3>
      </div>

      <form onSubmit={createUser} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2">
        <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        <input placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none">
          <option value="STAFF">STAFF</option>
          <option value="EDITOR">EDITOR</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button type="submit" disabled={creating} className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition disabled:opacity-50 cursor-pointer">
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Add
        </button>
      </form>

      {loading ? (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading users...
        </div>
      ) : error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="py-2 pr-4 font-semibold">Name</th>
                <th className="py-2 pr-4 font-semibold">Email</th>
                <th className="py-2 pr-4 font-semibold">Role</th>
                <th className="py-2 pr-4 font-semibold">Created</th>
                <th className="py-2 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-border">
                  <td className="py-2 pr-4 font-semibold text-foreground">{u.name}</td>
                  <td className="py-2 pr-4 text-muted-foreground">{u.email}</td>
                  <td className="py-2 pr-4">
                    <select value={u.role} onChange={(e) => changeRole(u.id, e.target.value)} className="px-2 py-1 border border-slate-300 rounded-md text-xs">
                      <option value="ADMIN">ADMIN</option>
                      <option value="EDITOR">EDITOR</option>
                      <option value="STAFF">STAFF</option>
                    </select>
                  </td>
                  <td className="py-2 pr-4 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="py-2 text-right space-x-2">
                    <button onClick={() => resetPassword(u.id)} title="Reset password" className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer">
                      <KeyRound className="w-4 h-4" />
                    </button>
                    <button onClick={() => removeUser(u.id)} title="Delete user" className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
