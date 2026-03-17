export const QUESTION_POOL = [
  { q: "Türkiye'nin başkenti neresidir?", options: ["İstanbul", "Ankara", "İzmir", "Bursa"], a: "Ankara" },
  { q: "Hangi gezegen Güneş Sistemi'ndeki en büyük gezegendir?", options: ["Mars", "Dünya", "Jüpiter", "Satürn"], a: "Jüpiter" },
  { q: "İstiklal Marşı'nın şairi kimdir?", options: ["Mehmet Akif Ersoy", "Necip Fazıl Kısakürek", "Nazım Hikmet", "Cemal Süreya"], a: "Mehmet Akif Ersoy" },
  { q: "Hangi elementin kimyasal sembolü 'O' harfidir?", options: ["Altın", "Oksijen", "Osmiyum", "Oganesson"], a: "Oksijen" },
  { q: "Dünyanın en uzun nehri hangisidir?", options: ["Amazon", "Nil", "Yangtze", "Mississippi"], a: "Nil" },
  { q: "Hangi yıl Türkiye Cumhuriyeti ilan edilmiştir?", options: ["1920", "1921", "1922", "1923"], a: "1923" },
  { q: "Mona Lisa tablosu hangi ressama aittir?", options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"], a: "Leonardo da Vinci" },
  { q: "Hangi hayvan karada yaşayan en hızlı hayvandır?", options: ["Aslan", "Çita", "Kaplan", "Leopar"], a: "Çita" },
  { q: "Gökyüzü neden mavidir?", options: ["Okyanusların yansıması", "Rayleigh saçılımı", "Ozon tabakası", "Güneşin rengi"], a: "Rayleigh saçılımı" },
  { q: "Hangi kıta en fazla ülkeye sahiptir?", options: ["Asya", "Avrupa", "Afrika", "Güney Amerika"], a: "Afrika" },
  { q: "İlk bilgisayar programcısı kim olarak kabul edilir?", options: ["Alan Turing", "Ada Lovelace", "Charles Babbage", "Bill Gates"], a: "Ada Lovelace" },
  { q: "Hangi gezegen 'Kızıl Gezegen' olarak bilinir?", options: ["Venüs", "Mars", "Jüpiter", "Uranüs"], a: "Mars" },
  { q: "İnsan vücudundaki en büyük organ hangisidir?", options: ["Kalp", "Karaciğer", "Deri", "Akciğer"], a: "Deri" },
  { q: "Hangi element periyodik tablonun ilk elementidir?", options: ["Helyum", "Oksijen", "Hidrojen", "Karbon"], a: "Hidrojen" },
  { q: "Dünyanın en yüksek dağı hangisidir?", options: ["K2", "Kangchenjunga", "Everest", "Makalu"], a: "Everest" },
  { q: "Hangi okyanus dünyanın en büyük okyanusudur?", options: ["Atlantik", "Hint", "Pasifik", "Arktik"], a: "Pasifik" },
  { q: "Hangi ülke 'Güneşin Doğduğu Ülke' olarak bilinir?", options: ["Çin", "Güney Kore", "Japonya", "Vietnam"], a: "Japonya" },
  { q: "Hangi icat Alexander Graham Bell'e aittir?", options: ["Televizyon", "Radyo", "Telefon", "Telgraf"], a: "Telefon" },
  { q: "Hangi renk ana renklerden biri değildir?", options: ["Kırmızı", "Mavi", "Sarı", "Yeşil"], a: "Yeşil" },
  { q: "Hangi gezegenin halkaları vardır?", options: ["Mars", "Venüs", "Satürn", "Merkür"], a: "Satürn" },
  { q: "Türkiye'nin en yüksek dağı hangisidir?", options: ["Erciyes", "Süphan", "Ağrı", "Kaçkar"], a: "Ağrı" },
  { q: "Hangi yazar 'Suç ve Ceza' romanının yazarıdır?", options: ["Tolstoy", "Dostoyevski", "Gogol", "Çehov"], a: "Dostoyevski" },
  { q: "Hangi elementin sembolü 'Fe' dir?", options: ["Fosfor", "Flor", "Demir", "Fransiyum"], a: "Demir" },
  { q: "Hangi şehir iki kıta üzerinde yer alır?", options: ["Londra", "İstanbul", "Moskova", "Kahire"], a: "İstanbul" },
  { q: "Hangi gezegen Güneş'e en yakındır?", options: ["Venüs", "Mars", "Merkür", "Dünya"], a: "Merkür" }
];

export const getRandomQuestions = (count: number) => {
  const shuffled = [...QUESTION_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
