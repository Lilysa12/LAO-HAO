import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ManajemenAkunStaf.css";

// --- IMPORT ASSETS (Logo Standar 160px) ---
import logoLaobanSvg from "../../assets/Icons/icons-admin/logo.svg"; 
import iconDashboard from "../../assets/Icons/icons-admin/dashboard.svg";
import iconLaporan from "../../assets/Icons/icons-admin/laporan.svg";
import iconManajemen from "../../assets/Icons/icons-admin/manajemen.svg";
import iconPengaturan from "../../assets/Icons/icons-admin/pengaturan.svg";
import iconKasir from "../../assets/Icons/icons-admin/kasir.svg";
import iconLogout from "../../assets/Icons/icons-admin/logout.svg";
import iconPromosi from "../../assets/Icons/icons-admin/promosi.svg";
import iconKunci from "../../assets/Icons/icons-admin/kunci.svg";

const ManajemenAkunStaf = () => {
  const navigate = useNavigate(); // Inisialisasi navigate
  const [isModalOpen, setIsModalOpen] = useState(false);

  // STATE UNTUK DATA TABEL
  const [staffData, setStaffData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // STATE UNTUK PENCARIAN & FILTER
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("Semua Role");

  // STATE UNTUK FORMULIR
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    branch: "", 
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- FIX: FUNGSI LOGOUT DI DALAM KOMPONEN ---
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    navigate('/login'); // Langsung lempar ke login agar tidak blank putih
  };

  // FETCH DATA
  const fetchStaffData = () => {
    setIsLoading(true);
    axios
      .get(`http://127.0.0.1:8000/api/admin/staff?_t=${new Date().getTime()}`)
      .then((response) => {
        setStaffData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Gagal mengambil data staf:", error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchStaffData();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddClick = () => {
    setIsEditMode(false);
    setEditId(null);
    setFormData({ name: "", role: "", branch: "", email: "", password: "" });
    setIsModalOpen(true);
  };

  const handleEditClick = (staff) => {
    setIsEditMode(true);
    setEditId(staff.id);
    setFormData({
      name: staff.name,
      role: staff.role,
      branch: staff.branch || "", 
      email: staff.email,
      password: "",
    });
    setIsModalOpen(true);
  };

  // SUBMIT FORM (CREATE / UPDATE)
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditMode) {
        await axios.post(
          `http://127.0.0.1:8000/api/admin/staff/${editId}/update`,
          formData,
        );
        alert("Berhasil! Data staf telah diperbarui.");
      } else {
        await axios.post("http://127.0.0.1:8000/api/admin/staff", formData);
        alert("Berhasil! Akun staf baru telah ditambahkan.");
      }

      setIsModalOpen(false);
      fetchStaffData();
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      const errorMsg =
        error.response?.data?.message || "Pastikan form terisi dengan benar.";
      alert(`Gagal! ${errorMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStaff = async (id, staffName) => {
    const isConfirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus akun staf ${staffName}? Data tidak dapat dikembalikan.`,
    );
    if (isConfirmed) {
      try {
        await axios.post(`http://127.0.0.1:8000/api/admin/staff/${id}/delete`);
        alert("Akun staf berhasil dihapus!");
        fetchStaffData();
      } catch (error) {
        console.error("Detail Error:", error);
        alert("Gagal menghapus!");
      }
    }
  };

  // PROSES FILTERING DATA
  const filteredStaff = staffData.filter((staff) => {
    const matchesSearch =
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesRole = true;
    if (roleFilter === "Super Admin")
      matchesRole = staff.role === "SUPER ADMIN";
    if (roleFilter === "Kasir") matchesRole = staff.role === "KASIR";
    if (roleFilter === "Dapur") matchesRole = staff.role === "DAPUR / KITCHEN";

    return matchesSearch && matchesRole;
  });

  return (
    <div className="admin-container">
      {/* --- SIDEBAR STANDAR LOGO LAOBAN --- */}
      <aside className="sidebar" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
          
          <div style={{ 
            width: '100%', 
            padding: '35px 20px 20px 20px', 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            boxSizing: 'border-box'
          }}>
            <img 
              src={logoLaobanSvg} 
              alt="Logo Laoban" 
              style={{ width: '100%', maxWidth: '160px', height: 'auto', display: 'block' }} 
            />
          </div>

          <nav className="sidebar-menu" style={{ marginTop: '0px', paddingTop: '10px' }}>
            <Link to="/admin" className="menu-item">
              <img src={iconDashboard} alt="Dashboard" className="menu-icon-svg icon-white" />
              Overview Cabang
            </Link>
            <Link to="/admin/laporan-penjualan-pusat" className="menu-item">
              <img src={iconLaporan} alt="Laporan" className="menu-icon-svg icon-white" />
              Laporan Penjualan Pusat
            </Link>
            <Link to="/admin/manajemen-promo" className="menu-item">
              <img src={iconPromosi} alt="Promo" className="menu-icon-svg icon-white" />
              Manajemen Promo
            </Link>
            <Link to="/admin/manajemen-akun-staf" className="menu-item active">
              <img src={iconManajemen} alt="Manajemen Staf" className="menu-icon-svg" />
              Manajemen Akun Staf
            </Link>
            <Link to="/admin/pengaturan" className="menu-item">
              <img src={iconPengaturan} alt="Pengaturan" className="menu-icon-svg icon-white" />
              Pengaturan
            </Link>

            <div className="divider" style={{ margin: '15px 16px' }}></div>

            <Link to="/kasir" className="menu-item">
              <img src={iconKasir} alt="Kasir" className="menu-icon-svg icon-white" />
              Kasir / POS Mode
            </Link>
          </nav>
        </div>

        {/* --- FIX: TOMBOL LOGOUT SEKARANG PAKAI FUNGSI handleLogout --- */}
        <div className="sidebar-footer">
          <button onClick={handleLogout} className="logout-btn" style={{ background: 'none', border: 'none', padding: '10px 16px', cursor: 'pointer', textAlign: 'left', width: '100%', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <img src={iconLogout} alt="Logout" className="menu-icon-svg icon-white" />
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            <span className="text-gray">Super Admin / </span>
            <span className="text-black font-bold">Staff</span>
          </div>
          <div className="user-profile">
            <div className="user-info">
              <span className="user-role">Super Admin</span>
              <span className="user-status">Online</span>
            </div>
            <div className="user-avatar">👤</div>
          </div>
        </header>

        <div className="content-wrapper">
          <div className="dashboard-page">
            <div className="dashboard-header">
              <div>
                <h1 className="page-title">Manajemen Akun Staf</h1>
                <p className="page-subtitle">
                  Kelola hak akses dan akun karyawan Lao-Hao
                </p>
              </div>
              <button className="btn-primary flex-btn" onClick={handleAddClick}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
                Tambah Staf Baru
              </button>
            </div>

            <div className="card table-container">
              <div className="table-toolbar">
                <div className="search-wrapper">
                  <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  <input
                    type="text"
                    placeholder="Cari nama atau email staf..."
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="filter-dropdown-wrapper">
                  <select
                    className="form-input select-filter"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <option value="Semua Role">Semua Role</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Kasir">Kasir</option>
                    <option value="Dapur">Dapur</option>
                  </select>
                </div>
              </div>

              {isLoading ? (
                <div style={{ padding: "20px", textAlign: "center" }}>
                  Memuat data staf dari Supabase...
                </div>
              ) : (
                <table className="transaction-table staff-table">
                  <thead>
                    <tr>
                      <th>NAMA & KONTAK</th>
                      <th>ROLE AKSES</th>
                      <th>STATUS AKUN</th>
                      <th>LOGIN TERAKHIR</th>
                      <th className="text-center">AKSI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStaff.length > 0 ? (
                      filteredStaff.map((staff) => (
                        <tr key={staff.id}>
                          <td>
                            <div className="name-contact-cell">
                              <div className="avatar-circle">
                                {staff.initial}
                              </div>
                              <div>
                                <div className="font-bold text-black name-text flex-align-center">
                                  {staff.name}
                                  {staff.isVerified && (
                                    <svg className="verified-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                    </svg>
                                  )}
                                </div>
                                <div className="text-gray text-small">
                                  {staff.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`role-badge ${staff.roleClass}`}>
                              {staff.role}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${staff.status === "AKTIF" ? "badge-success" : "badge-danger"}`}>
                              {staff.status}
                            </span>
                          </td>
                          <td className="text-gray text-small">
                            {staff.lastLogin}
                          </td>
                          <td>
                            <div className="action-icons-cell">
                              <button className="action-icon-btn" title="Edit Staf" onClick={() => handleEditClick(staff)}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                </svg>
                              </button>

                              <button className="action-icon-btn" title="Hapus Staf" onClick={() => handleDeleteStaff(staff.id, staff.name)}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="3 6 5 6 21 6"></polyline>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center text-gray" style={{ padding: "20px" }}>
                          Tidak ada staf yang sesuai dengan pencarian/filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content modal-scrollable-wrapper">
            <div className="modal-header">
              <h2>{isEditMode ? "Edit Akun Staf" : "Tambah Akun Baru"}</h2>
              <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmitForm}>
              <div className="modal-body custom-scrollbar">
                <div className="form-group">
                  <label>NAMA LENGKAP</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Masukkan nama lengkap staf"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>ROLE AKUN</label>
                  <select name="role" value={formData.role} onChange={handleInputChange} className="form-input select-input" required>
                    <option value="" disabled>Pilih Role</option>
                    <option value="SUPER ADMIN">Super Admin</option>
                    <option value="KASIR">Kasir Cabang</option>
                    <option value="DAPUR / KITCHEN">Dapur / Kitchen</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>PILIH CABANG</label>
                  <select name="branch" value={formData.branch} onChange={handleInputChange} className="form-input select-input" required>
                    <option value="" disabled>Pilih Cabang Penempatan</option>
                    <option value="Semua Cabang (HQ)">Semua Cabang (HQ)</option>
                    <option value="Cabang Tebet">Cabang Tebet</option>
                    <option value="Cabang Sudirman">Cabang Sudirman</option>
                    <option value="Cabang Kelapa Gading">Cabang Kelapa Gading</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>EMAIL LOGIN</label>
                  <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="contoh: budi@laohao.com" className="form-input" required />
                </div>

                <div className="form-group">
                  <label>PASSWORD</label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={isEditMode ? "•••••••• (Biarkan jika tidak diubah)" : "Minimal 6 karakter"}
                    className="form-input"
                    minLength="6"
                    required={!isEditMode}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Batal</button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Menyimpan..." : isEditMode ? "Simpan Perubahan" : "Simpan Akun"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManajemenAkunStaf;