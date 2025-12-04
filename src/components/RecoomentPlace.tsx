const RecommendPlace = () =>{
  return(
    <div className="flex gap-4 ">
        <div className="flex-1 w-[104px] h-[104px] bg-[#c4c4c4]"></div>
        <div className="flex-1 flex-col">
            <p className="mt-1">성산 일출봉</p>
            <div className="flex gap-2">
              <p>제주 서귀포시 성산읍</p>
              <button>복사사</button>       
            </div>
            <button>사진 업로드</button>

        </div>
    </div>
  )
}

export default RecommendPlace;