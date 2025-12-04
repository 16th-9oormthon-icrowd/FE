import { useRef } from 'react';

interface RecommendPlaceProps {
  placeName: string;
  address: string;
  onImageUpload?: (file: File) => void;
  uploadedImage?: string;
}

const RecommendPlace = ({
  placeName,
  address,
  onImageUpload,
  uploadedImage,
}: RecommendPlaceProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageUpload) {
      onImageUpload(file);
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    alert('주소가 복사되었습니다!');
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error('이미지 로드 실패:', uploadedImage);
    console.error('에러 상세:', e);
  };

  return (
    <div className='flex gap-4 '>
      <div className='w-[104px] aspect-[1/1] bg-[#c4c4c4] rounded-[12px] overflow-hidden'>
        {uploadedImage && (
          <img
            src={uploadedImage}
            alt={placeName}
            className='w-full h-full object-cover'
            onError={handleImageError}
          />
        )}
      </div>
      <div className='flex-1 flex-col'>
        <p className='mt-1 font-semibold text-[18px] mb-1.5'>{placeName}</p>
        <div className='flex gap-2 mb-2 '>
          <p className='w-[169px] text-[#767676] text-[14px] '>{address}</p>
          <button
            onClick={handleCopyAddress}
            className='bg-[#e1e1e1] w-[38px] h-[24px] rounded-[8px] text-[12px] font-medium'
          >
            복사
          </button>
        </div>
        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          onChange={handleFileChange}
          className='hidden'
        />
        <button
          onClick={handleUploadClick}
          disabled={!!uploadedImage}
          className='w-full rounded-[12px] h-10 bg-white disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {uploadedImage ? '업로드 완료' : '사진 업로드'}
        </button>
      </div>
    </div>
  );
};

export default RecommendPlace;
