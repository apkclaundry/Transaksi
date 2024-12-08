function formatRupiah(number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(number);
}

document.addEventListener('DOMContentLoaded', () => {
  const transactionForm = document.getElementById('transaction-form');
  const transactionTableBody = document.querySelector('#transaction-table tbody');

  // Ambil transaksi dari localStorage atau inisialisasi dengan array kosong
  let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

  // Fungsi untuk memperbarui tabel transaksi
  function updateTransactionTable() {
    transactionTableBody.innerHTML = '';
    transactions.forEach((transaction, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${index + 1}</td>
        <td>${transaction.date}</td>
        <td>${transaction.customerName}</td>
        <td>${transaction.phone}</td>
        <td>${transaction.serviceName}</td>
        <td>${transaction.weight} kg</td>
        <td>${formatRupiah(transaction.total)}</td>
        <td>
          <button class="delete" onclick="deleteTransaction(${transaction.id})">🗑️ Hapus</button>
        </td>
      `;
      transactionTableBody.appendChild(row);
    });
  }

  // Tambahkan transaksi baru
  transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const customerName = document.getElementById('customer-name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const selectedService = document.getElementById('service-type').options[
      document.getElementById('service-type').selectedIndex
    ];
    const serviceName = selectedService.textContent;
    const servicePrice = parseFloat(selectedService.dataset.price);
    const weight = parseFloat(document.getElementById('weight').value.trim());

    if (!customerName || !phone || !serviceName || weight <= 0) {
      Swal.fire('Error', 'Mohon lengkapi data dengan benar!', 'error');
      return;
    }

    const total = servicePrice * weight;
    const transaction = {
      id: new Date().getTime(), // ID unik menggunakan timestamp
      date: new Date().toLocaleString(),
      customerName,
      phone,
      serviceName,
      weight,
      total,
    };

    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateTransactionTable();

    transactionForm.reset();
    Swal.fire('Berhasil!', 'Transaksi berhasil ditambahkan.', 'success');
  });

  // Tampilkan transaksi saat halaman dimuat
  updateTransactionTable();

  // Fungsi untuk menghapus transaksi berdasarkan ID
  window.deleteTransaction = (id) => {
    Swal.fire({
      title: 'Anda yakin?',
      text: 'Data transaksi ini akan dihapus!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        // Hapus transaksi berdasarkan ID
        transactions = transactions.filter((transaction) => transaction.id !== id);
        localStorage.setItem('transactions', JSON.stringify(transactions));

        // Perbarui tampilan tabel transaksi
        updateTransactionTable();

        Swal.fire('Dihapus!', 'Data transaksi telah dihapus.', 'success');
      }
    });
  };
});
