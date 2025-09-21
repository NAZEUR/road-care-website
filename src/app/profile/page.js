
"use client";
import { useRouter } from "next/navigation";
import { getCurrentUser, logout, registerUser } from "../../lib/auth";
import { useEffect, useState } from "react";
import { getReportsByUser, saveReports, getReports } from "../../lib/reports";
import { badgeClass, formatDate } from "../../lib/utils";

export default function ProfilePage() {
			const [user, setUser] = useState(null);
			const [myReports, setMyReports] = useState([]);
			const [editId, setEditId] = useState(null);
			const [editForm, setEditForm] = useState({ title: "", description: "", status: "Belum diperbaiki", date: "" });
		const [name, setName] = useState("");
		const [email, setEmail] = useState("");
		const [phone, setPhone] = useState("");
		const [password, setPassword] = useState("");
		const [showPassword, setShowPassword] = useState(false);
		const [loading, setLoading] = useState(false);
		const [success, setSuccess] = useState("");
		const [error, setError] = useState("");
		const [avatar, setAvatar] = useState("");
		const router = useRouter();

			useEffect(() => {
				const u = getCurrentUser();
				setUser(u);
				if (u) {
					setName(u.name || "");
					setEmail(u.email || "");
					setPhone(u.phone || "");
					setAvatar(u.avatar || "");
					setMyReports(getReportsByUser(u.id));
				}
			}, []);
	function handleEditReport(r) {
		setEditId(r.id);
		setEditForm({ title: r.title, description: r.description, status: r.status, date: r.date || "" });
	}

	function handleEditChange(e) {
		const { name, value } = e.target;
		setEditForm(f => ({ ...f, [name]: value }));
	}

	function handleEditSave(id) {
		const all = getReports();
		const idx = all.findIndex(r => r.id === id);
		if (idx !== -1) {
			all[idx] = { ...all[idx], ...editForm };
			saveReports(all);
			setMyReports(getReportsByUser(user.id));
			setEditId(null);
		}
	}

	function handleDeleteReport(id) {
		if (!confirm("Yakin ingin menghapus laporan ini?")) return;
		const all = getReports().filter(r => r.id !== id);
		saveReports(all);
		setMyReports(getReportsByUser(user.id));
	}

	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="card p-8 max-w-md w-full text-center">
					<h2 className="text-xl font-bold mb-4">Anda belum login</h2>
					<a href="/login" className="text-primary font-medium hover:underline">Login</a>
						</div>
						<div className="max-w-2xl mx-auto mt-10">
							<h3 className="text-xl font-bold mb-4">Laporan Saya</h3>
							<div className="card overflow-hidden">
								<div className="overflow-x-auto">
									<table className="min-w-full text-sm">
										<thead className="bg-gray-50 text-left">
											<tr className="text-gray-700">
												<th className="px-5 py-3">Judul</th>
												<th className="px-5 py-3">Deskripsi</th>
												<th className="px-5 py-3">Status</th>
												<th className="px-5 py-3">Tanggal</th>
												<th className="px-5 py-3">Aksi</th>
											</tr>
										</thead>
										<tbody className="bg-white">
											{myReports.length === 0 ? (
												<tr>
													<td colSpan={5} className="px-5 py-6 text-center text-gray-600">Belum ada laporan.</td>
												</tr>
											) : (
												myReports.map(r => (
													<tr key={r.id} className="border-t border-gray-100">
														<td className="px-5 py-3 whitespace-nowrap">
															{editId === r.id ? (
																<input name="title" value={editForm.title} onChange={handleEditChange} className="border rounded px-2 py-1 w-full" />
															) : (
																<div className="font-medium">{r.title}</div>
															)}
														</td>
														<td className="px-5 py-3 max-w-[360px]">
															{editId === r.id ? (
																<textarea name="description" value={editForm.description} onChange={handleEditChange} className="border rounded px-2 py-1 w-full" />
															) : (
																<p className="text-gray-700 line-clamp-2">{r.description}</p>
															)}
														</td>
														<td className="px-5 py-3">
															{editId === r.id ? (
																<select name="status" value={editForm.status} onChange={handleEditChange} className="border rounded px-2 py-1">
																	<option value="Belum diperbaiki">Belum diperbaiki</option>
																	<option value="Sudah diperbaiki">Sudah diperbaiki</option>
																</select>
															) : (
																<span className={badgeClass(r.status)}>{r.status}</span>
															)}
														</td>
														<td className="px-5 py-3">
															{editId === r.id ? (
																<input name="date" type="date" value={editForm.date} onChange={handleEditChange} className="border rounded px-2 py-1" />
															) : (
																r.date ? formatDate(r.date) : "-"
															)}
														</td>
														<td className="px-5 py-3">
															{editId === r.id ? (
																<>
																	<button className="px-3 py-1 rounded bg-primary text-white mr-2" onClick={() => handleEditSave(r.id)}>Simpan</button>
																	<button className="px-3 py-1 rounded bg-gray-200" onClick={() => setEditId(null)}>Batal</button>
																</>
															) : (
																<>
																	<button className="px-3 py-1 rounded bg-yellow-100 text-yellow-800 mr-2" onClick={() => handleEditReport(r)}>Edit</button>
																	<button className="px-3 py-1 rounded bg-red-100 text-red-800" onClick={() => handleDeleteReport(r.id)}>Hapus</button>
																</>
															)}
														</td>
													</tr>
												))
											)}
										</tbody>
									</table>
								</div>
							</div>
						</div>
			</div>
		);
	}

		function handleAvatarChange(e) {
			const file = e.target.files?.[0];
			if (!file) return;
			const reader = new FileReader();
			reader.onload = () => {
				setAvatar(reader.result);
			};
			reader.readAsDataURL(file);
		}

		async function handleSave(e) {
			e.preventDefault();
			setLoading(true);
			setError("");
			setSuccess("");
			// Simpan perubahan ke local storage (mock)
			// Untuk password, hanya update jika diisi
			const updatedUser = {
				...user,
				name,
				email,
				phone,
				avatar,
				...(password ? { password } : {}),
			};
			// Simulasi update user
			localStorage.setItem("rdr_current_user", JSON.stringify(updatedUser));
			setUser(updatedUser);
			setLoading(false);
			setSuccess("Perubahan berhasil disimpan.");
		}

	function handleLogout() {
		logout();
		router.replace("/login");
	}

	return (
		<div className="min-h-screen bg-gray-50 py-10">
			<div className="max-w-2xl mx-auto">
				<h2 className="text-3xl font-bold mb-8">Profil Saya</h2>
						<div className="card flex items-center gap-6 p-6 mb-8">
							<div className="relative">
								<div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
									{avatar ? (
										<img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
									) : (
										<span className="text-4xl font-bold text-primary">{user.name[0]}</span>
									)}
								</div>
								<label className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow border cursor-pointer">
									<input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
									<svg width="24" height="24" fill="none" stroke="#2563eb" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M15.5 11.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z"/><path d="M12 14v2"/></svg>
								</label>
							</div>
							<div>
								<div className="text-xl font-bold">{name}</div>
								<div className="text-blue-600">{email}</div>
							</div>
						</div>
				<form className="card p-6 space-y-6" onSubmit={handleSave}>
					<h3 className="text-lg font-semibold mb-4">Informasi Pribadi</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-1">Nama</label>
							<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" value={name} onChange={e => setName(e.target.value)} required />
						</div>
						<div>
							<label className="block text-sm font-medium mb-1">Email</label>
							<input type="email" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" value={email} onChange={e => setEmail(e.target.value)} required />
						</div>
						<div>
							<label className="block text-sm font-medium mb-1">Nomor Telepon</label>
							<input type="text" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Masukkan nomor telepon Anda" />
						</div>
						<div>
							<label className="block text-sm font-medium mb-1">Kata Sandi</label>
							<div className="relative">
								<input type={showPassword ? "text" : "password"} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary pr-10" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••" />
								<button type="button" className="absolute right-2 top-2 text-gray-400" onClick={() => setShowPassword(s => !s)}>
									<svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
								</button>
							</div>
						</div>
					</div>
					{success && <div className="text-green-600 text-sm">{success}</div>}
					{error && <div className="text-red-500 text-sm">{error}</div>}
					<div className="flex justify-end gap-2 mt-4">
						<button type="button" onClick={handleLogout} className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600">Logout</button>
						<button type="submit" disabled={loading} className="px-6 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-blue-600">
							{loading ? "Menyimpan..." : "Simpan Perubahan"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
