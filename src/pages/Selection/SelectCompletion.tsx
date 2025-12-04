import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useKakaoMap } from '../../hooks/useKakaoMap';
import type { MarkerData, PlaceData } from '../../hooks/useKakaoMap';
import RecommendPlace from '../../components/RecoomentPlace';
import {
  getUserInfo,
  uploadPlaceImage,
  getVisitJejuContent,
  type UserInfoResponse,
} from '../../api/api';
import 기본SVG from '../../assets/기본.svg';
import eastSVG from '../../assets/east.svg';
import westSVG from '../../assets/west.svg';
import southSVG from '../../assets/south.svg';
import goormSVG from '../../assets/goorm.svg';
// 2번 질문 SVG
import question2_1SVG from '../../assets/1/1.svg';
import question2_2SVG from '../../assets/1/2.svg';
import question2_3SVG from '../../assets/1/3.svg';
// 3번 질문 SVG
import question3_1SVG from '../../assets/2/1.svg';
import question3_2SVG from '../../assets/2/2.svg';
import question3_3SVG from '../../assets/2/3.svg';
// 4번 질문 SVG
import question4_1SVG from '../../assets/3/1.svg';
import question4_2SVG from '../../assets/3/2.svg';
import question4_3SVG from '../../assets/3/3.svg';

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

  // 업로드된 이미지 개수에 따라 표시할 SVG 레이어 결정
  const getUploadedImagesCount = (): number => {
    if (!userInfo) return 0;
    return userInfo.placeImage.filter((img) => img && img.trim() !== '').length;
  };

  // 업로드된 이미지 개수에 따라 표시할 질문 ID 배열 반환
  const getVisibleQuestionIds = (): number[] => {
    const uploadedCount = getUploadedImagesCount();
    const questionIds: number[] = [];

    // 업로드된 이미지 개수에 따라 질문 ID 추가
    // index 0 (background) -> 1번 질문
    // index 1 (top) -> 2번 질문
    // index 2 (bottom) -> 3번 질문
    // index 3 (accessory) -> 4번 질문
    if (uploadedCount >= 1) questionIds.push(1);
    if (uploadedCount >= 2) questionIds.push(2);
    if (uploadedCount >= 3) questionIds.push(3);
    if (uploadedCount >= 4) questionIds.push(4);

    return questionIds;
  };

  // API 응답 값을 A, B, C로 변환
  const mapApiValueToAnswer = (
    value: string,
    type: 'background' | 'personality' | 'activity' | 'worth',
  ): string | null => {
    if (type === 'background') {
      switch (value) {
        case 'EAST':
          return 'A';
        case 'WEST':
          return 'B';
        case 'SOUTH':
          return 'C';
        default:
          return null;
      }
    }
    if (type === 'personality') {
      switch (value) {
        case 'NOVELTY':
          return 'A';
        case 'COMFORT':
          return 'B';
        case 'SOCIAL':
          return 'C';
        default:
          return null;
      }
    }
    if (type === 'activity') {
      switch (value) {
        case 'ACTIVE':
          return 'A';
        case 'QUIET':
          return 'B';
        case 'CREATIVE':
          return 'C';
        default:
          return null;
      }
    }
    if (type === 'worth') {
      switch (value) {
        case 'PHOTO':
          return 'A';
        case 'ECO':
          return 'B';
        case 'STORY':
          return 'C';
        default:
          return null;
      }
    }
    return null;
  };

  // 특정 질문의 SVG 이미지 가져오기
  const getQuestionSVG = (questionId: number, answer: string | null): string | null => {
    if (!answer) return null;

    // 1번 질문은 지역 선택 SVG 사용
    if (questionId === 1) {
      switch (answer) {
        case 'A':
          return eastSVG;
        case 'B':
          return westSVG;
        case 'C':
          return southSVG;
        default:
          return 기본SVG;
      }
    }

    // 2번 질문
    if (questionId === 2) {
      switch (answer) {
        case 'A':
          return question2_1SVG;
        case 'B':
          return question2_2SVG;
        case 'C':
          return question2_3SVG;
        default:
          return null;
      }
    }

    // 3번 질문
    if (questionId === 3) {
      switch (answer) {
        case 'A':
          return question3_1SVG;
        case 'B':
          return question3_2SVG;
        case 'C':
          return question3_3SVG;
        default:
          return null;
      }
    }

    // 4번 질문
    if (questionId === 4) {
      switch (answer) {
        case 'A':
          return question4_1SVG; // question4_1SVG가 없을 경우 기본 SVG 사용
        case 'B':
          return question4_2SVG;
        case 'C':
          return question4_3SVG;
        default:
          return null;
      }
    }

    return null;
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
        <div className='relative w-[103px] h-[110px] flex-shrink-0'>
          {userInfo && (
            <>
              {/* 업로드된 이미지 개수에 따라 동적으로 표시되는 질문 SVG들 */}
              {(() => {
                const visibleQuestionIds = getVisibleQuestionIds();

                return visibleQuestionIds.map((questionId) => {
                  let answer: string | null = null;

                  // 질문 ID에 따라 답변 가져오기
                  if (questionId === 1) {
                    answer = mapApiValueToAnswer(userInfo.background, 'background');
                  } else if (questionId === 2) {
                    answer = mapApiValueToAnswer(userInfo.personality, 'personality');
                  } else if (questionId === 3) {
                    answer = mapApiValueToAnswer(userInfo.activity, 'activity');
                  } else if (questionId === 4) {
                    answer = mapApiValueToAnswer(userInfo.worth, 'worth');
                  }

                  const svg = getQuestionSVG(questionId, answer);

                  if (!svg) return null;

                  // z-index: 1번 질문은 z-0, 나머지는 z-10 + (questionId * 10)
                  const zIndex = questionId === 1 ? 0 : 10 + (questionId - 1) * 10;

                  return (
                    <div
                      key={questionId}
                      className='absolute inset-0 flex items-center justify-center'
                      style={{ zIndex }}
                    >
                      <motion.img
                        src={svg}
                        alt={`${questionId}번 질문 이미지`}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className='w-full h-full object-contain'
                        style={
                          questionId === 1
                            ? {
                                border: '1px solid rgba(255, 255, 255, 0.12)',
                                borderRadius: '16px',
                              }
                            : {}
                        }
                      />
                    </div>
                  );
                });
              })()}

              {/* goorm SVG 이미지 - 항상 표시, z-10 */}
              <div className='absolute inset-0 flex items-center justify-center z-10'>
                <motion.img
                  src={goormSVG}
                  alt='구름 이미지'
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className='w-full h-full object-contain'
                />
              </div>
            </>
          )}
        </div>
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
