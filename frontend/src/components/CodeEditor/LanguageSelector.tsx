import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/solid';

const languageModes = {
  javascript: 'javascript',
  python: 'python',
  c: 'text/x-csrc',
  typescript: 'javascript',
  markdown: 'markdown',
  html: 'xml',
};

function LanguageSelector({ language, onLanguageChange }) {
  return (
    <Menu as="div" className="relative">
      <MenuButton className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700">
        {language.charAt(0).toUpperCase() + language.slice(1)}
        <ChevronDownIcon className="ml-2 h-2 w-2" aria-hidden="true" />
      </MenuButton>
      <MenuItems className="absolute mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
        {Object.keys(languageModes).map((lang) => (
          <MenuItem key={lang}>
            <button
              className="block px-4 py-2 text-gray-900 hover:bg-gray-100"
              onClick={() => onLanguageChange(lang)}
            >
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </button>
          </MenuItem>
        ))}
      </MenuItems>
    </Menu>
  );
}

export default LanguageSelector;
