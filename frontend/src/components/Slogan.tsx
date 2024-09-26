/* eslint-disable prettier/prettier */
import { Box, Center } from '@chakra-ui/react';
import CallToAction from './Buttons/CallToAction';

export default function Slogan() {
  return (
    <>
    <Center>
      <Box
        className={`flex justify-center items-center mt-[110px] pl-[10px] pr-[10px] md:min-h-screen"`}
      >
        <Box className="container px-4 flex flex-col text-5xl sm:text-7xl md:text-8xl gap-4 tracking-wide md:gap-6 font-mono md:text-8xl md:w-max">
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

          <Box
            className={
              'items-center grid grid-cols-[auto_1fr] gap-4 md:grid-cols-1  md:align-middle  md:gap-6 '
            }
          >
            <p className="grid grid-cols-[auto_1fr] text-white after:font-bold">
              <span className="self-center w-[90px] sm:w-[140px] md:w-[190px] text-[7px] sm:text-[10px] md:text-xs">
                Collaborative coding made simple. Join developers worldwide and
                create together.
              </span>
              <p className="text-white font-bold after:ms-2 after:text-purple-800 ">
                innovate
              </p>
            </p>
          </Box>
          <Box className="flex items-center gap-2  before:w-[23%] before:h-6 md:before:h-14 before:bg-[#F16145]">
            <p className="text-white font-bold ml-1">faster</p>
            <span className="text-[#6699CC]">^</span>
            <span className="text-slate-300">*</span>
          </Box>
          <Center>
          <CallToAction className="mt-4 w-max !text-black !bg-white px-0 capitalize  hover:!scale-95 active:scale-95" />
          </Center>
        </Box>
      </Box>
    </Center>
    </>
  );
}
