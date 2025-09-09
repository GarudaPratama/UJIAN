document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("add-btn");
  const themeToggle = document.getElementById("theme-toggle");
  const listMukh = document.getElementById("daftar-mukhallif");
  const emptyState = document.getElementById("empty-state");

  const totalBahasa = document.getElementById("total-bahasa");
  const totalIbadah = document.getElementById("total-ibadah");
  const totalKebersihan = document.getElementById("total-kebersihan");
  const totalKeamanan = document.getElementById("total-keamanan");

  document.getElementById("year").textContent = new Date().getFullYear();

  addBtn.addEventListener("click", () => {
    window.location.href = "tambah.html";
  });

  let daftarMukh = JSON.parse(localStorage.getItem("daftarMukh")) || [];

  function saveData() {
    localStorage.setItem("daftarMukh", JSON.stringify(daftarMukh));
  }

  function sortByName() {
    daftarMukh.sort((a, b) => a.nama.localeCompare(b.nama, "id", { sensitivity: "base" }));
  }

  function renderSummary() {
    totalBahasa.textContent = daftarMukh.reduce((sum, i) => sum + i.bahasa, 0);
    totalIbadah.textContent = daftarMukh.reduce((sum, i) => sum + i.ibadah, 0);
    totalKebersihan.textContent = daftarMukh.reduce((sum, i) => sum + i.kebersihan, 0);
    totalKeamanan.textContent = daftarMukh.reduce((sum, i) => sum + i.keamanan, 0);
  }

  function renderMukhallif() {
    sortByName();
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

  window.updateCount = function(index, field, delta) {
    daftarMukh[index][field] = Math.max(0, daftarMukh[index][field] + delta);
    saveData();
    renderMukhallif();
  };

  window.editMukhallif = function(index) {
    localStorage.setItem("editIndex", index);
    window.location.href = "edit.html";
  };

  window.deleteMukhallif = function(index) {
    Swal.fire({
      title: "Yakin hapus?",
      text: "Data akan dihapus permanen.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      showClass: { popup: "animate__animated animate__bounceInDown" },
      hideClass: { popup: "animate__animated animate__fadeOutUp" }
    }).then(result => {
      if (result.isConfirmed) {
        daftarMukh.splice(index, 1);
        saveData();
        renderMukhallif();
        Swal.fire({
          icon: "success",
          title: "Terhapus!",
          text: "Data berhasil dihapus.",
          timer: 1500,
          showConfirmButton: false,
          showClass: { popup: "animate__animated animate__fadeIn" },
          hideClass: { popup: "animate__animated animate__fadeOut" }
        });
      }
    });
  };

  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeToggle.classList.add("rotate");
    setTimeout(() => themeToggle.classList.remove("rotate"), 400);
  });

  renderMukhallif();
});