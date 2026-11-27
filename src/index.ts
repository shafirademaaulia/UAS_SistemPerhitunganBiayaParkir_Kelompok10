import * as readline from "readline";

// Membuat interface untuk menerima input dari keyboard dan menampilkan output
const r1 = readline.createInterface({
input: process.stdin,
output: process.stdout,
});

// Denda karcis hilang, nilainya tetap
const Denda: number = 25000;

// Menyimpan seluruh data parkir selama program berjalan
interface DataParkir {
id: number;
Jenis: string;
Jam: number;
Member: string;
KarcisHilang: boolean;
Tarif: number;
Diskon: number;
Total: number;
Kategori: string;
}

let Data: DataParkir[] = [];
let IDBerikutnya: number = 1;

// Fungsi async untuk menerima input dari pengguna
async function tanya(Pertanyaan: string): Promise<string> {
return new Promise((resolve) => {
r1.question(Pertanyaan, (Jawaban: string) => {
resolve(Jawaban.trim());
});
});
}

// Fungsi untuk menerima angka dan melakukan validasi
async function InputAngka(Pertanyaan: string): Promise<number> {
let Angka: number;

    do {
Angka = Number(await tanya(Pertanyaan));

        if (isNaN(Angka)) {
console.log("Input harus berupa angka!");
}
} while (isNaN(Angka));

    return Angka;
}

// Fungsi menghitung tarif, diskon, denda, dan kategori parkir
function Hitung(
Jenis: string,
Jam: number,
Member: string,
KarcisHilang: boolean
): DataParkir | null {

    // IF 1: Validasi lama parkir
if (isNaN(Jam) || Jam < 0 || Jam > 24) {
console.log("Lama parkir harus angka 0 sampai 24!");
return null;
}

let Tarif: number = 0;
let NamaKendaraan: string = "";
let Benar: boolean = true;

    // SWITCH 1: Menentukan tarif berdasarkan kendaraan
switch (Jenis) {
case "1":
NamaKendaraan = "Motor";
Tarif = 2000;
break;

        case "2":
NamaKendaraan = "Mobil";
Tarif = 4000;

            // Tarif untuk mobil di atas 6 jam
if (Jam > 6) {
Tarif -= 500;
}
break;

        case "3":
NamaKendaraan = "Truk";
Tarif = 8000;

            // Tarif untuk Truk di atas 6 jam
if (Jam > 6) {
Tarif -= 1000;
}
break;

        default:
Benar = false;
break;
}

    // IF 2: Validasi jenis kendaraan
if (!Benar) {
console.log("Jenis kendaraan salah!");
return null;
}

    // Menghitung total biaya sebelum diskon
let Total: number = Jam * Tarif;
let Diskon: number = 0;
let NamaMember: string = "";

    // SWITCH 2: Menentukan diskon berdasarkan member
switch (Member) {
case "1":
NamaMember = "Reguler";
break;

        case "2":
NamaMember = "Silver";
Diskon = 10;
break;

        case "3":
NamaMember = "Gold";
Diskon = 20;

            // NESTED 2: Bonus diskon Gold jika parkir lebih dari 5 jam
if (Jam > 5 && Total > 20000) {
Diskon += 5;
}
break;

        default:
NamaMember = "Reguler";
Diskon = 0;
break;
}

    // Mengurangi total biaya berdasarkan diskon
Total -= Total * Diskon / 100;

    // IF 3: Menambahkan denda jika karcis hilang
if (KarcisHilang) {
Total += Denda;
}

    // IF 4: Menentukan kategori biaya parkir
let Kategori: string = "";

    if (Total === 0) {
Kategori = "Gratis";
} else if (Total < 20000) {
Kategori = "Ringan";
} else {
Kategori = "Besar";
}

    // Mengembalikan hasil perhitungan ke dalam bentuk data
return {
id: 0,
Jenis: NamaKendaraan,
Jam: Jam,
Member: NamaMember,
KarcisHilang: KarcisHilang,
Tarif: Tarif,
Diskon: Diskon,
Total: Total,
Kategori: Kategori
};
}

// Fungsi untuk menerima data parkir baru
async function Create(): Promise<void> {
console.log("\n====== TAMBAH DATA PARKIR ======");

    console.log("Jenis kendaraan:");
console.log("1. Motor");
console.log("2. Mobil");
console.log("3. Truk");

    let Jenis: string = await tanya("Pilih kendaraan: ");

    let Jam: number = await InputAngka("Lama parkir (0-24 jam): ");

    console.log("\nJenis member:");
console.log("1. Reguler");
console.log("2. Silver");
console.log("3. Gold");

    let Member: string = await tanya("Pilih member: ");

    let JawabanKarcis: string = await tanya("Karcis hilang? (y/n): ");

    // Memastikan input karcis hanya y atau n
while (
JawabanKarcis.toLowerCase() !== "y" &&
JawabanKarcis.toLowerCase() !== "n"
) {
console.log("Input harus y atau n!");
JawabanKarcis = await tanya("Karcis hilang? (y/n): ");
}

    let KarcisHilang: boolean = JawabanKarcis.toLowerCase() === "y";

    // Menghitung biaya parkir
let Hasil = Hitung(Jenis, Jam, Member, KarcisHilang);

    // Jika data tidak valid, data tidak disimpan
if (Hasil === null) {
return;
}

    // Memberikan ID unik kepada data parkir
Hasil.id = IDBerikutnya++;

    // Menambahkan data ke dalam array
Data.push(Hasil);

    console.log("\nData parkir berhasil ditambahkan!");
TampilkanDetail(Hasil);
}

// Fungsi untuk menampilkan seluruh data parkir
function Read(): void {
console.log("\n====== SELURUH DATA PARKIR ======");

    // Memeriksa apakah data masih kosong
if (Data.length === 0) {
console.log("Belum ada data parkir!");
return;
}

    // Menampilkan seluruh data dalam format tabel sederhana
console.log("ID | Kendaraan | Jam | Member | Total | Kategori");
console.log("-----------------------------------------------");

    for (let Item of Data) {
console.log(
Item.id + " | " +
Item.Jenis + " | " +
Item.Jam + " | " +
Item.Member + " | Rp " +
Item.Total + " | " +
Item.Kategori
);
}
}

// Fungsi untuk menampilkan detail satu data
function TampilkanDetail(Item: DataParkir): void {
console.log("\n====== DETAIL PARKIR ======");
console.log("ID             : " + Item.id);
console.log("Kendaraan      : " + Item.Jenis);
console.log("Lama parkir    : " + Item.Jam + " jam");
console.log("Tarif per jam  : Rp " + Item.Tarif);
console.log("Member         : " + Item.Member);
console.log("Diskon         : " + Item.Diskon + "%");
console.log("Karcis hilang  : " + (Item.KarcisHilang ? "Ya" : "Tidak"));
console.log("Total biaya    : Rp " + Item.Total);
console.log("Kategori       : " + Item.Kategori);
}

// Fungsi untuk mencari data berdasarkan ID
function CariID(ID: number): number {
return Data.findIndex((Item) => Item.id === ID);
}

// Fitur Read Detail berdasarkan ID
async function DetailID(): Promise<void> {
console.log("\n====== DETAIL DATA PARKIR ======");

    let ID: number = await InputAngka("Masukkan ID parkir: ");
let Index: number = CariID(ID);

    if (Index === -1) {
console.log("Data parkir dengan ID tersebut tidak ditemukan!");
} else {
TampilkanDetail(Data[Index]!);
}
}

// Fitur Update data parkir berdasarkan ID
async function Update(): Promise<void> {
console.log("\n====== UPDATE DATA PARKIR ======");

    let ID: number = await InputAngka("Masukkan ID yang ingin diubah: ");
let Index: number = CariID(ID);

    // Memeriksa apakah ID ditemukan
if (Index === -1) {
console.log("Data parkir tidak ditemukan!");
return;
}

    console.log("\nData lama:");
    TampilkanDetail(Data[Index]!);

    console.log("\nMasukkan data baru:");

    console.log("Jenis kendaraan:");
console.log("1. Motor");
console.log("2. Mobil");
console.log("3. Truk");

    let Jenis: string = await tanya("Pilih kendaraan: ");
let Jam: number = await InputAngka("Lama parkir (0-24 jam): ");

    console.log("\nJenis member:");
console.log("1. Reguler");
console.log("2. Silver");
console.log("3. Gold");

    let Member: string = await tanya("Pilih member: ");
let JawabanKarcis: string = await tanya("Karcis hilang? (y/n): ");

    // Validasi input karcis
while (
JawabanKarcis.toLowerCase() !== "y" &&
JawabanKarcis.toLowerCase() !== "n"
) {
console.log("Input harus y atau n!");
JawabanKarcis = await tanya("Karcis hilang? (y/n): ");
}

    let KarcisHilang: boolean = JawabanKarcis.toLowerCase() === "y";

    // Menghitung ulang data yang telah diperbarui
let Hasil = Hitung(Jenis, Jam, Member, KarcisHilang);

    // Data lama tidak diganti jika data baru tidak valid
if (Hasil === null) {
console.log("Update dibatalkan karena input tidak valid.");
return;
}

    // ID tetap menggunakan ID lama
Hasil.id = ID;

    // Mengganti data lama dengan data baru
Data[Index] = Hasil;

    console.log("\nData berhasil diperbarui!");
TampilkanDetail(Data[Index]);
}

// Fitur Delete data berdasarkan ID dengan konfirmasi
async function Delete(): Promise<void> {
console.log("\n====== DELETE DATA PARKIR ======");

    let ID: number = await InputAngka("Masukkan ID yang ingin dihapus: ");
let Index: number = CariID(ID);

    // Memeriksa apakah data ditemukan
if (Index === -1) {
console.log("Data parkir tidak ditemukan!");
return;
}

    // Menampilkan data yang akan dihapus
const DataDihapus = Data[Index];
if (DataDihapus === undefined) {
console.log("Data parkir tidak ditemukan!");
return;
}
TampilkanDetail(DataDihapus);

    let Konfirmasi: string = await tanya("Yakin ingin menghapus data? (y/n): ");

    // Memeriksa konfirmasi pengguna
if (Konfirmasi.toLowerCase() === "y") {
Data.splice(Index, 1);
console.log("Data berhasil dihapus!");
} else {
console.log("Penghapusan dibatalkan.");
}
}

// Fitur Search berdasarkan kata kunci dan filter tambahan
async function Search(): Promise<void> {
console.log("\n====== SEARCH DATA PARKIR ======");

    // Memeriksa apakah data tersedia
if (Data.length === 0) {
console.log("Belum ada data parkir!");
return;
}

    let KataKunci: string = (await tanya("Masukkan kata kunci: ")).toLowerCase();

    // Pencarian tidak membedakan huruf besar dan kecil
let Hasil: DataParkir[] = Data.filter((Item) =>
Item.id.toString().includes(KataKunci) ||
Item.Jenis.toLowerCase().includes(KataKunci) ||
Item.Member.toLowerCase().includes(KataKunci) ||
Item.Kategori.toLowerCase().includes(KataKunci)
);

    // Menampilkan hasil pencarian kata kunci
if (Hasil.length === 0) {
console.log("Data tidak ditemukan!");
return;
}

    console.log("\nHasil pencarian kata kunci:");
for (let Item of Hasil) {
console.log(
"ID: " + Item.id +
" | Kendaraan: " + Item.Jenis +
" | Member: " + Item.Member +
" | Total: Rp " + Item.Total
);
}

    // Filter tambahan berdasarkan kategori kendaraan, member, atau kategori biaya
console.log("\nFilter tambahan:");
console.log("1. Kendaraan");
console.log("2. Member");
console.log("3. Kategori biaya");
console.log("4. Tidak menggunakan filter");

    let PilihanFilter: string = await tanya("Pilih filter: ");
let NilaiFilter: string = "";

    if (PilihanFilter !== "4") {
NilaiFilter = (await tanya("Masukkan nilai filter: ")).toLowerCase();
}

    let DataFilter: DataParkir[] = Hasil.filter((Item) => {
switch (PilihanFilter) {
case "1":
return Item.Jenis.toLowerCase().includes(NilaiFilter);

            case "2":
return Item.Member.toLowerCase().includes(NilaiFilter);

            case "3":
return Item.Kategori.toLowerCase().includes(NilaiFilter);

            default:
return true;
}
});

    // Menampilkan hasil setelah filter diterapkan
console.log("\n====== HASIL FILTER ======");

    if (DataFilter.length === 0) {
console.log("Tidak ada data yang sesuai dengan filter!");
} else {
for (let Item of DataFilter) {
TampilkanDetail(Item);
}
}
}

// Fungsi menu utama program
async function MenuUtama(): Promise<void> {
let Pilihan: string = "";

    // Menu akan terus berulang sampai pengguna memilih keluar
do {
console.log("\n================================");
console.log("   SISTEM DATA PARKIR");
console.log("================================");
console.log("1. Create (Tambah data)");
console.log("2. Read (Tampilkan seluruh data)");
console.log("3. Detail (Cari berdasarkan ID)");
console.log("4. Update (Ubah data)");
console.log("5. Delete (Hapus data)");
console.log("6. Search (Cari data)");
console.log("7. Keluar");
console.log("================================");

        Pilihan = await tanya("Pilih menu: ");

        // SWITCH tambahan untuk mengatur menu utama
switch (Pilihan) {
case "1":
await Create();
break;

            case "2":
Read();
break;

            case "3":
await DetailID();
break;

            case "4":
await Update();
break;

            case "5":
await Delete();
break;

            case "6":
await Search();
break;

            case "7":
console.log("Terima kasih telah menggunakan program parkir!");
break;

            default:
console.log("Menu tidak valid! Silakan pilih menu 1-7.");
break;
}

    } while (Pilihan !== "7");

    // Menutup interface setelah pengguna keluar
r1.close();
}

// Menjalankan program
MenuUtama();