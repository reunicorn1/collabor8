import { Menu, MenuButton, MenuItem } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { AnimatePresence, motion, useAnimate, stagger } from 'framer-motion';

interface ThemeSelectorProps {
  theme: string;
  onThemeChange: (theme: string) => void;
}

const themes: Record<string, string> = {
  dracula: 'Dracula',
  eclipse: 'Eclipse',
  material: 'Material',
  monokai: 'Monokai',
  solarized: 'Solarized',
  twilight: 'Twilight',
  zenburn: 'Zenburn',
};

// animation configuration
const staggerList = stagger(0.1, { startDelay: 0.25 });

const ThemeSelector = ({ theme, onThemeChange }: ThemeSelectorProps) => {
  const [scope, animate] = useAnimate();

  return (
    <div className="relative inline-block text-left">
      <Menu>
        {({ open }) => (
          <>
            <MenuButton className="inline-flex items-center justify-between gap-2 rounded-md bg-gray-800 py-2 px-4 text-sm font-semibold text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-700">
              <span>Theme</span>{' '}
              <ChevronDownIcon className="h-4 w-4 text-white/60" />
            </MenuButton>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl border border-white/5 bg-gray-800 p-2 text-sm text-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none flex flex-col z-50"
                  ref={scope}
                >
                  <ul>
                    {Object.keys(themes).map((themeKey, index) => (
                      <motion.li
                        key={themeKey}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{
                          duration: 0.3,
                          delay: staggerList(index),
                        }}
                      >
                        <MenuItem
                          as={motion.button}
                          className={`w-full text-left rounded-md ${
                            themeKey === theme ? 'bg-gray-700' : ''
                          }`}
                        >
                          {({ active }) => (
                            <button
                              className={`w-full text-left rounded-md ${
                                active ? 'bg-white/10' : ''
                              } ${themeKey === theme ? 'bg-gray-700 text-white' : ''}`}
                              onClick={() => onThemeChange(themeKey)}
                              style={{ padding: '0.5rem 1rem' }}
                            >
                              {themes[themeKey]}
                            </button>
                          )}
                        </MenuItem>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </Menu>
    </div>
  );
};

export default ThemeSelector;
