import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box, Flex, VStack, TextInput, Button } from '@vapor-ui/core';
import { useNavigate } from 'react-router-dom';

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

const Question = () => {
  const navigate = useNavigate();
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
      navigate('/onboarding/completion');
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
      style={{ background: 'linear-gradient(0deg, #448AC5 0%, #A5CFE5 100%)' }}
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
                      ${isSelected ? 'border-2 border-sky-500' : 'border-0'}
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
                        shrink-0 size-6 rounded-full border-2
                        flex justify-center items-center
                        ${isSelected ? 'bg-blue-500 border-blue-500' : 'bg-white/40 border-white/60'}
                      `}
                    >
                      {isSelected && <Box className='size-3 rounded-full bg-white' />}
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
                    className='h-14 rounded-v-300 text-center bg-white/40'
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
                    size='lg'
                    onClick={handleNameSubmit}
                    disabled={nickname.trim().length === 0}
                    className='w-full h-14 rounded-v-400 font-v-500 bg-[#000000] hover:bg-grey-900'
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
