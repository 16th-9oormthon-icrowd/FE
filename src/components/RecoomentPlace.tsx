import { useRef, useState } from 'react';
import BlankImage from '../assets/blank.svg?react';
import { compressImage, needsCompression } from '../utils/imageCompression';

interface RecommendPlaceProps {
  placeName: string;
  address: string;
  onImageUpload?: (file: File) => void;
  uploadedImage?: string;
  isUploading?: boolean;
}

const RecommendPlace = ({
  placeName,
  address,
  onImageUpload,
  uploadedImage,
  isUploading = false,
}: RecommendPlaceProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImageUpload) return;

    try {
      // 이미지 파일인지 확인
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      let fileToUpload = file;

      // 큰 파일인 경우 압축 진행
      if (needsCompression(file, 500)) {
        setIsCompressing(true);
        try {
          fileToUpload = await compressImage(file, {
            maxWidth: 1200,
            maxHeight: 1200,
            quality: 0.75,
            maxSizeKB: 500,
          });
          console.log(
            `이미지 압축 완료: ${(file.size / 1024).toFixed(2)}KB → ${(fileToUpload.size / 1024).toFixed(2)}KB`,
          );
        } catch (error) {
          console.error('이미지 압축 실패:', error);
          // 압축 실패해도 원본 파일로 업로드 시도
        } finally {
          setIsCompressing(false);
        }
      }

      onImageUpload(fileToUpload);
    } catch (error) {
      console.error('파일 처리 실패:', error);
      alert('파일 처리에 실패했습니다. 다시 시도해주세요.');
    }

    // 같은 파일을 다시 선택할 수 있도록 input 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
      <div className='w-[104px] aspect-[1/1] rounded-[12px] overflow-hidden'>
        {uploadedImage ? (
          <img
            src={uploadedImage}
            alt={placeName}
            className='w-full h-full object-cover'
            onError={handleImageError}
          />
        ) : (
          <BlankImage className='w-[104px] h-[104px] rounded-[12px]' />
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
          disabled={!!uploadedImage || isCompressing || isUploading}
          className='w-full rounded-[12px] h-10 bg-white disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {isCompressing
            ? '압축 중...'
            : isUploading
              ? '업로드 중...'
              : uploadedImage
                ? '업로드 완료'
                : '사진 업로드'}
        </button>
      </div>
    </div>
  );
};

export default RecommendPlace;
