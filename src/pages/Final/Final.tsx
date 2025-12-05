import { useRef, useEffect, useState } from 'react';
import { domToPng } from 'modern-screenshot';
import { getUserInfo } from '../../api/api';
import type { UserInfoResponse } from '../../api/api';
import startBg from '../../assets/start.jpg';
import Card from '../../assets/card.png';

// 배경 이미지
import EastBg from '../../assets/east.svg';
import WestBg from '../../assets/west.svg';
import SouthBg from '../../assets/south.svg';

// personality 이미지 (1폴더)
import Personality1 from '../../assets/1/1.svg';
import Personality2 from '../../assets/1/2.svg';
import Personality3 from '../../assets/1/3.svg';

// activity 이미지 (2폴더)
import Activity1 from '../../assets/2/1.svg';
import Activity2 from '../../assets/2/2.svg';
import Activity3 from '../../assets/2/3.svg';

// worth 이미지 (3폴더)
import Worth1 from '../../assets/3/1.svg';
import Worth2 from '../../assets/3/2.svg';
import Worth3 from '../../assets/3/3.svg';

// 기본 구름 이미지
import goormSVG from '../../assets/goorm.svg';

const Final = () => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [userInfo, setUserInfo] = useState<UserInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // 이미지 매핑
  const getBackgroundImage = (background: string) => {
    const map: Record<string, string> = {
      EAST: EastBg,
      WEST: WestBg,
      SOUTH: SouthBg,
    };
    return map[background] || EastBg;
  };

  const getPersonalityImage = (personality: string) => {
    const map: Record<string, string> = {
      NOVELTY: Personality1,
      COMFORT: Personality2,
      SOCIAL: Personality3,
    };
    return map[personality] || Personality1;
  };

  const getActivityImage = (activity: string) => {
    const map: Record<string, string> = {
      ACTIVE: Activity1,
      QUIET: Activity2,
      CREATIVE: Activity3,
    };
    return map[activity] || Activity1;
  };

  const getWorthImage = (worth: string) => {
    const map: Record<string, string> = {
      PHOTO: Worth1,
      ECO: Worth2,
      STORY: Worth3,
    };
    return map[worth] || Worth1;
  };

  // 사용자 정보 불러오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userName = localStorage.getItem('userName');
        if (!userName) {
          alert('사용자 이름을 찾을 수 없습니다.');
          return;
        }

        const data = await getUserInfo(userName);
        setUserInfo(data);
      } catch (error) {
        console.error('사용자 정보 불러오기 실패:', error);
        alert('사용자 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleDownloadCard = async () => {
    if (!cardRef.current) return;

    try {
      // modern-screenshot을 사용하여 이미지 생성
      const dataUrl = await domToPng(cardRef.current, {
        scale: 2, // 고해상도
        quality: 1, // 최고 품질
        backgroundColor: null, // 투명 배경
      });

      // 이미지 다운로드
      const link = document.createElement('a');
      link.download = '제주도_여행카드.png';
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('카드 저장 실패:', error);
      alert(
        `카드 저장에 실패했습니다.\n에러: ${error instanceof Error ? error.message : '알 수 없는 오류'}\n콘솔을 확인해주세요.`,
      );
    }
  };

  if (loading) {
    return (
      <div
        className='relative w-full h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center'
        style={{ backgroundImage: `url(${startBg})` }}
      >
        <p className='text-white font-bold text-[24px]'>로딩 중...</p>
      </div>
    );
  }

  return (
    <div
      className='relative w-full h-screen bg-cover bg-center bg-no-repeat'
      style={{ backgroundImage: `url(${startBg})` }}
    >
      <div className='flex flex-col items-center pt-[calc(100vh/3-200px)]'>
        <p className='px-5 text-white font-bold text-[24px] text-center leading-normal mb-5'>
          제주도 여행 완료!
          <br />
          다음 여행에도 저를 찾아주세요!
        </p>

        <div ref={cardRef} className='mt-8 relative'>
          <img src={Card} alt='여행 카드' className='w-[270px] h-[433px] rounded-[21px]' />

          {/* 카드 내부 이미지 영역 - 5개 이미지를 같은 위치에 레이어로 쌓기 */}
          <div className='absolute left-[27px] top-[64px] w-[215px] h-[215px] rounded-[12px] overflow-hidden'>
            {userInfo && (
              <>
                {/* 1. Background 이미지 (최하단) */}
                <img
                  src={getBackgroundImage(userInfo.background)}
                  alt='background'
                  className='absolute inset-0 w-full h-full object-cover'
                />
                {/* 2. 구름 이미지 (Background 위) */}
                <img
                  src={goormSVG}
                  alt='goorm'
                  className='absolute inset-0 w-full h-full object-contain'
                />
                {/* 3. Personality 이미지 */}
                <img
                  src={getPersonalityImage(userInfo.personality)}
                  alt='personality'
                  className='absolute inset-0 w-full h-full object-cover'
                />
                {/* 4. Activity 이미지 */}
                <img
                  src={getActivityImage(userInfo.activity)}
                  alt='activity'
                  className='absolute inset-0 w-full h-full object-cover'
                />
                {/* 5. Worth 이미지 */}
                <img
                  src={getWorthImage(userInfo.worth)}
                  alt='worth'
                  className='absolute inset-0 w-full h-full object-cover'
                />
              </>
            )}
          </div>
        </div>
        <button
          onClick={handleDownloadCard}
          className='w-[335px] h-14 rounded-[12px] bg-[#262626] absolute bottom-10 left-1/2 -translate-x-1/2 text-white'
        >
          카드 저장하기
        </button>
      </div>
    </div>
  );
};

export default Final;
