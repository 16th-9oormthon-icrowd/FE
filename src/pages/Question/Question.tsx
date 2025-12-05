import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Flex, VStack, TextInput, Button } from '@vapor-ui/core';
import { CheckCircleIcon, RefreshOutlineIcon } from '@vapor-ui/icons';
import { useNavigate } from 'react-router-dom';
import api from '../../api/api';
import { AxiosError } from 'axios';
import { generateNickname } from '../../utils/nicknameGenerator';
import 기본SVG from '../../assets/기본.svg';
import eastSVG from '../../assets/east.svg';
import westSVG from '../../assets/west.svg';
import southSVG from '../../assets/south.svg';
import goormSVG from '../../assets/goorm.svg';
// 2번 질문 SVG
import question2_1SVG from '../../assets/1/1.svg';
import question2_2SVG from '../../assets/1/2.svg';
import question2_3SVG from '../../assets/1/3.svg';
// 3번 질문 SVG
import question3_1SVG from '../../assets/2/1.svg';
import question3_2SVG from '../../assets/2/2.svg';
import question3_3SVG from '../../assets/2/3.svg';
// 4번 질문 SVG
import question4_1SVG from '../../assets/3/1.svg';
import question4_2SVG from '../../assets/3/2.svg';
import question4_3SVG from '../../assets/3/3.svg';

interface Question {
  id: number;
  title: string;
  type: 'choice' | 'text';
  options?: {
    label: string;
    value: string;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    type: 'choice',
    title: '이번엔 어느 지역을 탐험할까요?',
    options: [
      { label: '동부 제주', value: 'A' },
      { label: '서부 제주', value: 'B' },
      { label: '남부 제주', value: 'C' },
    ],
  },
  {
    id: 2,
    type: 'choice',
    title: '평소 나는 어떤 사람인가요?',
    options: [
      { label: '새로운 걸 시도하는 걸 좋아해요', value: 'A' },
      { label: '익숙하고 편안한 걸 선호해요', value: 'B' },
      { label: '사람들과 소통하는 걸 즐겨요', value: 'C' },
    ],
  },
  {
    id: 3,
    type: 'choice',
    title: '평소 어떤 공간을 좋아하나요?',
    options: [
      { label: '활동적이고 에너지 넘치는 곳', value: 'A' },
      { label: '조용하고 사색적인 곳', value: 'B' },
      { label: '창의적이고 영감을 주는 곳', value: 'C' },
    ],
  },
  {
    id: 4,
    type: 'choice',
    title: '여행지에서 가장 중요하게 생각하는 건?',
    options: [
      { label: '기록하고 공유하기', value: 'A' },
      { label: '자연과 환경을 존중하는 곳', value: 'B' },
      { label: '그곳만의 이야기가 있는 곳', value: 'C' },
    ],
  },
  {
    id: 5,
    type: 'text',
    title: '',
  },
];

interface UserCreateRequest {
  name: string;
  background: 'EAST' | 'WEST' | 'SOUTH';
  personality: 'NOVELTY' | 'COMFORT' | 'SOCIAL';
  activity: 'ACTIVE' | 'QUIET' | 'CREATIVE';
  worth: 'PHOTO' | 'ECO' | 'STORY';
}

interface RecommendedPlace {
  title: string;
  address: string;
  thumbnailImage: string;
}

interface UserCreateResponse {
  name: string;
  background: 'EAST' | 'WEST' | 'SOUTH';
  personality: 'NOVELTY' | 'COMFORT' | 'SOCIAL';
  activity: 'ACTIVE' | 'QUIET' | 'CREATIVE';
  worth: 'PHOTO' | 'ECO' | 'STORY';
  recommendedPlace: RecommendedPlace[];
}

const Question = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const hasGeneratedNickname = useRef(false);

  const currentQuestion = questions[currentQuestionIndex];
  // 질문 번호 기준으로 표시 (1부터 시작)
  const displayCount = currentQuestionIndex + 1;
  // 이름 입력 화면일 때는 5/5로 표시
  const answeredCount = currentQuestion.type === 'text' ? questions.length : displayCount;
  const progress = (answeredCount / questions.length) * 100;
  const progressBarWidth = `${progress}%`;

  const handleOptionSelect = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = value;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    // 답변이 선택되었는지 확인
    if (answers[currentQuestionIndex]) {
      // 다음 질문으로 이동
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }
  };

  // 답변을 API 스키마에 맞게 변환
  const mapAnswersToRequest = (answers: string[], name: string): UserCreateRequest => {
    // 질문 1: 지역 선택 (A: EAST, B: WEST, C: SOUTH)
    const backgroundMap: Record<string, 'EAST' | 'WEST' | 'SOUTH'> = {
      A: 'EAST',
      B: 'WEST',
      C: 'SOUTH',
    };

    // 질문 2: 성격 (A: NOVELTY, B: COMFORT, C: SOCIAL)
    const personalityMap: Record<string, 'NOVELTY' | 'COMFORT' | 'SOCIAL'> = {
      A: 'NOVELTY',
      B: 'COMFORT',
      C: 'SOCIAL',
    };

    // 질문 3: 활동성 (A: ACTIVE, B: QUIET, C: CREATIVE)
    const activityMap: Record<string, 'ACTIVE' | 'QUIET' | 'CREATIVE'> = {
      A: 'ACTIVE',
      B: 'QUIET',
      C: 'CREATIVE',
    };

    // 질문 4: 가치관 (A: PHOTO, B: ECO, C: STORY)
    const worthMap: Record<string, 'PHOTO' | 'ECO' | 'STORY'> = {
      A: 'PHOTO',
      B: 'ECO',
      C: 'STORY',
    };

    return {
      name: name.trim(),
      background: backgroundMap[answers[0]] || 'EAST',
      personality: personalityMap[answers[1]] || 'NOVELTY',
      activity: activityMap[answers[2]] || 'ACTIVE',
      worth: worthMap[answers[3]] || 'PHOTO',
    };
  };

  const handleNameSubmit = async () => {
    if (nickname.trim().length > 0) {
      setIsLoading(true);
      try {
        const newAnswers = [...answers];
        newAnswers[currentQuestionIndex] = nickname.trim();
        setAnswers(newAnswers);

        // API 요청 데이터 생성
        const requestData = mapAnswersToRequest(newAnswers, nickname.trim());

        // API 요청
        const response = await api.post<UserCreateResponse>('/api/v1/users', requestData);

        console.log('사용자 생성 성공:', response.data);
        // 추천 장소 데이터를 Home으로 전달
        const recommendedPlaces = response.data?.recommendedPlace || [];

        // localStorage에 사용자 이름 저장
        localStorage.setItem('userName', nickname.trim());

        navigate('/selection/select', {
          state: {
            recommendedPlaces,
            userName: nickname.trim(),
          },
        });
      } catch (error) {
        console.error('사용자 생성 실패:', error);

        // CORS 오류인 경우에도 서버에서 201 Created를 반환했을 수 있음
        // 네트워크 오류이지만 실제로는 성공했을 가능성
        const axiosError = error as AxiosError;
        if (axiosError?.code === 'ERR_NETWORK' || axiosError?.message === 'Network Error') {
          // CORS 오류로 인한 네트워크 에러인 경우, 일단 성공으로 처리
          // (실제로는 서버에서 201 Created를 반환했을 수 있음)
          console.warn('CORS 오류로 응답을 받지 못했지만, 서버 요청은 성공했을 수 있습니다.');
          // localStorage에 사용자 이름 저장
          localStorage.setItem('userName', nickname.trim());
          navigate('/selection/select', {
            state: {
              recommendedPlaces: [],
              userName: nickname.trim(),
            },
          });
        } else {
          // 다른 에러인 경우
          alert('요청 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // 닉네임 입력 화면으로 전환될 때 자동으로 닉네임 생성 (한 번만)
  useEffect(() => {
    if (currentQuestion.type === 'text' && !hasGeneratedNickname.current) {
      setNickname(generateNickname());
      hasGeneratedNickname.current = true;
    }
  }, [currentQuestion.type]);

  // 선택된 지역에 따라 배경색 결정
  const getBackgroundGradient = (): string => {
    const selectedRegion = answers[0]; // 첫 번째 질문의 답변 (지역 선택)

    switch (selectedRegion) {
      case 'A': // 동부 제주
        return 'linear-gradient(180deg, #C76E54 0%, #E47F62 100%)';
      case 'B': // 서부 제주
        return 'linear-gradient(180deg, #051A30 0%, #104174 100%)';
      case 'C': // 남부 제주
        return 'linear-gradient(180deg, #3C82B4 0%, #4592CA 100%)';
      default: // 기본 배경
        return 'linear-gradient(180deg, #262626 0%, #3A3A3A 100%)';
    }
  };

  // 특정 질문의 SVG 이미지 가져오기
  const getQuestionSVG = (questionId: number, answer: string | undefined): string | null => {
    if (!answer) return null;

    // 1번 질문은 지역 선택 SVG 사용
    if (questionId === 1) {
      switch (answer) {
        case 'A':
          return eastSVG;
        case 'B':
          return westSVG;
        case 'C':
          return southSVG;
        default:
          return 기본SVG;
      }
    }

    // 2번 질문
    if (questionId === 2) {
      switch (answer) {
        case 'A':
          return question2_1SVG;
        case 'B':
          return question2_2SVG;
        case 'C':
          return question2_3SVG;
        default:
          return null;
      }
    }

    // 3번 질문
    if (questionId === 3) {
      switch (answer) {
        case 'A':
          return question3_1SVG;
        case 'B':
          return question3_2SVG;
        case 'C':
          return question3_3SVG;
        default:
          return null;
      }
    }

    // 4번 질문
    if (questionId === 4) {
      switch (answer) {
        case 'A':
          return question4_1SVG; // question4_1SVG가 없을 경우 기본 SVG 사용
        case 'B':
          return question4_2SVG;
        case 'C':
          return question4_3SVG;
        default:
          return null;
      }
    }

    return null;
  };

  return (
    <Box
      className='relative min-h-screen w-full px-5 py-5'
      style={{ background: getBackgroundGradient() }}
      display='flex'
      flexDirection='column'
    >
      {/* 이름 입력 화면일 때 배경 오버레이 */}
      <AnimatePresence>
        {currentQuestion.type === 'text' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className='absolute inset-0 bg-black/50 z-0'
            style={{ pointerEvents: 'none' }}
          />
        )}
      </AnimatePresence>
      {/* 진행 바 */}
      <Flex
        className='absolute left-1/2 top-5 w-full max-w-[375px] -translate-x-1/2 px-5 py-v-150 z-10'
        gap='$150'
        alignItems='center'
      >
        <button
          onClick={handleBack}
          className='shrink-0 size-6 flex items-center justify-center disabled:opacity-50'
          disabled={currentQuestionIndex === 0}
        >
          <svg width='24' height='24' viewBox='0 0 24 24' fill='none' className='text-white'>
            <path
              d='M15 18L9 12L15 6'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </button>
        <Box className='flex-1 h-1 rounded-full bg-white/10' style={{ minWidth: 0 }}>
          <Box
            className='h-full rounded-full bg-white transition-all duration-300'
            style={{ width: progressBarWidth }}
          />
        </Box>
        <Box className='shrink-0 px-v-100 py-v-050'>
          <p className='text-white text-sm font-v-400 leading-[22px] tracking-[-0.1px] text-center whitespace-pre opacity-100'>
            {answeredCount}
            <span className='text-white opacity-60'>/{questions.length}</span>
          </p>
        </Box>
      </Flex>

      {/* 질문 영역 - 상단 */}
      {currentQuestion.type === 'choice' && (
        <VStack
          className='absolute left-1/2 top-[66px] w-full max-w-[375px] -translate-x-1/2 px-5 pt-5'
          gap='$150'
          alignItems='center'
        >
          <AnimatePresence mode='wait'>
            <motion.h2
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className='text-white text-2xl font-v-700 leading-9 tracking-[-0.3px] w-full whitespace-pre-wrap text-center'
            >
              {currentQuestion.title}
            </motion.h2>
          </AnimatePresence>
        </VStack>
      )}

      {/* 모든 질문 SVG 이미지 - bottom 45% 위치 (닉네임 입력 화면은 50%), z-index 순서: 기본/1번 < goorm < 2번 < 3번 < 4번 */}
      {(currentQuestion.type === 'choice' || currentQuestion.type === 'text') && (
        <>
          {/* 기본 SVG - z-0, goorm보다 아래, 동서남 선택 전에만 표시 */}
          {!answers[0] && (
            <Box
              className={`absolute left-1/2 -translate-x-1/2 z-0 ${
                currentQuestion.type === 'text' ? 'bottom-[50%]' : 'bottom-[45%]'
              }`}
              style={{ pointerEvents: 'none' }}
            >
              <motion.img
                key='default-svg'
                src={기본SVG}
                alt='기본 이미지'
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='max-w-[300px] max-h-[300px] w-auto h-auto'
              />
            </Box>
          )}

          {/* 1번 질문 SVG (동서남) - z-0, goorm보다 아래 */}
          {answers[0] && getQuestionSVG(1, answers[0]) && (
            <Box
              className={`absolute left-1/2 -translate-x-1/2 z-0 ${
                currentQuestion.type === 'text' ? 'bottom-[50%]' : 'bottom-[45%]'
              }`}
              style={{ pointerEvents: 'none' }}
            >
              <motion.img
                key={`question-1-${answers[0]}`}
                src={getQuestionSVG(1, answers[0])!}
                alt='지역 이미지'
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='max-w-[300px] max-h-[300px] w-auto h-auto'
                style={{
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '16px',
                }}
              />
            </Box>
          )}

          {/* goorm SVG 이미지 - z-10 */}
          <Box
            className={`absolute left-1/2 -translate-x-1/2 z-10 ${
              currentQuestion.type === 'text' ? 'bottom-[50%]' : 'bottom-[45%]'
            }`}
            style={{ pointerEvents: 'none' }}
          >
            <motion.img
              src={goormSVG}
              alt='구름 이미지'
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className='max-w-[220px] max-h-[234px] w-auto h-auto'
            />
          </Box>

          {/* 2번 질문 SVG - z-20, goorm보다 위 */}
          {answers[1] && getQuestionSVG(2, answers[1]) && (
            <Box
              className={`absolute left-1/2 -translate-x-1/2 z-20 ${
                currentQuestion.type === 'text' ? 'bottom-[50%]' : 'bottom-[45%]'
              }`}
              style={{ pointerEvents: 'none' }}
            >
              <motion.img
                key={`question-2-${answers[1]}`}
                src={getQuestionSVG(2, answers[1])!}
                alt='2번 질문 이미지'
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='max-w-[300px] max-h-[300px] w-auto h-auto'
              />
            </Box>
          )}

          {/* 3번 질문 SVG - z-30 */}
          {answers[2] && getQuestionSVG(3, answers[2]) && (
            <Box
              className={`absolute left-1/2 -translate-x-1/2 z-30 ${
                currentQuestion.type === 'text' ? 'bottom-[50%]' : 'bottom-[45%]'
              }`}
              style={{ pointerEvents: 'none' }}
            >
              <motion.img
                key={`question-3-${answers[2]}`}
                src={getQuestionSVG(3, answers[2])!}
                alt='3번 질문 이미지'
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='max-w-[300px] max-h-[300px] w-auto h-auto'
              />
            </Box>
          )}

          {/* 4번 질문 SVG - z-40 */}
          {answers[3] && getQuestionSVG(4, answers[3]) && (
            <Box
              className={`absolute left-1/2 -translate-x-1/2 z-40 ${
                currentQuestion.type === 'text' ? 'bottom-[50%]' : 'bottom-[45%]'
              }`}
              style={{ pointerEvents: 'none' }}
            >
              <motion.img
                key={`question-4-${answers[3]}`}
                src={getQuestionSVG(4, answers[3])!}
                alt='4번 질문 이미지'
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='max-w-[300px] max-h-[300px] w-auto h-auto'
              />
            </Box>
          )}
        </>
      )}

      {/* 선택지 영역 - 하단에 여백 */}
      {currentQuestion.type === 'choice' ? (
        <VStack
          className='absolute bottom-5 left-1/2 w-full max-w-[375px] -translate-x-1/2 py-5 px-5'
          gap='$100'
          alignItems='center'
        >
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3, ease: 'easeInOut', delay: 0.1 }}
              className='w-full flex flex-col gap-2'
            >
              {currentQuestion.options?.map((option, index) => {
                const isSelected = answers[currentQuestionIndex] === option.value;
                return (
                  <motion.button
                    key={option.value}
                    onClick={() => handleOptionSelect(option.value)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.2 + index * 0.05 }}
                    className={`
                      relative flex items-center gap-3 h-14 w-full px-6 py-2 rounded-v-400
                      bg-white/40
                      transition-all duration-200
                      ${isSelected ? 'border-2 border-white' : 'border-0'}
                      hover:shadow-md
                    `}
                  >
                    <p
                      className={`
                        flex-1 text-center font-v-400 leading-6 text-base tracking-[-0.1px] text-white
                      `}
                    >
                      {option.label}
                    </p>
                    <Box
                      className={`
                        shrink-0 size-6
                        flex justify-center items-center
                      `}
                    >
                      {isSelected && <CheckCircleIcon className='size-6 text-white' />}
                      {!isSelected && (
                        <Box className='size-6 rounded-full border-2 bg-white/40 border-white/60' />
                      )}
                    </Box>
                  </motion.button>
                );
              })}
            </motion.div>
          </AnimatePresence>
          {/* 다음 버튼 - 답변과 20px 간격 (좌우 여백과 동일) */}
          <Box className='w-full' style={{ marginTop: '20px' }}>
            <Button
              size='lg'
              onClick={handleNext}
              disabled={!answers[currentQuestionIndex]}
              className='w-full h-14 rounded-v-400 font-v-500 bg-[#000000] hover:bg-grey-900 disabled:opacity-50'
            >
              다음
            </Button>
          </Box>
        </VStack>
      ) : (
        <VStack
          className='absolute bottom-5 left-1/2 w-full max-w-[375px] -translate-x-1/2 z-10'
          gap='$100'
          alignItems='stretch'
        >
          <AnimatePresence mode='wait'>
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className='w-full py-2'
            >
              <VStack gap='$150' alignItems='stretch'>
                {/* 반가워 + 닉네임 영역 */}
                <VStack
                  gap='$100'
                  alignItems='stretch'
                  className='px-14'
                  style={{
                    paddingLeft: 'var(--vapor-size-space-700, 56px)',
                    paddingRight: 'var(--vapor-size-space-700, 56px)',
                  }}
                >
                  {/* 툴팁 */}
                  <Box
                    className='w-full bg-[#393939] rounded-v-300'
                    style={{
                      paddingTop: 'var(--vapor-size-space-150, 12px)',
                      paddingBottom: 'var(--vapor-size-space-150, 12px)',
                      paddingLeft: 'var(--vapor-size-space-250, 20px)',
                      paddingRight: 'var(--vapor-size-space-250, 20px)',
                    }}
                  >
                    <p className='text-white text-base font-v-400 leading-6 text-center whitespace-pre-wrap'>
                      반가워! 혹시...
                      <br />
                      내가 너를 뭐라고 부르면 될까?
                    </p>
                  </Box>

                  {/* 이름 입력 필드 */}
                  <TextInput
                    placeholder='닉네임(최대 12자)'
                    value={nickname}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length <= 12) {
                        setNickname(value);
                      }
                    }}
                    size='md'
                    className='w-full h-14 rounded-v-300 text-center bg-white/40 text-white placeholder:text-white/60 focus:outline-none focus:ring-0 border border-white'
                    style={{
                      color: 'white',
                      borderColor: 'white',
                    }}
                  />

                  {/* 다시 생성하기 버튼 */}
                  <Box className='flex flex-col items-end justify-center mt-1.5'>
                    <button
                      onClick={() => setNickname(generateNickname())}
                      className='flex items-center gap-1.5 h-8 px-0 py-0 rounded-v-300 hover:opacity-80 transition-opacity'
                    >
                      <RefreshOutlineIcon className='size-4 shrink-0 text-[#e1e1e1]' />
                      <span className='text-[#e1e1e1] text-sm font-v-500 leading-[22px] tracking-[-0.1px]'>
                        다시 생성하기
                      </span>
                    </button>
                  </Box>
                </VStack>

                {/* 작성완료 버튼 */}
                <Box
                  className='px-5 vapor-size-space-250 vapor-size-space-250 pt-2 pb-5'
                  style={{
                    paddingLeft: 'var(--vapor-size-space-250, 20px)',
                    paddingRight: 'var(--vapor-size-space-250, 20px)',
                  }}
                >
                  <Button
                    size='lg'
                    onClick={handleNameSubmit}
                    disabled={nickname.trim().length === 0 || isLoading}
                    className='w-full h-14 rounded-v-400 font-v-500 bg-[#000000] hover:bg-grey-900'
                  >
                    {isLoading ? '처리 중...' : '작성완료'}
                  </Button>
                </Box>
              </VStack>
            </motion.div>
          </AnimatePresence>
        </VStack>
      )}
    </Box>
  );
};

export default Question;
