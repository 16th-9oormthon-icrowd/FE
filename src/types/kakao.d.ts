declare global {
  interface Window {
    kakao: {
      maps: {
        LatLng: new (
          lat: number,
          lng: number,
        ) => {
          getLat: () => number;
          getLng: () => number;
        };
        LatLngBounds: new (
          sw: unknown,
          ne: unknown,
        ) => {
          contain: (latlng: unknown) => boolean;
        };
        Map: new (container: HTMLElement, options: unknown) => unknown;
        Marker: new (options: unknown) => {
          setMap: (map: unknown) => void;
        };
        InfoWindow: new (options: unknown) => {
          open: (map: unknown, marker: unknown) => void;
          close: () => void;
        };
        event: {
          addListener: (
            target: unknown,
            type: string,
            callback: (mouseEvent: unknown) => void,
          ) => void;
        };
        load: (callback: () => void) => void;
        services: {
          Geocoder: new () => {
            coord2Address: (
              lng: number,
              lat: number,
              callback: (result: unknown[], status: string) => void,
            ) => void;
            addressSearch: (
              address: string,
              callback: (result: unknown[], status: string) => void,
            ) => void;
          };
          Places: new (map?: unknown) => {
            keywordSearch: (
              keyword: string,
              callback: (result: unknown[], status: string, pagination: unknown) => void,
              options?: { location?: unknown; radius?: number },
            ) => void;
          };
          Status: {
            OK: string;
            ZERO_RESULT: string;
            ERROR: string;
          };
        };
      };
    };
  }
}

export {};
