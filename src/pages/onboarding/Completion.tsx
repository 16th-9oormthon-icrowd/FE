import { Text } from '@vapor-ui/core';
const Completion = () => {
  return (
    <>
      <div className='flex flex-col items-center'>
        <Text className='text-center font-v-700 text-2xl py-8 '>
          제주도 여행 완료
          <br />
          다음 여행에도 저를 찾아주세요!
        </Text>
        <div className='mt-[61px] mb-[124px] w-[255px] h-[379px] bg-[#D9D9D9] rounded-[21px]'></div>
      </div>
      <div className='absolute bottom-[40px] flex left-1/2 -translate-x-1/2 '>
        <button className='bg-gray-0 text-base w-[163.5px] h-[56px] rounded-md px-6 '>
          카드 저장하기
        </button>
        <button className='bg-gray-900 text-base w-[163.5px] h-[56px] rounded-md px-6 text-white'>
          공유하기
        </button>
      </div>
    </>
  );
};

export default Completion;
