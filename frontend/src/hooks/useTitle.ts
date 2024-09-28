import { useEffect } from 'react';

const usePageTitle = (title: string) => {
  useEffect(() => {
    document.title = title;
  }, [title]);
};

export default usePageTitle;
