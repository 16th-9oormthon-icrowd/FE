import { useNavigate } from 'react-router-dom';
import startBg from '../../assets/start.jpg';

const Start = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate('/question');
  };

  return (
    <div
      className='relative w-full h-screen bg-cover bg-center bg-no-repeat'
      style={{ backgroundImage: `url(${startBg})` }}
    >
      {/* 텍스트 */}
      <p className='absolute top-[36%] -translate-y-1/2 text-white font-bold text-[24px] w-full text-center flex flex-col gap-3 '>
        <span className='leading-[1.5]'>
          아직 보지 못한 제주를,
          <br />
          당신의 취향으로 발견하다
        </span>
        <span className='font-normal text-[16px]'>
          검색하지 않고도 숨어있는 제주도를 찾아드려요
        </span>
      </p>
      <button
        onClick={handleStart}
        className='w-[335px] h-14 rounded-[12px] bg-[#262626] absolute bottom-10 left-1/2 -translate-x-1/2 text-white'
      >
        시작하기
      </button>
    </div>
  );
};

export default Start;
