document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-edit");
  const index = localStorage.getItem("editIndex");
  const daftarMukh = JSON.parse(localStorage.getItem("daftarMukh")) || [];

  if (index === null || !daftarMukh[index]) {
    Swal.fire({
      icon: "error",
      title: "Data tidak ditemukan",
      text: "Kembali ke halaman utama",
      timer: 2000,
      showConfirmButton: false
    }).then(() => {
      window.location.href = "utama.html";
    });
    return;
  }

  const data = daftarMukh[index];
  document.getElementById("nama").value = data.nama;
  document.getElementById("kelas").value = data.kelas;
  document.getElementById("kamar").value = data.kamar;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    data.nama = document.getElementById("nama").value.trim();
    data.kelas = document.getElementById("kelas").value.trim();
    data.kamar = document.getElementById("kamar").value.trim();

    daftarMukh[index] = data;
    localStorage.setItem("daftarMukh", JSON.stringify(daftarMukh));

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Data berhasil disimpan",
      timer: 1500,
      showConfirmButton: false,
      showClass: { popup: "animate__animated animate__fadeInDown" },
      hideClass: { popup: "animate__animated animate__fadeOutUp" }
    }).then(() => {
      window.location.href = "utama.html";
    });
  });
});