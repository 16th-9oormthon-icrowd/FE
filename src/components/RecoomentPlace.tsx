const RecommendPlace = () =>{
  return(
    <div className="flex gap-4 ">
        <div className="w-[104px] aspect-[1/1] bg-[#c4c4c4] rounded-[12px]"></div>
        <div className="flex-1 flex-col">
            <p className="mt-1 font-semibold text-[18px] mb-1.5">성산 일출봉</p>
            <div className="flex gap-2 mb-2 items-center">
              <p className="w-[169px] text-[#767676] text-[14px]">제주 서귀포시 성산읍</p>
              <button className="bg-[#e1e1e1] w-[38px] h-[24px] rounded-[8px] text-[12px] font-medium">복사</button>       
            </div>
            <button className="w-full rounded-[12px] h-10 bg-white">사진 업로드</button>

        </div>
    </div>
  )
}

export default RecommendPlace;