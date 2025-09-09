document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-mukhallif");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nama = document.getElementById("nama").value.trim();
    const kelas = document.getElementById("kelas").value.trim();
    const kamar = document.getElementById("kamar").value.trim();

    if (!nama || !kelas || !kamar) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Semua field wajib diisi!",
        showClass: { popup: "animate__animated animate__shakeX" },
        hideClass: { popup: "animate__animated animate__fadeOut" }
      });
      return;
    }

    const daftarMukh = JSON.parse(localStorage.getItem("daftarMukh")) || [];

    daftarMukh.push({ nama, kelas, kamar, bahasa: 0, ibadah: 0, kebersihan: 0, keamanan: 0 });
    localStorage.setItem("daftarMukh", JSON.stringify(daftarMukh));

    Swal.fire({
      icon: "success",
      title: "Berhasil!",
      text: "Data berhasil ditambahkan",
      timer: 1500,
      showConfirmButton: false,
      showClass: { popup: "animate__animated animate__fadeInDown" },
      hideClass: { popup: "animate__animated animate__fadeOutUp" }
    }).then(() => {
      window.location.href = "index.html";
    });
  });
});