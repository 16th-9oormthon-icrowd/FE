import { useEffect, useRef } from 'react';

interface KakaoMapOptions {
  center?: {
    lat: number;
    lng: number;
  };
  level?: number;
}

export const useKakaoMap = (options?: KakaoMapOptions) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<unknown>(null);

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
      if (window.kakao && window.kakao.maps) {
        const mapOptions = {
          center: new window.kakao.maps.LatLng(center.lat, center.lng),
          level: level,
        };

        mapInstance.current = new window.kakao.maps.Map(mapContainer.current, mapOptions);
      }
    };

    // 카카오맵 스크립트 로드 또는 초기화
    if (window.kakao && window.kakao.maps) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_JAVASCRIPT_KEY}&autoload=false`;
      script.async = true;
      script.onload = () => {
        window.kakao.maps.load(initMap);
      };
      document.head.appendChild(script);
    }
  }, [options?.center?.lat, options?.center?.lng, options?.level]);

  return { mapContainer, mapInstance };
};
