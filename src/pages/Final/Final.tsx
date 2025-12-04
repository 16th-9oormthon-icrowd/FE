import { useRef } from 'react';
import { domToPng } from 'modern-screenshot';
import startBg from '../../assets/start.png';
import Card from '../../assets/card.png';

const Final = () => {
  const cardRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      className='relative w-full h-screen bg-cover bg-center bg-no-repeat'
      style={{ backgroundImage: `url(${startBg})` }}
    >
      <div className='flex flex-col items-center pt-[calc(100vh/3-200px)]'>
        <p className='px-5 text-white font-bold text-[24px] text-center leading-normal mb-8'>
          제주도 여행 완료!
          <br />
          다음 여행에도 저를 찾아주세요!
        </p>

        <div ref={cardRef} className='mt-8 relative'>
          <img src={Card} alt='여행 카드' className='w-[295px] h-[474px] rounded-[21px]' />

          {/* 카드 내부 이미지 영역 */}
          <div className='absolute left-[30px] top-[71px] w-[235px] h-[235px] bg-gray-300 rounded-[12px]'>
            {/* 나중에 실제 이미지가 들어올 위치 */}
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
