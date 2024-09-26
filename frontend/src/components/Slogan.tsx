import { Box } from '@chakra-ui/react';
import CallToAction from './Buttons/CallToAction';

type SloganProps = {
  className?: string;
};

export default function Slogan({ className = '' }: SloganProps) {
  return (
    <Box className={`flex justify-center items-center ${className}`}>
      <Box className="container px-4 flex flex-col text-5xl gap-4 tracking-wide md:gap-6 font-mono md:text-8xl md:w-max">
        <Box>
          <p className='text-white font-bold before:content-["==>"] before:text-[#F16145] before:me-2'>
            code
          </p>
        </Box>
        <Box className='flex gap-2 font-bold after:content-[".."] after:text-yellow-300'>
          <p className='text-white after:ms-2 after:content-["}"] after:text-purple-800 '>
            together
          </p>
        </Box>

        <Box className={'items-center grid grid-cols-[auto_1fr] gap-4 md:grid-cols-1  md:align-middle  md:gap-6 '}>
          <p className='grid grid-cols-[auto_1fr] text-white after:font-bold md:after:content-["innovate"]'>
            <span className="self-center max-w-[200px] text-sm">
              Collaborative coding made simple. Join developers worldwide and
              create together.
            </span>
          </p>
        </Box>
        <Box className="flex items-center gap-2  before:w-[30%] before:h-6 md:before:h-14 before:bg-[#F16145]">
          <p className="text-white font-bold">faster</p>
          <span className="text-[#6699CC]">^</span>
          <span className="text-slate-300">*</span>
        </Box>
        <CallToAction
          className='mt-4 w-max !text-black !bg-white px-0 capitalize sm:!hidden hover:!scale-95 active:scale-95'
        />

      </Box>
    </Box>
  );
}
