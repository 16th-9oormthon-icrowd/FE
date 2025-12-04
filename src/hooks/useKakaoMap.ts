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
  const markerIndexMap = useRef<Map<number, unknown>>(new Map()); // 인덱스와 마커 매핑

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

      // 고유 ID 생성
      const overlayId = `overlay-${Date.now()}-${Math.random()}`;

      const content = document.createElement('div');
      content.innerHTML = `<div style="position:relative;padding:25px 20px 20px 20px;min-width:280px;font-family:'Malgun Gothic','Apple SD Gothic Neo',sans-serif;background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.15);">
          <button class="overlay-close-btn" data-overlay-id="${overlayId}" style="position:absolute;top:8px;right:8px;background:none;border:none;font-size:20px;color:#999;cursor:pointer;padding:0;width:24px;height:24px;line-height:20px;">×</button>
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
        </div>`;

      const customOverlay = new (
        window.kakao.maps as typeof window.kakao.maps & {
          CustomOverlay: new (options: unknown) => unknown;
        }
      ).CustomOverlay({
        content: content,
        position: markerPosition,
        yAnchor: 1.3,
      });

      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, 'click', () => {
        // 다른 오버레이 닫기
        infowindowsRef.current.forEach((overlay: unknown) => {
          (overlay as { setMap: (map: null) => void }).setMap(null);
        });
        // 현재 오버레이 열기
        (customOverlay as { setMap: (map: unknown) => void }).setMap(mapInstance.current);

        // 지도 중심을 마커 위치로 이동
        (mapInstance.current as { panTo: (latlng: unknown) => void }).panTo(markerPosition);

        // 닫기 버튼 이벤트 리스너 추가
        setTimeout(() => {
          const closeBtn = document.querySelector(`[data-overlay-id="${overlayId}"]`);
          if (closeBtn) {
            closeBtn.addEventListener('click', () => {
              (customOverlay as { setMap: (map: null) => void }).setMap(null);
            });
          }
        }, 0);
      });

      marker.setMap(mapInstance.current);
      markersRef.current.push(marker);
      infowindowsRef.current.push(customOverlay);
    });
  }, [options?.markers]);

  // 마커 색상 변경 함수
  const updateMarkerColor = useCallback((index: number, isSelected: boolean) => {
    if (!window.kakao || !window.kakao.maps) return;

    const marker = markerIndexMap.current.get(index);
    if (!marker) return;

    // 선택된 경우 빨간색, 선택 해제된 경우 기본 색상
    const imageSrc = isSelected
      ? 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png'
      : 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker.png';

    const kakaoMaps = window.kakao.maps as typeof window.kakao.maps & {
      Size: new (width: number, height: number) => unknown;
      Point: new (x: number, y: number) => unknown;
      MarkerImage: new (src: string, size: unknown, options: unknown) => unknown;
    };

    const imageSize = new kakaoMaps.Size(24, 35);
    const imageOption = { offset: new kakaoMaps.Point(12, 35) };
    const markerImage = new kakaoMaps.MarkerImage(imageSrc, imageSize, imageOption);

    (marker as { setImage: (image: unknown) => void }).setImage(markerImage);
  }, []);

  // 주소로 마커 추가하는 함수 (인덱스 포함)
  const addMarkerByAddress = useCallback((placeData: PlaceData, index?: number) => {
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

            // 인덱스가 제공된 경우 마커를 인덱스와 매핑
            if (index !== undefined) {
              markerIndexMap.current.set(index, marker);
            }

            // 고유 ID 생성
            const overlayId = `overlay-${Date.now()}-${Math.random()}`;

            const content = document.createElement('div');
            content.innerHTML = `<div style="position:relative;padding:25px 20px 20px 20px;min-width:280px;font-family:'Malgun Gothic','Apple SD Gothic Neo',sans-serif;background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.15);">
                <button class="overlay-close-btn" data-overlay-id="${overlayId}" style="position:absolute;top:8px;right:8px;background:none;border:none;font-size:20px;color:#999;cursor:pointer;padding:0;width:24px;height:24px;line-height:20px;">×</button>
                <div style="margin-bottom:15px;">
                  <h3 style="margin:0 0 8px 0;font-size:18px;font-weight:bold;color:#000;">${placeInfo.title}</h3>
                  <p style="margin:0;font-size:13px;color:#666;line-height:1.6;">${placeInfo.content}</p>
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
              </div>`;

            const customOverlay = new (
              window.kakao.maps as typeof window.kakao.maps & {
                CustomOverlay: new (options: unknown) => unknown;
              }
            ).CustomOverlay({
              content: content,
              position: position,
              yAnchor: 1.3,
            });

            // 마커 클릭 이벤트
            window.kakao.maps.event.addListener(marker, 'click', () => {
              infowindowsRef.current.forEach((overlay: unknown) => {
                (overlay as { setMap: (map: null) => void }).setMap(null);
              });
              (customOverlay as { setMap: (map: unknown) => void }).setMap(mapInstance.current);

              // 지도 중심을 마커 위치로 이동
              (mapInstance.current as { panTo: (latlng: unknown) => void }).panTo(position);

              // 닫기 버튼 이벤트 리스너 추가
              setTimeout(() => {
                const closeBtn = document.querySelector(`[data-overlay-id="${overlayId}"]`);
                if (closeBtn) {
                  closeBtn.addEventListener('click', () => {
                    (customOverlay as { setMap: (map: null) => void }).setMap(null);
                  });
                }
              }, 0);
            });

            marker.setMap(mapInstance.current);
            markersRef.current.push(marker);
            infowindowsRef.current.push(customOverlay);

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

  return { mapContainer, mapInstance, addMarkerByAddress, updateMarkerColor };
};
