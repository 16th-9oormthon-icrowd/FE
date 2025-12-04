import { useEffect, useState, useMemo } from 'react';
import { useKakaoMap } from '../../hooks/useKakaoMap';
import type { MarkerData, PlaceData } from '../../hooks/useKakaoMap';
import RecommendPlace from '../../components/RecoomentPlace';
import {
  getUserInfo,
  uploadPlaceImage,
  getVisitJejuContent,
  type UserInfoResponse,
} from '../../api/api';

const SelectCompletion = () => {
  const [userInfo, setUserInfo] = useState<UserInfoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [places, setPlaces] = useState<PlaceData[]>([]);

  // 마커 데이터를 useMemo로 감싸기
  const markers: MarkerData[] = useMemo(() => [], []);

  // useKakaoMap options를 useMemo로 메모이제이션
  const mapOptions = useMemo(
    () => ({
      center: { lat: 33.450701, lng: 126.570667 }, // 제주도 중심
      level: 11,
      markers,
      defaultMarkerColor: '#FF8C00', // 주황색 마커 고정
    }),
    [markers],
  );

  const { mapContainer, addMarkerByAddress, moveToCenter } = useKakaoMap(mapOptions);

  // 사용자 정보 불러오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setIsLoading(true);
        const userName = localStorage.getItem('userName');

        if (!userName) {
          console.error('사용자 이름이 없습니다.');
          return;
        }

        const data = await getUserInfo(userName);
        console.log('사용자 정보:', data);
        console.log('place 데이터:', data.place);
        console.log('placeImage 데이터:', data.placeImage);
        setUserInfo(data);

        // place 이름으로 실제 주소 가져오기
        const placesWithAddress = await Promise.all(
          data.place.map(async (placeName) => {
            // place가 비어있으면 스킵
            if (!placeName || placeName.trim() === '') {
              return {
                placeName: '',
                address: '',
              };
            }

            try {
              const content = await getVisitJejuContent(placeName);
              console.log(`${placeName} 주소:`, content.address);

              // 주소에서 "제주특별자치도" 제거
              const rawAddress = content.address || content.roadaddress || placeName;
              const cleanAddress = rawAddress.replace(/^제주특별자치도\s*/, '');

              return {
                placeName: content.title,
                address: cleanAddress,
              };
            } catch (error) {
              console.error(`${placeName} 정보 가져오기 실패:`, error);
              // 실패하면 placeName을 그대로 사용
              return {
                placeName: placeName,
                address: placeName,
              };
            }
          }),
        );

        setPlaces(placesWithAddress);
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // 이미지 업로드 핸들러
  const handleImageUpload = async (index: number, file: File) => {
    try {
      const userName = localStorage.getItem('userName');
      if (!userName) {
        alert('사용자 이름을 찾을 수 없습니다.');
        return;
      }

      // 인덱스에 따라 character_type 결정
      const characterTypes: Array<'background' | 'top' | 'bottom' | 'accessory'> = [
        'background',
        'top',
        'bottom',
        'accessory',
      ];
      const characterType = characterTypes[index];

      console.log(`이미지 업로드 시작: ${characterType}`);
      const response = await uploadPlaceImage(userName, characterType, file);
      console.log('이미지 업로드 성공:', response);

      // 업로드 성공 후 사용자 정보 다시 불러오기
      const updatedData = await getUserInfo(userName);
      setUserInfo(updatedData);

      alert('이미지가 성공적으로 업로드되었습니다!');
    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
    }
  };

  // S3 키를 전체 이미지 URL로 변환
  const getImageUrl = (s3Key: string | undefined): string => {
    if (!s3Key) return '';
    // 백엔드 이미지 프록시 API 사용
    const imageUrl = `${import.meta.env.VITE_BASE_URL}/api/v1/images/${encodeURIComponent(s3Key)}`;
    console.log('이미지 URL:', imageUrl);
    return imageUrl;
  };

  // 모든 이미지가 업로드되었는지 확인
  const isAllImagesUploaded = () => {
    if (!userInfo) return false;

    // 실제로 표시되는 장소 개수
    const validPlacesCount = places.filter(
      (place) => place.placeName && place.placeName.trim() !== '',
    ).length;

    // 업로드된 이미지 개수 (빈 문자열이 아닌 것만)
    const uploadedImagesCount = userInfo.placeImage.filter(
      (img) => img && img.trim() !== '',
    ).length;

    return validPlacesCount > 0 && uploadedImagesCount >= validPlacesCount;
  };

  useEffect(() => {
    if (places.length === 0) return;

    // 지도 로드 후 약간의 딜레이를 주고 마커 추가
    const timer = setTimeout(() => {
      // 모든 마커를 한번에 추가
      places.forEach((place, index) => {
        addMarkerByAddress(place, index);
      });

      // 모든 마커가 로드될 시간을 주고 중앙으로 이동
      setTimeout(() => {
        moveToCenter();
      }, 2000);
    }, 1000); // 지도 로드 후 1초 대기

    return () => clearTimeout(timer);
  }, [addMarkerByAddress, places, moveToCenter]);

  return (
    <div className='flex flex-col h-[100dvh] -mx-5 px-5 bg-[#262626] max-h-[100dvh] '>
      <div className='flex gap-2 pt-8  pb-10 '>
        <div className='flex flex-col gap-[14px]'>
          <p className='text-white font-bold leading-[1.5]  text-[20px]'>
            {isLoading ? '로딩 중...' : userInfo ? `${userInfo.name}님` : '사용자'} <br />
            제주도 여행을 떠나볼까요?
          </p>
          <button
            disabled={!isAllImagesUploaded()}
            className='w-[160px] h-10 bg-white rounded-[12px] disabled:cursor-not-allowed disabled:bg-[#ffffff]/[0.32]'
          >
            여행 완료
          </button>
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
            {places
              .filter((place) => place.placeName && place.placeName.trim() !== '')
              .map((place, index) => (
                <RecommendPlace
                  key={index}
                  placeName={place.placeName || ''}
                  address={place.address || ''}
                  onImageUpload={(file: File) => handleImageUpload(index, file)}
                  uploadedImage={getImageUrl(userInfo?.placeImage[index])}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectCompletion;
