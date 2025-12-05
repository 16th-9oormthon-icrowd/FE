/**
 * 이미지를 압축하고 리사이징하는 유틸리티
 * 업로드 전에 이미지 파일 크기를 줄여서 업로드 속도를 향상시킵니다.
 */

interface CompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0.1 ~ 1.0
  maxSizeKB?: number; // 목표 파일 크기 (KB)
}

/**
 * 이미지 파일을 압축하고 리사이징합니다
 * @param file 원본 이미지 파일
 * @param options 압축 옵션
 * @returns 압축된 File 객체
 */
export const compressImage = async (file: File, options: CompressOptions = {}): Promise<File> => {
  const { maxWidth = 1920, maxHeight = 1920, quality = 0.8 } = options;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // 이미지 크기 계산
        let width = img.width;
        let height = img.height;

        // 비율을 유지하면서 최대 크기에 맞춤
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        // Canvas를 사용하여 이미지 리사이징
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context를 가져올 수 없습니다.'));
          return;
        }

        // 이미지 그리기 (속도 최적화)
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'medium';
        ctx.drawImage(img, 0, 0, width, height);

        // 한 번만 압축 실행
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('이미지 압축에 실패했습니다.'));
              return;
            }

            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          'image/jpeg',
          quality,
        );
      };

      img.onerror = () => {
        reject(new Error('이미지를 로드할 수 없습니다.'));
      };

      if (e.target?.result) {
        img.src = e.target.result as string;
      }
    };

    reader.onerror = () => {
      reject(new Error('파일을 읽을 수 없습니다.'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * 이미지 파일이 압축이 필요한지 확인
 * @param file 이미지 파일
 * @param maxSizeKB 최대 크기 (KB)
 * @returns 압축이 필요하면 true
 */
export const needsCompression = (file: File, maxSizeKB: number = 500): boolean => {
  return file.size / 1024 > maxSizeKB;
};
