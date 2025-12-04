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

export default api;
