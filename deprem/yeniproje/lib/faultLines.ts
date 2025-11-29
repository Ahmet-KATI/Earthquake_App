// Türkiye'deki ana fay hatları (basitleştirilmiş koordinatlar)
// Kaynak: Genel hatlarıyla NAF ve EAF

export const turkeyFaultLines = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: {
        name: "Kuzey Anadolu Fay Hattı (NAF)",
        description: "Türkiye'nin en aktif fay hatlarından biri",
        type: "major",
      },
      geometry: {
        type: "LineString" as const,
        coordinates: [
          // Batıdan doğuya - İzmit Körfezi'nden başlayıp Erzincan'a kadar
          [29.92, 40.76], // İzmit Körfezi
          [30.32, 40.75], // Düzce
          [30.79, 40.84], // Bolu
          [31.45, 40.76], // Bayramören
          [32.86, 40.55], // Çerkeş
          [33.62, 40.50], // Ilgaz
          [34.79, 40.51], // Tosya
          [35.50, 40.58], // Merzifon
          [36.55, 40.63], // Niksar
          [37.97, 40.49], // Reşadiye
          [39.49, 39.75], // Erzincan
          [40.79, 39.65], // Horasan
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        name: "Doğu Anadolu Fay Hattı (EAF)",
        description: "Türkiye'nin önemli fay hatlarından biri",
        type: "major",
      },
      geometry: {
        type: "LineString" as const,
        coordinates: [
          // Karlıova'dan güneybatıya - İskenderun Körfezi'ne kadar
          [41.03, 39.30], // Karlıova
          [40.15, 39.20], // Bingöl
          [39.22, 38.88], // Palu
          [38.93, 38.68], // Elazığ
          [38.50, 38.42], // Pütürge
          [38.10, 38.18], // Doğanşehir
          [37.65, 38.00], // Gölbaşı
          [37.18, 37.77], // Malatya yakını
          [36.95, 37.58], // Nurhak
          [36.63, 37.48], // Gölbaşı (Adıyaman)
          [36.90, 37.25], // Göksun
          [37.12, 37.12], // Elbistan
          [36.82, 37.02], // Pazarcık
          [36.58, 36.85], // Nurdağı
          [36.37, 36.63], // İslahiye
          [36.25, 36.42], // Kırıkhan
          [36.18, 36.25], // Antakya
        ],
      },
    },
    {
      type: "Feature" as const,
      properties: {
        name: "Batı Anadolu Fay Sistemleri",
        description: "Ege bölgesindeki fay hatları",
        type: "secondary",
      },
      geometry: {
        type: "MultiLineString" as const,
        coordinates: [
          // Gediz Grabeni
          [
            [26.80, 38.45],
            [27.43, 38.62],
            [28.04, 38.70],
            [28.88, 38.75],
          ],
          // Büyük Menderes Grabeni
          [
            [27.25, 37.85],
            [27.85, 37.92],
            [28.36, 37.88],
            [28.88, 37.85],
          ],
        ],
      },
    },
  ],
};
