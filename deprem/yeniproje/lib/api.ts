
export interface Earthquake {
    id: string;
    date: string;
    time: string;
    latitude: number;
    longitude: number;
    depth: number;
    magnitude: number;
    location: string;
    provider: 'AFAD' | 'Kandilli' | 'USGS';
}

export async function getRecentEarthquakes(): Promise<Earthquake[]> {
    try {
        const response = await fetch('https://api.orhanaydogdu.com.tr/deprem/kandilli/live');
        if (!response.ok) {
            throw new Error('Failed to fetch earthquake data');
        }
        const data = await response.json();

        if (data.status && data.result) {
            return data.result.map((item: any) => ({
                id: item.earthquake_id,
                date: item.date_time.split(' ')[0],
                time: item.date_time.split(' ')[1],
                latitude: item.geojson.coordinates[1],
                longitude: item.geojson.coordinates[0],
                depth: item.depth,
                magnitude: item.mag,
                location: item.title,
                provider: 'Kandilli'
            }));
        }
        return [];
    } catch (error) {
        console.error("Error fetching earthquakes:", error);
        return [];
    }
}
