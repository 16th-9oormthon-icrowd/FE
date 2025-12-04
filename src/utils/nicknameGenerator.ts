// 동사 리스트 (4글자 이하) - 제주도 특색 반영
const verbs = [
  '오르는',
  '걷는',
  '즐기는',
  '맛보는',
  '느끼는',
  '만나는',
  '보는',
  '듣는',
  '먹는',
  '마시는',
  '사는',
  '가는',
  '찾는',
  '쉬는',
  '노는',
];

// 명사 리스트 (4글자 이하) - 제주도 특색 반영
const nouns = [
  '한라산',
  '오름',
  '돌하르방',
  '해녀',
  '감귤',
  '한라봉',
  '제주말',
  '돌담',
  '바람',
  '바다',
  '해안',
  '용암',
  '동굴',
  '폭포',
  '송이',
  '돌고래',
  '흑돼지',
  '전복',
  '미역',
  '모래',
  '조개',
  '해변',
  '절벽',
  '분화구',
  '돌담길',
  '감귤밭',
  '차밭',
  '유채꽃',
  '벚꽃',
  '동백꽃',
  '산수국',
  '제주돌',
  '현무암',
  '올레길',
  '성산',
  '백록담',
  '제주바람',
  '제주해안',
  '제주바다',
];

/**
 * 랜덤 닉네임 생성 함수
 * 동사 + 명사 조합으로 생성
 * @returns 생성된 닉네임
 */
export function generateNickname(): string {
  const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${randomVerb} ${randomNoun}`;
}
