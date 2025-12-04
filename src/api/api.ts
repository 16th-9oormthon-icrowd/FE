import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  // CORS 오류 방지: withCredentials는 백엔드가 특정 origin을 허용할 때만 사용
  // 개발 환경에서는 false로 설정 (프로덕션에서 필요시 true로 변경)
  withCredentials: false,
  headers: {
    'Content-type': 'application/json',
  },
});

// 사용자 정보 응답 타입
export interface UserInfoResponse {
  name: string;
  background: 'EAST' | 'WEST' | 'SOUTH';
  personality: 'NOVELTY' | 'COMFORT' | 'SOCIAL';
  activity: 'ACTIVE' | 'QUIET' | 'CREATIVE';
  worth: 'PHOTO' | 'ECO' | 'STORY';
  place: string[];
  placeImage: string[];
}

// 사용자 정보 조회 API
export const getUserInfo = async (name: string): Promise<UserInfoResponse> => {
  const response = await api.get<UserInfoResponse>(`/api/v1/users/${name}`);
  return response.data;
};

// 이미지 업로드 응답 타입
export interface UploadImageResponse {
  s3Key: string;
  index: number;
  message: string;
}

// 장소 이미지 업로드 API
export const uploadPlaceImage = async (
  name: string,
  characterType: 'background' | 'top' | 'bottom' | 'accessory',
  file: File,
): Promise<UploadImageResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<UploadImageResponse>(
    `/api/v1/users/${name}/place-images/${characterType}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
  return response.data;
};

// VisitJeju 콘텐츠 응답 타입
export interface VisitJejuContent {
  contentsid: string;
  title: string;
  contentscdLabel: string;
  region1cdLabel: string;
  region2cdLabel: string;
  address: string;
  roadaddress: string;
  introduction: string;
  alltag: string;
  contentscdValue: string;
  contentscdRefid: string;
  region1cdValue: string;
  region1cdRefid: string;
  region2cdValue: string;
  region2cdRefid: string;
  tag: string;
  latitude: number;
  longitude: number;
  postcode: string;
  phoneno: string;
  repPhotoPhotoid: number;
  repPhotoImgpath: string;
  repPhotoThumbnailpath: string;
  repPhotoDescseo: string;
}

// VisitJeju 콘텐츠 조회 API
export const getVisitJejuContent = async (title: string): Promise<VisitJejuContent> => {
  const response = await api.get<VisitJejuContent>(
    `/api/v1/visitjeju-contents/${encodeURIComponent(title)}`,
  );
  return response.data;
};

export default api;

// 타입 명시적 export
export type { UserInfoResponse, UploadImageResponse, VisitJejuContent };
