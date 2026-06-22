import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Manajemenmenu.css";

// --- IMPORT ASSETS ---
import logoLaobanSvg from "../../assets/Icons/icons-admin/logo.svg";
import iconDashboard from "../../assets/Icons/icons-admin/dashboard.svg";
import iconPos from "../../assets/Icons/icons-admin/pos.svg";
import iconPesananDapur from "../../assets/Icons/icons-admin/pesanandapur.svg";
import iconStok from "../../assets/Icons/icons-admin/stok.svg";
import iconLaporan from "../../assets/Icons/icons-admin/laporan.svg";
import iconQrMeja from "../../assets/Icons/icons-admin/QrMeja.svg";
import iconLogout from "../../assets/Icons/icons-admin/logout.svg";

const API_BASE_URL = "/api/kasir";

const initialFormData = {
  name: "",
  price: "",
  category: "",
  description: "",
  image_url: "",
};

const Manajemenmenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [menus, setMenus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("Semua Kategori");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState(initialFormData);

  // ============================================================================
  // DATA MENU
  // ============================================================================

  const fetchMenus = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/menus?_t=${Date.now()}`,
      );
      setMenus(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Gagal mengambil data menu:", error);
      setErrorMsg(
        error.response?.data?.message ||
          error.message ||
          "Gagal mengambil data menu.",
      );
      setMenus([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  const dynamicCategories = useMemo(() => {
    const categories = menus.map((item) => item.category).filter(Boolean);

    return ["Semua Kategori", ...new Set(categories)];
  }, [menus]);

  const filteredMenus = useMemo(() => {
    return menus.filter((item) => {
      const menuName = String(item.name || "").toLowerCase();
      const menuCategory = String(item.category || "");

      const matchSearch = menuName.includes(searchQuery.toLowerCase());
      const matchCategory =
        filterCategory === "Semua Kategori" || menuCategory === filterCategory;

      return matchSearch && matchCategory;
    });
  }, [menus, searchQuery, filterCategory]);

  // ============================================================================
  // HELPER
  // ============================================================================

  const formatRupiah = (value) => {
    const numericValue = Number(value || 0);

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(numericValue);
  };

  const getMenuClass = (path) => {
    return location.pathname === path ? "menu-item active" : "menu-item";
  };

  const getIconClass = (path) => {
    return location.pathname === path
      ? "menu-icon-svg"
      : "menu-icon-svg icon-white";
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userRole");
    navigate("/login");
  };

  // ============================================================================
  // FORM MENU
  // ============================================================================

  const handleOpenAddModal = () => {
    setIsEditMode(false);
    setEditId(null);
    setFormData(initialFormData);
    setIsModalOpen(true);
  };

  const handleEditClick = (item) => {
    setIsEditMode(true);
    setEditId(item.id);
    setFormData({
      name: item.name || "",
      price: item.price || "",
      category: item.category || "",
      description: item.description || "",
      image_url: item.image_url || item.img || "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSaving) {
      return;
    }

    setIsModalOpen(false);
    setIsEditMode(false);
    setEditId(null);
    setFormData(initialFormData);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      alert("Nama menu wajib diisi.");
      return false;
    }

    if (!formData.price || Number(formData.price) <= 0) {
      alert("Harga menu wajib diisi dan harus lebih dari 0.");
      return false;
    }

    if (!formData.category.trim()) {
      alert("Kategori menu wajib diisi.");
      return false;
    }

    return true;
  };

  const buildPayload = () => {
    return {
      name: formData.name.trim(),
      price: Number(formData.price),
      category: formData.category.trim(),
      description: formData.description.trim(),
      image_url: formData.image_url.trim(),
    };
  };

  const handleSubmitMenu = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      const payload = buildPayload();

      if (isEditMode && editId) {
        await axios.post(`${API_BASE_URL}/menus/${editId}/update`, payload);
        alert("Menu berhasil diperbarui.");
      } else {
        await axios.post(`${API_BASE_URL}/menus`, payload);
        alert("Menu berhasil ditambahkan.");
      }

      handleCloseModal();
      await fetchMenus();
    } catch (error) {
      console.error("Gagal menyimpan menu:", error);
      alert(error.response?.data?.message || "Gagal menyimpan menu.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMenu = async (item) => {
    const confirmDelete = window.confirm(
      `Yakin ingin menghapus menu ${item.name}?`,
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/menus/${item.id}/delete`);
      alert("Menu berhasil dihapus.");
      await fetchMenus();
    } catch (error) {
      console.error("Gagal menghapus menu:", error);
      alert(error.response?.data?.message || "Gagal menghapus menu.");
    }
  };

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <div className="sidebar-top-section">
          <div className="sidebar-logo-container">
            <img src={logoLaobanSvg} alt="Logo Laoban" />
          </div>

          <nav className="sidebar-menu">
            <Link to="/kasir" className={getMenuClass("/kasir")}>
              <img
                src={iconDashboard}
                alt="Denah"
                className={getIconClass("/kasir")}
              />
              Denah Meja
            </Link>

            <Link to="/kasir/pos" className={getMenuClass("/kasir/pos")}>
              <img
                src={iconPos}
                alt="POS"
                className={getIconClass("/kasir/pos")}
              />
              Kasir / POS
            </Link>

            <Link
              to="/kasir/pesanan"
              className={getMenuClass("/kasir/pesanan")}
            >
              <img
                src={iconPesananDapur}
                alt="Pesanan"
                className={getIconClass("/kasir/pesanan")}
              />
              Pesanan Dapur
            </Link>

            <Link
              to="/kasir/manajemen-menu"
              className={getMenuClass("/kasir/manajemen-menu")}
            >
              <img
                src={iconStok}
                alt="Menu"
                className={getIconClass("/kasir/manajemen-menu")}
              />
              Manajemen Menu
            </Link>

            <Link to="/kasir/stok" className={getMenuClass("/kasir/stok")}>
              <img
                src={iconStok}
                alt="Stok"
                className={getIconClass("/kasir/stok")}
              />
              Stok Bahan Baku
            </Link>

            <Link
              to="/kasir/laporan"
              className={getMenuClass("/kasir/laporan")}
            >
              <img
                src={iconLaporan}
                alt="Laporan"
                className={getIconClass("/kasir/laporan")}
              />
              Laporan & Riwayat
            </Link>

            <Link
              to="/kasir/qr-meja"
              className={getMenuClass("/kasir/qr-meja")}
            >
              <img
                src={iconQrMeja}
                alt="QR"
                className={getIconClass("/kasir/qr-meja")}
              />
              QR Code Meja
            </Link>

            <div className="divider"></div>

            {/* --- FIX: TOMBOL KEMBALI KE PUSAT SEKARANG MEMICU LOGOUT --- */}
            <button
              onClick={handleLogout}
              className="menu-item"
              style={{
                background: "none",
                border: "none",
                textAlign: "left",
                width: "100%",
                cursor: "pointer",
                fontFamily: "inherit",
                color: "white",
                display: "flex",
                alignItems: "center",
                fontSize: "14px",
                gap: "12px",
              }}
            >
              <img
                src={iconDashboard}
                alt="Admin"
                className="menu-icon-svg icon-white"
              />{" "}
              Kembali ke Pusat
            </button>
          </nav>
        </div>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <img
              src={iconLogout}
              alt="Logout"
              className="menu-icon-svg icon-white"
            />
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumb">
            Cashier Mode / <span className="text-black font-bold">Menu</span>
          </div>

          <div className="user-profile">
            <div className="user-info">
              <span className="user-role">Cashier 01</span>
              <span className="user-status">Online</span>
            </div>
            <div className="user-avatar">👤</div>
          </div>
        </header>

        <div className="content-wrapper">
          <div className="dashboard-header-figma">
            <div className="header-text-group">
              <h1 className="page-title">Manajemen Menu</h1>
              <p className="page-subtitle">
                Kelola daftar menu, harga, dan ketersediaan
              </p>
            </div>

            <button className="btn-add-menu-figma" onClick={handleOpenAddModal}>
              <span className="plus-icon">+</span>
              Tambah Menu Cabang
            </button>
          </div>

          <div className="table-card-figma">
            <div className="toolbar-figma">
              <div className="search-bar-figma">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>

                <input
                  type="text"
                  placeholder="Cari menu..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </div>

              <select
                className="category-select-figma"
                value={filterCategory}
                onChange={(event) => setFilterCategory(event.target.value)}
              >
                {dynamicCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}h
                  </option>
                ))}
              </select>
            </div>

            {isLoading ? (
              <div className="loading-state">Memuat data menu...</div>
            ) : errorMsg ? (
              <div className="error-state">
                <strong>Gagal mengambil data menu:</strong>
                <br />
                {errorMsg}
              </div>
            ) : (
              <table className="menu-table-figma">
                <thead>
                  <tr>
                    <th>MENU</th>
                    <th>KATEGORI</th>
                    <th>HARGA</th>
                    <th className="text-right">AKSI</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredMenus.length > 0 ? (
                    filteredMenus.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="menu-info-figma">
                            {item.img || item.image_url ? (
                              <img
                                src={item.img || item.image_url}
                                alt={item.name}
                                className="menu-image-figma"
                              />
                            ) : (
                              <div className="menu-image-empty">No Image</div>
                            )}

                            <span className="menu-name-figma">{item.name}</span>
                          </div>
                        </td>

                        <td className="menu-cat-figma">
                          {item.category || "-"}
                        </td>
                        <td className="menu-price-figma">
                          {formatRupiah(item.price)}
                        </td>

                        <td className="action-cell">
                          <button
                            className="btn-edit-figma"
                            onClick={() => handleEditClick(item)}
                          >
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Edit
                          </button>

                          <button
                            className="btn-delete-figma"
                            onClick={() => handleDeleteMenu(item)}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="empty-table-message">
                        Tidak ada menu yang sesuai.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {isModalOpen && (
        <div className="modal-overlay-figma">
          <div className="modal-content-figma">
            <div className="modal-header-figma">
              <h2>{isEditMode ? "Edit Menu Cabang" : "Tambah Menu Baru"}</h2>
              <button className="btn-close-modal" onClick={handleCloseModal}>
                &times;
              </button>
            </div>

            <div className="modal-body-figma">
              <div className="modal-image-section">
                <div className="image-upload-label">
                  {formData.image_url ? (
                    <img
                      src={formData.image_url}
                      alt="Preview menu"
                      className="image-preview-large"
                    />
                  ) : (
                    <div className="image-placeholder">
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#94a3b8"
                        strokeWidth="1.5"
                      >
                        <rect
                          x="3"
                          y="3"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        ></rect>
                        <circle cx="8.5" cy="8.5" r="1.5"></circle>
                        <polyline points="21 15 16 10 5 21"></polyline>
                      </svg>
                      <span>Preview Foto Menu</span>
                    </div>
                  )}
                </div>

                <p className="image-hint">
                  Masukkan URL gambar dari Supabase / CDN / link gambar publik.
                </p>
              </div>

              <div className="modal-form-section">
                <div className="form-group-figma">
                  <label>NAMA MENU</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Contoh: Es Teh Manis"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-row-figma">
                  <div className="form-group-figma">
                    <label>KATEGORI</label>
                    <input
                      type="text"
                      name="category"
                      placeholder="Contoh: Cold Drink"
                      value={formData.category}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group-figma">
                    <label>HARGA (RP)</label>
                    <input
                      type="number"
                      name="price"
                      placeholder="0"
                      value={formData.price}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>

                <div className="form-group-figma">
                  <label>URL GAMBAR</label>
                  <input
                    type="text"
                    name="image_url"
                    placeholder="https://..."
                    value={formData.image_url}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group-figma">
                  <label>DESKRIPSI</label>
                  <textarea
                    name="description"
                    rows="3"
                    placeholder="Tulis komposisi atau detail menu..."
                    value={formData.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="modal-footer-figma">
              <button
                className="btn-cancel-figma"
                onClick={handleCloseModal}
                disabled={isSaving}
              >
                Batal
              </button>

              <button
                className="btn-save-figma"
                onClick={handleSubmitMenu}
                disabled={isSaving}
              >
                {isSaving
                  ? "Menyimpan..."
                  : isEditMode
                    ? "Simpan Perubahan"
                    : "Tambahkan Menu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Manajemenmenu;
