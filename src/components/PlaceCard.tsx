const PlaceCard = () => {
  return (
    <div className='flex flex-col gap-3 items-center'>
      <div className='w-[163.5px] h-[121px] rounded-[12px] bg-gray-100'></div>
      <p className='flex flex-col gap-1 w-[163.5px]'>
        <span className='text-lg font-bold '>성산 일출봉</span>
        <span className='text-sm font-400 text-[#767676]'>제주 서귀포시 성산읍</span>
      </p>
    </div>
  );
};

export default PlaceCard;
