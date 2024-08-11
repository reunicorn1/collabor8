import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { AnimatePresence, motion } from 'framer-motion';
import { LanguageCode } from '../../utils/codeExamples';

interface LanguageSelectorProps {
  language: LanguageCode;
  onLanguageChange: (language: LanguageCode) => void;
}

const languageModes: Record<LanguageCode, string> = {
  javascript: 'javascript',
  python: 'python',
  c: 'text/x-csrc',
  typescript: 'javascript',
  markdown: 'markdown',
  html: 'xml',
};

// animation variants
const variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const LanguageSelector = ({
  language,
  onLanguageChange,
}: LanguageSelectorProps) => {
  return (
    <div className="relative inline-block text-left">
      <Menu>
        {({ open }) => (
          <>
            <MenuButton className="inline-flex items-center gap-2 rounded-md bg-gray-800 py-1.5 px-3 text-sm font-semibold text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-700">
              {language.charAt(0).toUpperCase() + language.slice(1)}
              <ChevronDownIcon className="h-5 w-5 fill-white/60" />
            </MenuButton>

            <AnimatePresence>
              {open && (
                <MenuItems
                  static
                  as={motion.div}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={variants}
                  transition={{ duration: 0.3 }}
                  className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl border border-white/5 bg-white/5 p-1 text-sm text-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none flex flex-col z-50"
                >
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(languageModes).map((lang) => (
                      <MenuItem key={lang}>
                        {({ active }) => (
                          <button
                            className={`inline-menu-item ${
                              active ? 'bg-white/10' : ''
                            }`}
                            onClick={() =>
                              onLanguageChange(lang as LanguageCode)
                            }
                          >
                            {lang.charAt(0).toUpperCase() + lang.slice(1)}
                          </button>
                        )}
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              )}
            </AnimatePresence>
          </>
        )}
      </Menu>
    </div>
  );
};

export default LanguageSelector;
