interface PlaceCardProps {
  title?: string;
  address?: string;
  thumbnailImage?: string;
  isSelected?: boolean;
  selectionOrder?: number;
  onClick?: () => void;
}

const PlaceCard = ({
  title,
  address,
  thumbnailImage,
  isSelected = false,
  selectionOrder,
  onClick,
}: PlaceCardProps) => {
  // 주소에서 시/군/구 정보 추출 (예: "제주특별자치도 제주시 삼도이동" -> "제주 제주시")
  const getShortAddress = (fullAddress?: string) => {
    if (!fullAddress) return '';
    const parts = fullAddress.split(' ');
    if (parts.length >= 2) {
      // "제주특별자치도" 제거하고 "제주" + 시/군/구 반환
      const city = parts[1].replace('시', '').replace('군', '').replace('읍', '').replace('면', '');
      return `제주 ${city}`;
    }
    return fullAddress;
  };

  return (
    <div className='flex flex-col gap-3 items-center relative cursor-pointer' onClick={onClick}>
      <div className='w-[163.5px] h-[121px] rounded-[12px] bg-gray-100 overflow-hidden relative'>
        {thumbnailImage ? (
          <img
            src={thumbnailImage}
            alt={title || '관광지'}
            className='w-full h-full object-cover'
          />
        ) : (
          <div className='w-full h-full bg-gray-100' />
        )}
        {/* 선택 순서 태그 */}
        {isSelected && selectionOrder && (
          <div
            className='absolute top-2 right-2 flex items-center justify-center'
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '30px',
              background: 'rgba(38, 38, 38, 0.40)',
            }}
          >
            <span className='text-white text-xs font-medium'>{selectionOrder}</span>
          </div>
        )}
      </div>
      <p className='flex flex-col gap-1 w-[163.5px]'>
        <span className='text-lg font-bold'>{title || '성산 일출봉'}</span>
        <span className='text-sm font-400 text-[#767676]'>
          {getShortAddress(address) || '제주 서귀포시 성산읍'}
        </span>
      </p>
    </div>
  );
};

export default PlaceCard;
