import { useKakaoMap } from '../../hooks/useKakaoMap';

const Home = () => {
  const { mapContainer } = useKakaoMap({
    center: { lat: 33.450701, lng: 126.570667 }, // 제주도 중심
    level: 9,
  });

  return (
    <>
      <div className='flex flex-col gap-4 p-4'>
        <h1 className='text-2xl font-bold'>제주도 지도</h1>
        <div ref={mapContainer} className='w-full h-[600px] rounded-lg shadow-lg' />
      </div>
    </>
  );
};

export default Home;
