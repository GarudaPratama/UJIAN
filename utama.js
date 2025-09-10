document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("add-btn");
  const themeToggle = document.getElementById("theme-toggle");
  const exportBtn = document.getElementById("export-btn");
  const printBtn = document.getElementById("print-btn");
  const listMukh = document.getElementById("daftar-mukhallif");
  const emptyState = document.getElementById("empty-state");

  const totalBahasa = document.getElementById("total-bahasa");
  const totalIbadah = document.getElementById("total-ibadah");
  const totalKebersihan = document.getElementById("total-kebersihan");
  const totalKeamanan = document.getElementById("total-keamanan");

  document.getElementById("year").textContent = new Date().getFullYear();

  let daftarMukh = JSON.parse(localStorage.getItem("daftarMukh")) || [];

  function saveData() {
    localStorage.setItem("daftarMukh", JSON.stringify(daftarMukh));
  }

  // --- Sorting berdasarkan kelas (angka makin kecil lebih utama), lalu nama A-Z
  function sortData() {
    daftarMukh.sort((a, b) => {
      if (a.kelas !== b.kelas) {
        return a.kelas.localeCompare(b.kelas, "id", { numeric: true });
      }
      return a.nama.localeCompare(b.nama, "id", { sensitivity: "base" });
    });
  }

  function renderSummary() {
    totalBahasa.textContent = daftarMukh.reduce((sum, i) => sum + i.bahasa, 0);
    totalIbadah.textContent = daftarMukh.reduce((sum, i) => sum + i.ibadah, 0);
    totalKebersihan.textContent = daftarMukh.reduce((sum, i) => sum + i.kebersihan, 0);
    totalKeamanan.textContent = daftarMukh.reduce((sum, i) => sum + i.keamanan, 0);
  }

  function renderMukhallif() {
    sortData();
    listMukh.innerHTML = "";
    if (daftarMukh.length === 0) {
      emptyState.hidden = false;
      return;
    }
    emptyState.hidden = true;

    daftarMukh.forEach((item, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.nama}</td>
        <td>${item.kelas}</td>
        <td>${item.kamar}</td>
        <td>
          <button class="row-btn" onclick="updateCount(${index}, 'bahasa', 1)">➕</button>
          ${item.bahasa}
          <button class="row-btn" onclick="updateCount(${index}, 'bahasa', -1)">➖</button>
        </td>
        <td>
          <button class="row-btn" onclick="updateCount(${index}, 'ibadah', 1)">➕</button>
          ${item.ibadah}
          <button class="row-btn" onclick="updateCount(${index}, 'ibadah', -1)">➖</button>
        </td>
        <td>
          <button class="row-btn" onclick="updateCount(${index}, 'kebersihan', 1)">➕</button>
          ${item.kebersihan}
          <button class="row-btn" onclick="updateCount(${index}, 'kebersihan', -1)">➖</button>
        </td>
        <td>
          <button class="row-btn" onclick="updateCount(${index}, 'keamanan', 1)">➕</button>
          ${item.keamanan}
          <button class="row-btn" onclick="updateCount(${index}, 'keamanan', -1)">➖</button>
        </td>
        <td>
          <button class="row-btn" onclick="editMukhallif(${index})">✏️ Edit</button>
          <button class="row-btn" onclick="deleteMukhallif(${index})">🗑 Hapus</button>
        </td>
      `;
      listMukh.appendChild(tr);
    });
    renderSummary();
  }

  // --- Tambah dengan SweetAlert2 ---
  addBtn.addEventListener("click", async () => {
    const { value: formValues } = await Swal.fire({
      title: "Tambah Mukhallif",
      html: `
        <input id="swal-nama" class="swal2-input" placeholder="Nama">
        <input id="swal-kelas" class="swal2-input" placeholder="Kelas (angka)">
        <input id="swal-kamar" class="swal2-input" placeholder="Kamar">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Simpan",
      preConfirm: () => {
        return {
          nama: document.getElementById("swal-nama").value.trim(),
          kelas: document.getElementById("swal-kelas").value.trim(),
          kamar: document.getElementById("swal-kamar").value.trim(),
          bahasa: 0,
          ibadah: 0,
          kebersihan: 0,
          keamanan: 0,
        };
      }
    });

    if (formValues && formValues.nama && formValues.kelas && formValues.kamar) {
      daftarMukh.push(formValues);
      saveData();
      renderMukhallif();
      Swal.fire("Tersimpan!", "Data berhasil ditambahkan.", "success");
    }
  });

  // --- Update Count ---
  window.updateCount = function (index, field, delta) {
    daftarMukh[index][field] = Math.max(0, daftarMukh[index][field] + delta);
    saveData();
    renderMukhallif();
  };

  // --- Edit dengan SweetAlert2 ---
  window.editMukhallif = async function (index) {
    const item = daftarMukh[index];
    const { value: formValues } = await Swal.fire({
      title: "Edit Mukhallif",
      html: `
        <input id="swal-nama" class="swal2-input" value="${item.nama}">
        <input id="swal-kelas" class="swal2-input" value="${item.kelas}">
        <input id="swal-kamar" class="swal2-input" value="${item.kamar}">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Update",
      preConfirm: () => {
        return {
          ...item,
          nama: document.getElementById("swal-nama").value.trim(),
          kelas: document.getElementById("swal-kelas").value.trim(),
          kamar: document.getElementById("swal-kamar").value.trim(),
        };
      }
    });

    if (formValues) {
      daftarMukh[index] = formValues;
      saveData();
      renderMukhallif();
      Swal.fire("Berhasil!", "Data berhasil diperbarui.", "success");
    }
  };

  // --- Hapus dengan SweetAlert2 ---
  window.deleteMukhallif = function (index) {
    Swal.fire({
      title: "Yakin hapus?",
      text: "Data akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!"
    }).then((result) => {
      if (result.isConfirmed) {
        daftarMukh.splice(index, 1);
        saveData();
        renderMukhallif();
        Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
      }
    });
  };

  // --- Export PDF ---
  exportBtn.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Daftar Mukhallif", 14, 16);
    doc.autoTable({
      startY: 20,
      head: [["Nama", "Kelas", "Kamar", "Bahasa", "Ibadah", "Kebersihan", "Keamanan"]],
      body: daftarMukh.map(i => [i.nama, i.kelas, i.kamar, i.bahasa, i.ibadah, i.kebersihan, i.keamanan])
    });

    doc.save("mukhallif.pdf");
  });

  // --- Print ---
  printBtn.addEventListener("click", () => {
    const printWindow = window.open("", "_blank");
    const tableHtml = `
      <h2 style="text-align:center;">Daftar Mukhallif</h2>
      <table border="1" cellspacing="0" cellpadding="6" style="width:100%; border-collapse:collapse; text-align:center;">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Kelas</th>
            <th>Kamar</th>
            <th>Bahasa</th>
            <th>Ibadah</th>
            <th>Kebersihan</th>
            <th>Keamanan</th>
          </tr>
        </thead>
        <tbody>
          ${daftarMukh.map(i => `
            <tr>
              <td>${i.nama}</td>
              <td>${i.kelas}</td>
              <td>${i.kamar}</td>
              <td>${i.bahasa}</td>
              <td>${i.ibadah}</td>
              <td>${i.kebersihan}</td>
              <td>${i.keamanan}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;
    printWindow.document.write(`<html><head><title>Cetak</title></head><body>${tableHtml}</body></html>`);
    printWindow.document.close();
    printWindow.print();
  });

  // --- Theme Toggle ---
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });

  renderMukhallif();
});
