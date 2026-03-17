export const CONFIG = {
  // Geri sayımın biteceği hedef tarih (YYYY-MM-DD formatında)
  TARGET_DATE: '2026-08-31',
  // Takvimin başlangıç tarihi
  START_DATE: '2026-03-13',
  // Rastgele gelecek YouTube video ID'leri
  VIDEOS: [
    'K9s8gG_4ijs', 'SpkPumbVtes', 'fGGSAx_I3Tg', '9qGt-lp-sVc', 'BbyiT2WGqWY',
    'PWirijQkH4M', 'DK1nYjV6VMk', 'HQ6ym0__PYo', 'Bz4O076E9q4', 'vfHPb5MpmRs',
    'OBxBxkFA2GY', 'Uhh5TI4e_Bc', 'r5vR1Avjtnc', 'KqkCp_1uEQg', 'OsJd5D4ZMNU',
    'UTTlKNH2TPM', 'Gd-T5MWzmmA', 'ZJ_4Q1z3ky0', 'S1iwz6gZT88', '1VGp3Gn4fCw',
    '1cfsOmwxlP0', 'PxotJ7Qryc4', 'DpqB9k0xAwQ', 'p7i3ig2v8MM', '4d10oGNb01Y',
    'p8As-SAd7-s', 'jWKT8x9V0DY', 'k1viHxdHSGQ', 'vY_xrLJAPtM', '7WYp5x_0IPI',
    's405zXvszTE', 'IbypvKrWhaI', '25th_C1q8x0', 'XVDAFGlcxOM', 'Y9AXKgqGwN4'
  ],
  // Yanlış cevapta bekleme süresi (milisaniye cinsinden, 2.5 dakika = 150000)
  COOLDOWN_MS: 2.5 * 60 * 1000,
};

// Resmi tatiller (MM-DD formatında)
export const HOLIDAYS = [
  '01-01', // Yılbaşı
  '04-23', // Ulusal Egemenlik ve Çocuk Bayramı
  '05-01', // Emek ve Dayanışma Günü
  '05-19', // Atatürk'ü Anma, Gençlik ve Spor Bayramı
  '07-15', // Demokrasi ve Milli Birlik Günü
  '08-30', // Zafer Bayramı
  '10-29', // Cumhuriyet Bayramı
  // 2026 Ramazan Bayramı (Yaklaşık: 20-22 Mart)
  '03-20', '03-21', '03-22',
  // 2026 Kurban Bayramı (Yaklaşık: 27-30 Mayıs)
  '05-27', '05-28', '05-29', '05-30'
];

// Ruh hali seçenekleri
export const MOODS = [
  { id: 'happy', label: 'Mutlu', emoji: '😊', color: '#ef4444' },
  { id: 'sad', label: 'Üzgün', emoji: '😢', color: '#3b82f6' },
  { id: 'stressed', label: 'Stresli', emoji: '😫', color: '#6b7280' },
  { id: 'excited', label: 'Heyecanlı', emoji: '🤩', color: '#f59e0b' },
  { id: 'tired', label: 'Yorgun', emoji: '😴', color: '#8b5cf6' },
  { id: 'energetic', label: 'Enerjik', emoji: '⚡', color: '#eab308' },
  { id: 'calm', label: 'Sakin', emoji: '😌', color: '#10b981' },
  { id: 'angry', label: 'Kızgın', emoji: '😡', color: '#b91c1c' },
  { id: 'surprised', label: 'Şaşkın', emoji: '😲', color: '#06b6d4' },
  { id: 'sick', label: 'Hasta', emoji: '🤒', color: '#84cc16' },
  { id: 'inlove', label: 'Aşık', emoji: '😍', color: '#ec4899' },
];
