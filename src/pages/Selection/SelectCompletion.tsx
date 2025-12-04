import { useEffect } from 'react';
import { useKakaoMap } from '../../hooks/useKakaoMap';
import type { MarkerData, PlaceData } from '../../hooks/useKakaoMap';
import RecommendPlace from '../../components/RecoomentPlace';

const SelectCompletion = () => {
  const markers: MarkerData[] = [];

  const { mapContainer, addMarkerByAddress } = useKakaoMap({
    center: { lat: 33.450701, lng: 126.570667 }, // 제주도 중심
    level: 9,
    markers,
  });

  // 임시 데이터 - 백엔드에서 받을 주소 목록 (테스트용)
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
    {
      address: '제주특별자치도 제주시 애월읍',
      placeName: '애월 카페거리',
    },
  ];

  useEffect(() => {
    // 지도 로드 후 약간의 딜레이를 주고 마커 추가
    const timer = setTimeout(() => {
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
    <div className='flex flex-col h-[100dvh] max-h-[100dvh]'>
      <div className='flex gap-2 pt-8 bg-[#262626] pb-10 -mx-5 px-5'>
        <div className='flex flex-col gap-[14px]'>
          <p className='text-white font-bold leading-[1.5]  text-[20px]'>
            하아얀님 <br />
            제주도 여행을 떠나볼까요?
          </p>
          <button className='w-[160px] h-10 bg-[#ffffff]/[0.32] rounded-[12px]'>여행 완료</button>
        </div>
        <div className='w-[103px] h-[110px] bg-gray-900'></div>
      </div>
      <div className='flex-1 flex flex-col rounded-t-[20px] rounded-b-none -mx-5 px-5 pt-6 pb-6 bg-[#F7F7F8] min-h-0'>
        <p className='font-bold text-[#000000] text-[18px]  mb-[14px]'>
          나만의 관광지를 지도로 확인하세요
        </p>
        <div ref={mapContainer} className='w-full aspect-[67/40] rounded-[12px] mb-10'></div>
        <div className='flex-1 flex flex-col min-h-0'>
          <p className='font-bold text-[18px] mb-[14px]'>관광지를 방문하고 사진을 업로드해보세요</p>
          <div className='flexS-1 flex flex-col gap-4 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
            {testPlaces.map((_, index) => (
              <RecommendPlace key={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectCompletion;