import { useKakaoMap, type MarkerData, type PlaceData } from '../../hooks/useKakaoMap';
import { useEffect } from 'react';

const Home = () => {
  // 제주도 관광지 마커 데이터 (예시)
  const markers: MarkerData[] = [];

  const { mapContainer, addMarkerByAddress } = useKakaoMap({
    center: { lat: 33.450701, lng: 126.570667 }, // 제주도 중심
    level: 9,
    markers,
  });

  // 임시 데이터 - 백엔드에서 받을 주소 목록 (테스트용)
  useEffect(() => {
    // 지도 로드 후 약간의 딜레이를 주고 마커 추가
    const timer = setTimeout(() => {
      const testPlaces: PlaceData[] = [
        {
          address: '제주특별자치도 서귀포시 성산읍 성산리',
          placeName: '성산일출봉',
        },
        {
          address: '제주특별자치도 서귀포시 천지동',
          placeName: '천지연폭포',
        },
        {
          address: '제주특별자치도 제주시 한림읍 협재리',
          placeName: '협재해수욕장',
        },
      ];

      // 각 장소마다 마커 추가
      testPlaces.forEach((place, index) => {
        setTimeout(() => {
          addMarkerByAddress(place);
        }, index * 500); // 0.5초 간격으로 순차적으로 추가
      });
    }, 1000); // 지도 로드 후 1초 대기

    return () => clearTimeout(timer);
  }, [addMarkerByAddress]);

  return (
    <>
      <div className='flex flex-col gap-4 p-4'>
        <h1 className='text-2xl font-bold'>제주도 관광지도</h1>
        <p className='text-gray-600'>마커를 클릭하면 자세한 정보를 볼 수 있습니다.</p>
        <div ref={mapContainer} className='w-full h-[600px] rounded-lg shadow-lg' />
      </div>
    </>
  );
};

export default Home;
