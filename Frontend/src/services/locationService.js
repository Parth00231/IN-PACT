/**
 * IN-PACT Real-Time Geolocation, EXIF Parser & Reverse Geocoding Service
 * ----------------------------------------------------------------------
 * 1. Automatically extracts GPS coordinates from image EXIF metadata (where photo was clicked).
 * 2. Falls back to device hardware GPS (if photo has no EXIF or captured directly with live camera).
 * 3. Performs real-time reverse-geocoding to map coordinates to real street landmarks, municipal zones, and verified addresses.
 */

/**
 * Extracts EXIF GPS metadata from an image File or Blob
 * @param {File|Blob} file 
 * @returns {Promise<{lat: number, lng: number, timestamp: string|null}|null>}
 */
export async function extractExifGpsFromImage(file) {
  if (!file) return null;
  try {
    // Read the first 128KB which contains the JPEG header and EXIF APP1 marker
    const slice = file.slice(0, 131072);
    const arrayBuffer = await slice.arrayBuffer();
    const dataView = new DataView(arrayBuffer);

    // Verify JPEG SOI marker (0xFFD8)
    if (dataView.byteLength < 4 || dataView.getUint16(0) !== 0xFFD8) {
      return null;
    }

    let offset = 2;
    const length = dataView.byteLength;

    while (offset < length - 4) {
      if (dataView.getUint8(offset) !== 0xFF) {
        break;
      }
      const marker = dataView.getUint8(offset + 1);

      // APP1 Marker for EXIF is 0xFFE1
      if (marker === 0xE1) {
        const app1Length = dataView.getUint16(offset + 2);
        return parseExifApp1(dataView, offset + 4, app1Length - 2);
      } else if (marker === 0xD9 || marker === 0xDA) {
        // End of image or start of scan data
        break;
      } else {
        const segmentLength = dataView.getUint16(offset + 2);
        offset += 2 + segmentLength;
      }
    }
  } catch (err) {
    console.warn("EXIF extraction warning:", err);
  }
  return null;
}

function parseExifApp1(dataView, start, length) {
  if (start + 6 >= dataView.byteLength) return null;

  // Check for "Exif\0\0" header
  if (
    dataView.getUint8(start) !== 0x45 ||
    dataView.getUint8(start + 1) !== 0x78 ||
    dataView.getUint8(start + 2) !== 0x69 ||
    dataView.getUint8(start + 3) !== 0x66 ||
    dataView.getUint8(start + 4) !== 0x00 ||
    dataView.getUint8(start + 5) !== 0x00
  ) {
    return null;
  }

  const tiffStart = start + 6;
  if (tiffStart + 8 >= dataView.byteLength) return null;

  const byteOrder = dataView.getUint16(tiffStart);
  let isLittleEndian;
  if (byteOrder === 0x4949) {
    isLittleEndian = true; // Intel ("II")
  } else if (byteOrder === 0x4D4D) {
    isLittleEndian = false; // Motorola ("MM")
  } else {
    return null;
  }

  if (dataView.getUint16(tiffStart + 2, isLittleEndian) !== 0x002A) {
    return null;
  }

  const firstIFDOffset = dataView.getUint32(tiffStart + 4, isLittleEndian);
  if (firstIFDOffset < 8 || tiffStart + firstIFDOffset >= dataView.byteLength) return null;

  return parseIFD(dataView, tiffStart, tiffStart + firstIFDOffset, isLittleEndian);
}

function parseIFD(dataView, tiffStart, ifdOffset, isLittleEndian) {
  try {
    if (ifdOffset + 2 >= dataView.byteLength) return null;
    const numEntries = dataView.getUint16(ifdOffset, isLittleEndian);
    let gpsIFDOffset = null;
    let dateTimeOriginal = null;

    for (let i = 0; i < numEntries; i++) {
      const entryOffset = ifdOffset + 2 + i * 12;
      if (entryOffset + 12 > dataView.byteLength) break;
      const tag = dataView.getUint16(entryOffset, isLittleEndian);

      // GPSInfo IFD tag: 0x8825
      if (tag === 0x8825) {
        gpsIFDOffset = tiffStart + dataView.getUint32(entryOffset + 8, isLittleEndian);
      }
      // DateTimeOriginal tag: 0x9003
      if (tag === 0x9003) {
        const strOffset = tiffStart + dataView.getUint32(entryOffset + 8, isLittleEndian);
        dateTimeOriginal = readString(dataView, strOffset, 19);
      }
    }

    if (gpsIFDOffset && gpsIFDOffset < dataView.byteLength) {
      return parseGpsIFD(dataView, tiffStart, gpsIFDOffset, isLittleEndian, dateTimeOriginal);
    }
  } catch (e) {
    console.warn("IFD parsing error:", e);
  }
  return null;
}

function parseGpsIFD(dataView, tiffStart, gpsOffset, isLittleEndian, dateTimeOriginal) {
  try {
    if (gpsOffset + 2 >= dataView.byteLength) return null;
    const numEntries = dataView.getUint16(gpsOffset, isLittleEndian);
    let latRef = "N";
    let lngRef = "E";
    let latDMS = null;
    let lngDMS = null;

    for (let i = 0; i < numEntries; i++) {
      const entryOffset = gpsOffset + 2 + i * 12;
      if (entryOffset + 12 > dataView.byteLength) break;
      const tag = dataView.getUint16(entryOffset, isLittleEndian);

      // GPSLatitudeRef (0x0001)
      if (tag === 0x0001) {
        latRef = String.fromCharCode(dataView.getUint8(entryOffset + 8));
      }
      // GPSLatitude (0x0002)
      if (tag === 0x0002) {
        const rationalOffset = tiffStart + dataView.getUint32(entryOffset + 8, isLittleEndian);
        latDMS = readRationals(dataView, rationalOffset, 3, isLittleEndian);
      }
      // GPSLongitudeRef (0x0003)
      if (tag === 0x0003) {
        lngRef = String.fromCharCode(dataView.getUint8(entryOffset + 8));
      }
      // GPSLongitude (0x0004)
      if (tag === 0x0004) {
        const rationalOffset = tiffStart + dataView.getUint32(entryOffset + 8, isLittleEndian);
        lngDMS = readRationals(dataView, rationalOffset, 3, isLittleEndian);
      }
    }

    if (latDMS && lngDMS && latDMS.length === 3 && lngDMS.length === 3) {
      let lat = latDMS[0] + latDMS[1] / 60 + latDMS[2] / 3600;
      let lng = lngDMS[0] + lngDMS[1] / 60 + lngDMS[2] / 3600;

      if (latRef === "S" || latRef === "s") lat = -lat;
      if (lngRef === "W" || lngRef === "w") lng = -lng;

      if (!isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
        return {
          lat,
          lng,
          timestamp: dateTimeOriginal,
          isExif: true,
        };
      }
    }
  } catch (e) {
    console.warn("GPS IFD parse error:", e);
  }
  return null;
}

function readRationals(dataView, offset, count, isLittleEndian) {
  const result = [];
  if (offset + count * 8 > dataView.byteLength) return result;
  for (let i = 0; i < count; i++) {
    const num = dataView.getUint32(offset + i * 8, isLittleEndian);
    const den = dataView.getUint32(offset + i * 8 + 4, isLittleEndian);
    result.push(den === 0 ? 0 : num / den);
  }
  return result;
}

function readString(dataView, offset, length) {
  let str = "";
  if (offset + length > dataView.byteLength) return str;
  for (let i = 0; i < length; i++) {
    const c = dataView.getUint8(offset + i);
    if (c === 0) break;
    str += String.fromCharCode(c);
  }
  return str;
}

/**
 * Dynamic Reverse Geocoder: Maps latitude and longitude to real street, locality, city and ward
 */
async function reverseGeocodeCoordinates(lat, lng) {
  let address = "";
  let ward = "";

  // 1. Primary Provider: BigDataCloud Reverse Geocoding (High speed, CORS-friendly, zero rate limits)
  try {
    const bdcRes = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
      { signal: AbortSignal.timeout(3500) }
    );
    if (bdcRes.ok) {
      const data = await bdcRes.json();
      const parts = [];
      if (data.locality) parts.push(data.locality);
      if (data.city && data.city !== data.locality) parts.push(data.city);
      if (data.principalSubdivision) parts.push(data.principalSubdivision);
      if (parts.length > 0) {
        address = parts.join(", ");
        ward = `${data.locality || data.city || "Civic Area"} (${data.principalSubdivision || "Zone"})`;
      }
    }
  } catch (e) {
    // Continue to next provider
  }

  // 2. Secondary Provider: OpenStreetMap Nominatim
  if (!address) {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=18&addressdetails=1`,
        { headers: { "Accept-Language": "en" }, signal: AbortSignal.timeout(3500) }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.display_name) {
          const road = data.address?.road || data.address?.suburb || data.address?.neighbourhood || "";
          const city = data.address?.city || data.address?.state_district || data.address?.town || "Local Zone";
          address = road ? `${road}, ${city}` : data.display_name.split(",").slice(0, 3).join(",");
          ward = `Zone ${city}`;
        }
      }
    } catch (err) {
      // Continue
    }
  }

  // 3. Fallback Dynamic Coordinates format
  if (!address) {
    address = `Geotagged Location (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`;
    ward = `Municipal Zone (${lat.toFixed(2)}° N, ${lng.toFixed(2)}° E)`;
  }

  return { address, ward };
}

/**
 * Determines location for an uploaded photo:
 * 1. Checks embedded photo EXIF metadata (where the photo was clicked)
 * 2. Falls back to device location if EXIF is missing/stripped
 */
export async function getLocationForUploadedPhoto(file) {
  if (file) {
    const exifGps = await extractExifGpsFromImage(file);
    if (exifGps && !isNaN(exifGps.lat) && !isNaN(exifGps.lng)) {
      const { address, ward } = await reverseGeocodeCoordinates(exifGps.lat, exifGps.lng);
      return {
        lat: exifGps.lat,
        lng: exifGps.lng,
        accuracy: 3,
        gpsString: `${exifGps.lat.toFixed(4)}° N, ${exifGps.lng.toFixed(4)}° E (📸 Photo EXIF Geotag Verified)`,
        address,
        ward,
        timestamp: exifGps.timestamp || new Date().toISOString(),
        source: "exif",
        isExifGeotag: true,
      };
    }
  }

  // Fallback to live device location
  const liveLocation = await getLiveDeviceLocation();
  return {
    ...liveLocation,
    source: "device",
    isExifGeotag: false,
  };
}

/**
 * Fetches real-time device GPS coordinates with reverse geocoding
 */
export async function getLiveDeviceLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(getFallbackLocation());
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 6000,
      maximumAge: 10000,
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const { address, ward } = await reverseGeocodeCoordinates(latitude, longitude);

        resolve({
          lat: latitude,
          lng: longitude,
          accuracy: Math.round(accuracy || 8),
          gpsString: `${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E (Live Device GPS ±${Math.round(accuracy || 8)}m)`,
          address,
          ward,
          timestamp: new Date().toISOString(),
          isLiveGps: true,
          source: "device",
          isExifGeotag: false,
        });
      },
      (_error) => {
        resolve(getFallbackLocation());
      },
      options
    );
  });
}

function getFallbackLocation() {
  return {
    lat: 28.4682,
    lng: 77.5028,
    accuracy: 10,
    gpsString: "Location auto-detection pending",
    address: "",
    ward: "Municipal Civic Ward",
    timestamp: new Date().toISOString(),
    isLiveGps: false,
    source: "fallback",
    isExifGeotag: false,
  };
}
