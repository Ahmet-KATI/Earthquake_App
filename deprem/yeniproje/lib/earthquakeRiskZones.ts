// Türkiye İlleri Deprem Risk Dereceleri
// Kaynak: AFAD 2018 Tehlike Haritası ve DASK Risk Grupları

export type RiskDegree = 1 | 2 | 3 | 4 | 5;

export interface ProvinceRiskData {
    provinceId: number; // GeoJSON'daki il ID'si
    provinceName: string;
    riskDegree: RiskDegree;
    color: string;
    opacity: number;
    description: string;
}

// Risk derecelerine göre renkler
export const RISK_COLORS = {
    1: "#DC2626", // Kırmızı - En yüksek risk
    2: "#FB923C", // Turuncu - Yüksek risk
    3: "#FDE047", // Sarı - Orta risk
    4: "#FEF9C3", // Açık Sarı - Düşük-orta risk
    5: "#D1FAE5", // Açık Yeşil - En düşük risk
} as const;

export const RISK_LABELS = {
    1: "1. Derece - En Yüksek Risk",
    2: "2. Derece - Yüksek Risk",
    3: "3. Derece - Orta Risk",
    4: "4. Derece - Düşük-Orta Risk",
    5: "5. Derece - En Düşük Risk",
} as const;

// 81 il için risk sınıflandırması (AFAD/DASK verileri)
export const PROVINCE_RISK_MAPPING: Record<number, RiskDegree> = {
    1: 2,  // Adana - 2. Derece
    2: 2,  // Adıyaman - 2. Derece
    3: 1,  // Afyon - 1. Derece
    4: 3,  // Ağrı - 3. Derece
    5: 1,  // Aksaray - 1. Derece
    6: 3,  // Amasya - 3. Derece
    7: 2,  // Ankara - 2. Derece
    8: 3,  // Antalya - 3. Derece
    9: 5,  // Ardahan - 5. Derece
    10: 5, // Artvin - 5. Derece
    11: 1,  // Aydın - 1. Derece
    12: 1,  // Balıkesir - 1. Derece
    13: 5,  // Bartın - 5. Derece
    14: 2,  // Batman - 2. Derece
    15: 5,  // Bayburt - 5. Derece
    16: 2,  // Bilecik - 2. Derece
    17: 1,  // Bingöl - 1. Derece
    18: 2,  // Bitlis - 2. Derece
    19: 1,  // Bolu - 1. Derece
    20: 1,  // Burdur - 1. Derece
    21: 1,  // Bursa - 1. Derece
    22: 2,  // Çanakkale - 2. Derece
    23: 3,  // Çankırı - 3. Derece
    24: 3,  // Çorum - 3. Derece
    25: 1,  // Denizli - 1. Derece
    26: 2,  // Diyarbakır - 2. Derece
    27: 1,  // Düzce - 1. Derece
    28: 2,  // Edirne - 2. Derece
    29: 1,  // Elazığ - 1. Derece
    30: 1,  // Erzincan - 1. Derece
    31: 1,  // Erzurum - 1. Derece
    32: 3,  // Eskişehir - 3. Derece
    33: 3,  // Gaziantep - 3. Derece
    34: 5,  // Giresun - 5. Derece
    35: 5,  // Gümüşhane - 5. Derece
    36: 2,  // Hakkari - 2. Derece
    37: 1,  // Hatay - 1. Derece
    38: 4,  // Iğdır - 4. Derece
    39: 1,  // Isparta - 1. Derece
    40: 1,  // İstanbul - 1. Derece
    41: 1,  // İzmir - 1. Derece
    42: 1,  // Kahramanmaraş - 1. Derece
    43: 3,  // Karabük - 3. Derece
    44: 4,  // Karaman - 4. Derece
    45: 4,  // Kars - 4. Derece
    46: 3,  // Kastamonu - 3. Derece
    47: 3,  // Kayseri - 3. Derece
    48: 3,  // Kilis - 3. Derece
    49: 3,  // Kırıkkale - 3. Derece
    50: 2,  // Kırklareli - 2. Derece
    51: 3,  // Kırşehir - 3. Derece
    52: 1,  // Kocaeli - 1. Derece
    53: 3,  // Konya - 3. Derece
    54: 1,  // Kütahya - 1. Derece
    55: 2,  // Malatya - 2. Derece
    56: 1,  // Manisa - 1. Derece
    57: 3,  // Mardin - 3. Derece
    58: 4,  // Mersin - 4. Derece
    59: 1,  // Muğla - 1. Derece
    60: 3,  // Muş - 3. Derece
    61: 3,  // Nevşehir - 3. Derece
    62: 3,  // Niğde - 3. Derece
    63: 4,  // Ordu - 4. Derece
    64: 1,  // Osmaniye - 1. Derece
    65: 5,  // Rize - 5. Derece
    66: 1,  // Sakarya - 1. Derece
    67: 4,  // Samsun - 4. Derece
    68: 2,  // Siirt - 2. Derece
    69: 5,  // Sinop - 5. Derece
    70: 3,  // Sivas - 3. Derece
    71: 4,  // Şanlıurfa - 4. Derece
    72: 2,  // Şırnak - 2. Derece
    73: 2,  // Tekirdağ - 2. Derece
    74: 1,  // Tokat - 1. Derece
    75: 5,  // Trabzon - 5. Derece
    76: 1,  // Tunceli - 1. Derece
    77: 2,  // Uşak - 2. Derece
    78: 1,  // Van - 1. Derece
    79: 1,  // Yalova - 1. Derece
    80: 3,  // Yozgat - 3. Derece
    81: 3,  // Zonguldak - 3. Derece
};

// Türkiye GeoJSON URL'i
export const TURKEY_GEOJSON_URL = "https://raw.githubusercontent.com/cihadturhan/tr-geojson/master/geo/tr-cities-utf8.json";

// Helper fonksiyonlar
export function getRiskColor(riskDegree: RiskDegree): string {
    return RISK_COLORS[riskDegree];
}

export function getRiskLabel(riskDegree: RiskDegree): string {
    return RISK_LABELS[riskDegree];
}

export function getProvinceRisk(provinceId: number): RiskDegree {
    return PROVINCE_RISK_MAPPING[provinceId] || 3; // Varsayılan: orta risk
}
