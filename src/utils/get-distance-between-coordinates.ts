export interface Coordinate {
  latitude: number;
  longitude: number;
}

export function getDistanceBetweenCoordinates(
  from: Coordinate,
  to: Coordinate,
): number {
  const toRadians = (deg: number) => (deg * Math.PI) / 180;

  const R = 6371; // Raio da Terra em km
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);
  const deltaLat = toRadians(to.latitude - from.latitude);
  const deltaLon = toRadians(to.longitude - from.longitude);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distância em km
}
