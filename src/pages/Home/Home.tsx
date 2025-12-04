import { useKakaoMap, type MarkerData, type PlaceData } from '../../hooks/useKakaoMap';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PlaceCard from '../../components/PlaceCard';
import api from '../../api/api';

interface RecommendedPlace {
  title: string;
  address: string;
  thumbnailImage: string;
}

interface LocationState {
  recommendedPlaces?: RecommendedPlace[];
  userName?: string;
}

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;
  const recommendedPlaces = useMemo(
    () => state?.recommendedPlaces || [],
    [state?.recommendedPlaces],
  );

  // 선택된 카드 인덱스와 순서 관리
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());
  const [selectionOrder, setSelectionOrder] = useState<Map<number, number>>(new Map());

  const handleCardClick = (index: number) => {
    setSelectedIndices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        // 이미 선택된 경우 해제
        newSet.delete(index);
        setSelectionOrder((prevOrder) => {
          const newOrder = new Map(prevOrder);
          const removedOrder = newOrder.get(index);
          newOrder.delete(index);
          // 해제된 순서보다 큰 순서들을 1씩 감소
          newOrder.forEach((order, idx) => {
            if (removedOrder && order > removedOrder) {
              newOrder.set(idx, order - 1);
            }
          });
          return newOrder;
        });
      } else {
        // 최대 4개까지만 선택 가능
        if (newSet.size < 4) {
          newSet.add(index);
          setSelectionOrder((prevOrder) => {
            const newOrder = new Map(prevOrder);
            // 선택 순서는 현재 선택된 개수 + 1 (1부터 시작)
            newOrder.set(index, newSet.size);
            return newOrder;
          });
        }
      }
      return newSet;
    });
  };

  // 제주도 관광지 마커 데이터 (예시)
  const markers: MarkerData[] = [];

  const { mapContainer, addMarkerByAddress, updateMarkerColor } = useKakaoMap({
    center: { lat: 33.450701, lng: 126.570667 }, // 제주도 중심
    level: 9,
    markers,
  });

  // API 응답 데이터를 PlaceData 형식으로 변환하여 지도에 마커 추가
  useEffect(() => {
    if (recommendedPlaces.length === 0) return;

    // 지도 로드 후 약간의 딜레이를 주고 마커 추가
    const timer = setTimeout(() => {
      recommendedPlaces.forEach((place, index) => {
        setTimeout(() => {
          const placeData: PlaceData = {
            address: place.address,
            placeName: place.title,
          };
          addMarkerByAddress(placeData, index);
        }, index * 500); // 0.5초 간격으로 순차적으로 추가
      });
    }, 1000); // 지도 로드 후 1초 대기

    return () => clearTimeout(timer);
  }, [addMarkerByAddress, recommendedPlaces]);

  // 선택된 인덱스에 따라 마커 색상 실시간 업데이트
  useEffect(() => {
    recommendedPlaces.forEach((_, index) => {
      updateMarkerColor(index, selectedIndices.has(index));
    });
  }, [selectedIndices, updateMarkerColor, recommendedPlaces]);

  // 공유 링크 생성
  const generateShareLink = () => {
    const userName = state?.userName || '';
    const baseUrl = window.location.origin;
    return `${baseUrl}/selection/completion?name=${encodeURIComponent(userName)}`;
  };

  // 선택된 장소를 배열로 반환
  const getSelectedPlaces = (): string[] => {
    if (selectedIndices.size === 0 || recommendedPlaces.length === 0) {
      return [];
    }

    // 선택된 인덱스들을 배열로 변환하고 인덱스 순서대로 정렬
    const sortedIndices = Array.from(selectedIndices).sort((a, b) => a - b);

    // 인덱스에 해당하는 장소 이름 추출
    return sortedIndices
      .map((index) => {
        if (index >= 0 && index < recommendedPlaces.length) {
          return recommendedPlaces[index]?.title;
        }
        return null;
      })
      .filter((title): title is string => Boolean(title));
  };

  // PATCH 요청을 수행하는 공통 함수
  const patchSelectedPlaces = async (): Promise<boolean> => {
    const userName = state?.userName;
    if (!userName) {
      alert('사용자 이름을 찾을 수 없습니다.');
      return false;
    }

    // 선택된 장소를 배열로 변환
    const selectedPlaces = getSelectedPlaces();

    console.log('=== PATCH 요청 ===');
    console.log('선택된 인덱스:', Array.from(selectedIndices));
    console.log('선택된 장소 배열:', selectedPlaces);

    if (selectedPlaces.length !== 4) {
      alert(`4곳을 모두 선택해주세요. (현재: ${selectedPlaces.length}개)`);
      return false;
    }

    const requestUrl = `/api/v1/users/${encodeURIComponent(userName)}/place`;
    const requestData = { place: selectedPlaces };

    console.log('PATCH 요청 URL:', requestUrl);
    console.log('PATCH 요청 데이터:', requestData);

    try {
      // API PATCH 요청
      const response = await api.patch(requestUrl, requestData);

      console.log('관광지 저장 성공:', response.data);
      console.log('저장된 장소:', selectedPlaces);
      return true;
    } catch (error: unknown) {
      console.error('관광지 저장 실패:', error);
      return false;
    }
  };

  // 관광지 저장하기 버튼 클릭 핸들러
  const handleSavePlaces = async () => {
    const success = await patchSelectedPlaces();

    const userName = state?.userName || '';
    const shareLink = generateShareLink();
    const shareData = {
      title: '제주도 여행 관광지',
      text: `${userName}의 제주도 여행 관광지를 확인해보세요!`,
      url: shareLink,
    };

    // 공유 링크 생성 및 공유
    try {
      // Web Share API 지원 여부 확인
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Web Share API를 지원하지 않는 경우 클립보드에 복사
        await navigator.clipboard.writeText(shareLink);
        alert(
          success
            ? '관광지가 저장되었고 링크가 클립보드에 복사되었습니다.'
            : '관광지 저장에 실패했지만 링크가 클립보드에 복사되었습니다.',
        );
      }
    } catch (shareError: unknown) {
      if ((shareError as Error).name !== 'AbortError') {
        await navigator.clipboard.writeText(shareLink);
        alert(
          success
            ? '관광지가 저장되었고 링크가 클립보드에 복사되었습니다.'
            : '관광지 저장에 실패했지만 링크가 클립보드에 복사되었습니다.',
        );
      }
    }
  };

  // 지금 여행하기 버튼 클릭 핸들러
  const handleTravelNow = async () => {
    await patchSelectedPlaces();
    navigate('/selection/completion');
  };

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
      <div
        className={`w-full flex-1 mt-2 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${
          selectedIndices.size === 4 ? 'mb-[116px]' : ''
        }`}
      >
        <div className='flex flex-row flex-wrap gap-x-2 gap-y-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
          {recommendedPlaces.length > 0
            ? recommendedPlaces.map((place, index) => (
                <PlaceCard
                  key={index}
                  title={place.title}
                  address={place.address}
                  thumbnailImage={place.thumbnailImage}
                  isSelected={selectedIndices.has(index)}
                  selectionOrder={selectionOrder.get(index)}
                  onClick={() => handleCardClick(index)}
                />
              ))
            : Array.from({ length: 12 }).map((_, index) => (
                <PlaceCard
                  key={index}
                  isSelected={selectedIndices.has(index)}
                  selectionOrder={selectionOrder.get(index)}
                  onClick={() => handleCardClick(index)}
                />
              ))}
        </div>
      </div>
      {selectedIndices.size === 4 && (
        <>
          {/* 버튼 위 흰색 여백 (20px) */}
          <div className='fixed bottom-[96px] left-1/2 -translate-x-1/2 w-full max-w-[375px] h-5 bg-white z-10' />
          <div className='fixed bottom-[40px] left-1/2 -translate-x-1/2 w-[335px] flex gap-2 z-20'>
            <button
              onClick={handleSavePlaces}
              className='flex-1 h-14 bg-white border-1 border-[#C6C6C6] rounded-[12px] font-medium text-[16px] text-[#262626] flex items-center justify-center'
            >
              링크 공유하기
            </button>
            <button
              onClick={handleTravelNow}
              className='flex-1 h-14 bg-[#262626] border-1 border-[#FFFFFF] rounded-[12px] font-medium text-[16px] text-[#ffffff] flex items-center justify-center'
            >
              지금 여행하기
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
