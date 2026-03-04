# DWP Test
Waktu Pengerjaan Aplikasi 17:00 3 Maret 2026 - 16:43 4 Maret 2026
Aplikasi web untuk top up paket data internet berbasis Next.js + json-server (mock API).

## Prasyarat

- Node.js LTS (disarankan versi terbaru)
- `pnpm` minimal `9.x` (direkomendasikan `10.x`)

Cek versi:

```bash
node -v
pnpm -v
```

## Install Project

1. Install dependency:

```bash
pnpm install
```

2. Siapkan environment:

```bash
cp .env.example .env
```

## Menjalankan Project

Jalankan frontend saja:

```bash
pnpm dev
```

Jalankan mock API saja:

```bash
pnpm mock
```

Jalankan frontend + mock API bersamaan:

```bash
pnpm dev:full
```

Alamat default:

- App: `http://localhost:3000`
- Mock API: `http://localhost:3001`

## Struktur Project (Ringkas)

```text
dwp-test/
├── public/                # aset statis
├── src/
│   ├── app/               # halaman & layout (App Router)
│   ├── commons/           # route, endpoint, constants, shared types
│   ├── components/        # komponen layout/global
│   ├── configs/           # konfigurasi env client
│   ├── libs/              # axios, react-query, cookies, store
│   ├── modules/           # layer API per domain (auth, checkout, customer, dst)
│   ├── types/             # tipe global
│   └── utils/             # helper umum
├── db.json                # data mock json-server
├── package.json           # scripts & dependencies
└── pnpm-lock.yaml         # lockfile pnpm
```

## Fitur Utama

| Fitur | Deskripsi | Route |
|---|---|---|
| Login OTP | Login via nomor HP/email dengan verifikasi OTP | `/login` |
| Checkout Paket | Pilih paket data dan review pesanan sebelum bayar | `/checkout` |
| Status Checkout | Halaman status transaksi selesai/menunggu | `/checkout/success`, `/checkout/pending` |
| Dashboard Customer | Ringkasan akun customer setelah login | `/customer` |
| Profile & Security | Update profil dan ubah password | `/customer/profile` |
| Saved Numbers | Simpan dan hapus nomor tujuan favorit | `/customer/saved-numbers` |
| Payment Methods | Tambah/edit/hapus metode pembayaran dan set default | `/customer/payment-methods` |
| Riwayat Transaksi | Lihat daftar transaksi, filter status, detail transaksi | `/customer/transactions` |

## Akun Demo (Mock)

| Nama | Email | Phone | OTP |
|---|---|---|---|
| John Doe | `demo@example.com` | `081234567890` | `123456` |
| Budi Santoso | `budi@example.com` | `081212345678` | `123456` |
| Siti Rahayu | `siti@example.com` | `085698765432` | `123456` |
| Ahmad Fauzi | `ahmad@example.com` | `087812301234` | `123456` |
| Dewi Lestari | `dewi@example.com` | `089612345678` | `123456` |
| Rizki Maulana | `rizki@example.com` | `083156781234` | `123456` |
