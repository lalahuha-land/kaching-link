export const PANTUN_RAYA: Array<[string, string]> = [
  ["Bunga melati harum mewangi,", "Selamat Hari Raya, duit raya menanti."],
  ["Pagi Syawal langit membiru,", "Moga rezeki melimpah selalu."],
  ["Kueh tart tersusun di atas dulang,", "Duit raya dikongsi, hati pun senang."],
  ["Anak bulan tinggi berseri,", "Semoga bahagia seisi keluarga hari ini."],
  ["Ketupat rendang di pagi raya,", "Tap to claim your duit raya."],
  ["Langkah pulang menziarah desa,", "Maaf dipinta, kasih sentiasa."],
  ["Lampu pelita berkelip terang,", "Semoga rezeki datang berulang."],
  ["Senyum mesra salam dihulur,", "Duit raya tiba, syukur tak luntur."],
  ["Baju baru warna zamrud,", "Moga hidup tenang, hati pun lembut."],
  ["Kuih bahulu manis rasanya,", "Selamat beraya, murah rezekinya."],
];

export function getPantunByIndex(index: number): [string, string] {
  return PANTUN_RAYA[index % PANTUN_RAYA.length] || PANTUN_RAYA[0];
}

export function pickRandomPantunIndex(): number {
  return Math.floor(Math.random() * PANTUN_RAYA.length);
}

export function fallbackPantunIndex(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return hash % PANTUN_RAYA.length;
}
