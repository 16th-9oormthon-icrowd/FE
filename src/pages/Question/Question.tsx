import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Flex, VStack, TextInput, Button } from '@vapor-ui/core';

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
    title: '제주에 도착했어요! 공항을 나서는 순간, 가장 먼저 하고 싶은 건 무엇인가요?',
    options: [
      { label: '바다를 향해 곧장 달려가 시원한 바람을 맞기', value: 'A' },
      { label: '근처 맛집을 찾아 지도부터 켜보기', value: 'B' },
      { label: '친구들과 인증샷 찍으며 활기차게 시작하기', value: 'C' },
    ],
  },
  {
    id: 2,
    type: 'choice',
    title: '제주 여행 중 하루를 보내는 당신의 스타일은?',
    options: [
      { label: '오름을 오르며 땀 흘리는 활동적인 하루', value: 'A' },
      { label: '카페에서 책을 읽거나 사진을 찍으며 여유로운 하루', value: 'B' },
      { label: '시장, 맛집 등 다양한 곳을 빠르게 돌아다니는 하루', value: 'C' },
    ],
  },
  {
    id: 3,
    type: 'choice',
    title: '숙소를 고를 때 가장 중요하게 생각하는 건 무엇인가요?',
    options: [
      { label: '예쁜 뷰와 감성 인테리어', value: 'A' },
      { label: '위치와 이동의 편리함', value: 'B' },
      { label: '저렴하고 깔끔한 가성비', value: 'C' },
    ],
  },
  {
    id: 4,
    type: 'choice',
    title: '제주 여행에서 가장 중요하게 생각하는 것은 무엇인가요?',
    options: [
      { label: '맛집 탐방과 현지 음식 체험', value: 'A' },
      { label: '자연 경관과 힐링', value: 'B' },
      { label: '친구들과의 추억 만들기', value: 'C' },
    ],
  },
  {
    id: 5,
    type: 'text',
    title: '',
  },
];

const Question = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [nickname, setNickname] = useState('');

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

    // 다음 질문으로 이동
    if (currentQuestionIndex < questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }, 400);
    } else {
      // 모든 질문 완료
      console.log('모든 답변:', newAnswers);
      // 여기에 결과 페이지로 이동하는 로직을 추가할 수 있습니다
    }
  };

  const handleNameSubmit = () => {
    if (nickname.trim().length > 0) {
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = nickname.trim();
      setAnswers(newAnswers);
      console.log('모든 답변:', newAnswers);
      // 여기에 결과 페이지로 이동하는 로직을 추가할 수 있습니다
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <Box
      className='relative min-h-screen w-full px-5 py-5'
      backgroundColor='#b9b9b9'
      display='flex'
      flexDirection='column'
    >
      {/* 진행 바 */}
      <Flex
        className='absolute left-1/2 top-5 w-full max-w-[375px] -translate-x-1/2 px-5 py-v-150'
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

      {/* 선택지 영역 - 하단에 여백 */}
      {currentQuestion.type === 'choice' ? (
        <VStack
          className='absolute bottom-5 left-1/2 w-full max-w-[375px] -translate-x-1/2 py-5'
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
                      bg-white
                      transition-all duration-200
                      ${isSelected ? 'border-2 border-v-primary' : 'border-0'}
                      hover:shadow-md
                    `}
                  >
                    <p
                      className={`
                        flex-1 text-center font-v-400 leading-6 text-base tracking-[-0.1px] opacity-100 left-3
                        ${isSelected ? 'text-blue-600' : 'text-[#5d5d5d]'}
                      `}
                      style={isSelected ? { color: 'var(--vapor-color-primary-600, #2563eb)' } : {}}
                    >
                      {option.label}
                    </p>
                    <Box
                      className={`
                        shrink-0 size-6 rounded-full border border-v-border-normal
                        flex justify-center
                        ${isSelected ? 'bg-v-primary border-v-primary ' : 'bg-white'}
                      `}
                    >
                      {isSelected && <Box className='size-4 rounded-full bg-v-gray-900' />}
                    </Box>
                  </motion.button>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </VStack>
      ) : (
        <VStack
          className='absolute bottom-5 left-1/2 w-full max-w-[375px] -translate-x-1/2'
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
              <VStack gap='$300' alignItems='stretch'>
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
                    className='bg-[#393939] rounded-v-300'
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
                    className='h-14 rounded-v-300 text-center'
                  />
                </VStack>

                {/* 작성완료 버튼 */}
                <Box
                  className='px-5 vapor-size-space-250 vapor-size-space-250 py-5'
                  style={{
                    paddingLeft: 'var(--vapor-size-space-250, 20px)',
                    paddingRight: 'var(--vapor-size-space-250, 20px)',
                  }}
                >
                  <Button
                    colorPalette='primary'
                    size='lg'
                    onClick={handleNameSubmit}
                    disabled={nickname.trim().length === 0}
                    className='w-full h-14 bg-[#e66f00] hover:bg-[#d46200] rounded-v-400 font-v-500'
                  >
                    작성완료
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
