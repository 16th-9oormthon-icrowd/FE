import { useEffect, useRef, useCallback } from 'react';

export interface MarkerData {
  position: {
    lat: number;
    lng: number;
  };
  title: string;
  content: string;
  placeUrl?: string;
  phone?: string;
  address?: string;
}

interface KakaoMapOptions {
  center?: {
    lat: number;
    lng: number;
  };
  level?: number;
  markers?: MarkerData[];
}

export interface PlaceData {
  address: string;
  placeName?: string;
}

export const useKakaoMap = (options?: KakaoMapOptions) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<unknown>(null);
  const markersRef = useRef<unknown[]>([]);
  const infowindowsRef = useRef<unknown[]>([]);

  useEffect(() => {
    if (!mapContainer.current) return;

    const KAKAO_JAVASCRIPT_KEY = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;

    if (!KAKAO_JAVASCRIPT_KEY) {
      console.error('카카오 JavaScript 키가 설정되지 않았습니다.');
      return;
    }

    // 기본 옵션
    const defaultCenter = { lat: 33.450701, lng: 126.570667 }; // 제주도
    const center = options?.center || defaultCenter;
    const level = options?.level || 9;

    // 카카오맵 초기화 함수
    const initMap = () => {
      if (window.kakao && window.kakao.maps && mapContainer.current) {
        const mapOptions = {
          center: new window.kakao.maps.LatLng(center.lat, center.lng),
          level: level,
        };

        const map = new window.kakao.maps.Map(mapContainer.current, mapOptions);
        mapInstance.current = map;

        // 제주도 영역 제한 (남서쪽, 북동쪽 좌표)
        const swLatLng = new window.kakao.maps.LatLng(33.1, 126.1); // 남서쪽 좌표
        const neLatLng = new window.kakao.maps.LatLng(33.8, 127.0); // 북동쪽 좌표
        const bounds = new window.kakao.maps.LatLngBounds(swLatLng, neLatLng);

        // 지도 이동 제한
        window.kakao.maps.event.addListener(map, 'dragend', () => {
          const mapCenter = (map as { getCenter: () => unknown }).getCenter();
          if (!bounds.contain(mapCenter)) {
            (map as { setCenter: (latlng: unknown) => void }).setCenter(
              new window.kakao.maps.LatLng(center.lat, center.lng),
            );
          }
        });
      }
    };

    // 카카오맵 스크립트 로드 또는 초기화
    if (window.kakao && window.kakao.maps) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JAVASCRIPT_KEY}&libraries=services&autoload=false`;
      script.async = true;
      script.onload = () => {
        window.kakao.maps.load(initMap);
      };
      document.head.appendChild(script);
    }
  }, [options?.center?.lat, options?.center?.lng, options?.level, options?.center]);

  // 마커 생성 및 관리
  useEffect(() => {
    if (!mapInstance.current || !options?.markers) return;

    // 기존 마커 제거
    markersRef.current.forEach((marker: unknown) => {
      (marker as { setMap: (map: unknown) => void }).setMap(null);
    });
    markersRef.current = [];
    infowindowsRef.current = [];

    // 새로운 마커 생성
    options.markers.forEach((markerData) => {
      const markerPosition = new window.kakao.maps.LatLng(
        markerData.position.lat,
        markerData.position.lng,
      );

      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        title: markerData.title,
      });

      const infowindow = new window.kakao.maps.InfoWindow({
        content: `<div style="position:relative;padding:25px 20px 20px 20px;min-width:280px;background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.15);">
          <button onclick="this.parentElement.parentElement.parentElement.style.display='none'" style="position:absolute;top:8px;right:8px;background:none;border:none;font-size:20px;color:#999;cursor:pointer;padding:0;width:24px;height:24px;line-height:20px;">×</button>
          <div style="margin-bottom:15px;">
            <h3 style="margin:0 0 8px 0;font-size:18px;font-weight:bold;color:#000;">${markerData.title}</h3>
            <p style="margin:0;font-size:13px;color:#666;line-height:1.6;">${markerData.content}</p>
          </div>
          <div style="display:flex;gap:10px;">
            <a href="https://map.kakao.com/link/map/${encodeURIComponent(markerData.title)},${markerData.position.lat},${markerData.position.lng}"
               target="_blank"
               style="flex:1;padding:10px 0;background-color:#FEE500;color:#000;text-decoration:none;border-radius:6px;font-size:14px;font-weight:700;text-align:center;display:block;">
              큰 지도 보기
            </a>
            <a href="https://map.kakao.com/link/to/${encodeURIComponent(markerData.title)},${markerData.position.lat},${markerData.position.lng}"
               target="_blank"
               style="flex:1;padding:10px 0;background-color:#4A90E2;color:#fff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:700;text-align:center;display:block;">
              길찾기
            </a>
          </div>
        </div>`,
      });

      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, 'click', () => {
        // 다른 인포윈도우 닫기
        infowindowsRef.current.forEach((iw: unknown) => {
          (iw as { close: () => void }).close();
        });
        // 현재 인포윈도우 열기
        infowindow.open(mapInstance.current, marker);
      });

      marker.setMap(mapInstance.current);
      markersRef.current.push(marker);
      infowindowsRef.current.push(infowindow);
    });
  }, [options?.markers]);

  // 주소로 마커 추가하는 함수
  const addMarkerByAddress = useCallback((placeData: PlaceData) => {
    if (!mapInstance.current || !window.kakao || !window.kakao.maps) {
      console.error('지도가 초기화되지 않았습니다.');
      return;
    }

    if (!window.kakao.maps.services) {
      console.error('카카오맵 services 라이브러리가 로드되지 않았습니다.');
      return;
    }

    const geocoder = new window.kakao.maps.services.Geocoder();

    // 주소를 좌표로 변환
    geocoder.addressSearch(placeData.address, (result: unknown[], status: string) => {
      if (status === window.kakao.maps.services.Status.OK) {
        const firstResult = result[0] as { x: string; y: string; address_name?: string };
        const lat = parseFloat(firstResult.y);
        const lng = parseFloat(firstResult.x);
        const position = new window.kakao.maps.LatLng(lat, lng);

        // Places API로 장소 상세 정보 검색
        const places = new window.kakao.maps.services.Places();
        const searchKeyword = placeData.placeName || placeData.address;

        places.keywordSearch(
          searchKeyword,
          (data: unknown[], searchStatus: string) => {
            let placeInfo = {
              title: placeData.placeName || firstResult.address_name || '',
              content: firstResult.address_name || '',
              placeUrl: '',
              phone: '',
            };

            // 검색 결과가 있으면 상세 정보 사용
            if (searchStatus === window.kakao.maps.services.Status.OK && data.length > 0) {
              const place = data[0] as {
                place_name: string;
                address_name?: string;
                road_address_name?: string;
                place_url: string;
                phone?: string;
              };
              placeInfo = {
                title: place.place_name,
                content: place.address_name || place.road_address_name || '',
                placeUrl: place.place_url,
                phone: place.phone || '',
              };
            }

            // 마커 생성
            const marker = new window.kakao.maps.Marker({
              position: position,
              title: placeInfo.title,
            });

            // 인포윈도우 생성
            const infowindow = new window.kakao.maps.InfoWindow({
              content: `<div style="position:relative;padding:25px 20px 20px 20px;min-width:280px;font-family:'Malgun Gothic','Apple SD Gothic Neo',sans-serif;background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.15);">
                <button onclick="this.parentElement.parentElement.parentElement.style.display='none'" style="position:absolute;top:8px;right:8px;background:none;border:none;font-size:20px;color:#999;cursor:pointer;padding:0;width:24px;height:24px;line-height:20px;">×</button>
                <div style="margin-bottom:15px;">
                  <h3 style="margin:0 0 8px 0;font-size:18px;font-weight:bold;color:#000;">${placeInfo.title}</h3>
                  <p style="margin:0;font-size:13px;color:#666;line-height:1.6;">${placeInfo.content}</p>
                  ${placeInfo.phone ? `<p style="margin:8px 0 0 0;font-size:13px;color:#666;">📞 ${placeInfo.phone}</p>` : ''}
                </div>
                <div style="display:flex;gap:10px;">
                  <a href="https://map.kakao.com/link/map/${encodeURIComponent(placeInfo.title)},${lat},${lng}"
                     target="_blank"
                     style="flex:1;padding:10px 0;background-color:#FEE500;color:#000;text-decoration:none;border-radius:6px;font-size:14px;font-weight:700;text-align:center;display:block;">
                    큰 지도 보기
                  </a>
                  <a href="https://map.kakao.com/link/to/${encodeURIComponent(placeInfo.title)},${lat},${lng}"
                     target="_blank"
                     style="flex:1;padding:10px 0;background-color:#4A90E2;color:#fff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:700;text-align:center;display:block;">
                    길찾기
                  </a>
                </div>
              </div>`,
            });

            // 마커 클릭 이벤트
            window.kakao.maps.event.addListener(marker, 'click', () => {
              infowindowsRef.current.forEach((iw: unknown) => {
                (iw as { close: () => void }).close();
              });
              infowindow.open(mapInstance.current, marker);
            });

            marker.setMap(mapInstance.current);
            markersRef.current.push(marker);
            infowindowsRef.current.push(infowindow);

            // 지도 중심을 해당 위치로 이동
            (mapInstance.current as { setCenter: (latlng: unknown) => void }).setCenter(position);
          },
          {
            location: position,
            radius: 500,
          },
        );
      } else {
        console.error('주소 검색 실패:', placeData.address);
      }
    });
  }, []);

  return { mapContainer, mapInstance, addMarkerByAddress };
};
