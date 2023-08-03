import { useEffect } from 'react';

// set title for component
function useTitle(title = 'Rainbow - Ant', isOverride = false) {
  useEffect(() => {
    if (isOverride) {
      document.title = title;
    } else {
      document.title =
        title !== 'Rainbow - Ant' ? `${title} - Rainbow - Ant` : title;
    }
  }, []);

  return null;
}

export default useTitle;
