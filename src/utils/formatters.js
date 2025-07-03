// Fungsi untuk memformat angka ke format mata uang Rupiah (untuk tampilan hasil)
export const formatCurrency = (value) => {
  if (isNaN(value) || !isFinite(value)) {
    return "Rp 0";
  }
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Fungsi untuk memformat angka di input dengan pemisah ribuan
export const formatNumberInput = (value) => {
  if (value === null || value === undefined || isNaN(value)) return "";
  // Hapus karakter non-digit sebelum memformat
  const stringValue = String(value).replace(/[^0-9]/g, '');
  const number = parseInt(stringValue, 10);
  if (isNaN(number)) return "";
  return new Intl.NumberFormat("id-ID").format(number);
};

// Fungsi untuk mengubah string angka yang diformat kembali menjadi angka
export const parseNumberInput = (value) => {
  if (typeof value !== 'string') return 0;
  const number = parseInt(value.replace(/[^0-9]/g, ""), 10);
  return isNaN(number) ? 0 : number;
};
