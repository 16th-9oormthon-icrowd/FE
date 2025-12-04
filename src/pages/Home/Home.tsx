import { useKakaoMap, type MarkerData, type PlaceData } from '../../hooks/useKakaoMap';
import { useEffect } from 'react';
import PlaceCard from '../../components/PlaceCard';

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
    <div className='h-[100dvh] max-h-[100dvh] flex flex-col'>
      <div className='flex flex-col py-8'>
        <p className='text-2xl font-bold leading-normal mb-3'>
          나의 취향으로 고른
          <br />
          새로운 제주를 준비했어요
        </p>
        <p className='text-sm text-gray-500  '>딱 4곳만 선택해 여행의 시작을 완성하세요</p>
      </div>
      <div
        ref={mapContainer}
        className='w-full aspect-[67/40] rounded-lg shadow-lg mb-8 shrink-0'
      />
      <div className='w-full'>
        <button className='w-[37px] h-[24px] bg-[#E1E1E1] rounded-[8px] font-500 text-[12px] text-[#393939]'>
          선택
        </button>
      </div>
      <div className='w-full flex-1 mt-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
        <div className='flex flex-row max-h-[calc(100%-150px)] flex-wrap gap-x-2 gap-y-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
          {Array.from({ length: 12 }).map((_, index) => (
            <PlaceCard key={index} />
          ))}
        </div>
      </div>
      <button className='w-[335px] h-14 bg-[#262626]/[0.32] rounded-[12px] font-medium text-[16px] text-[#ffffff] fixed bottom-[40px] left-1/2 -translate-x-1/2 flex items-center justify-center'>
        관광지 저장하기
      </button>
    </div>
  );
};

export default Home;
