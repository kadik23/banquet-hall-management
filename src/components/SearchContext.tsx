import React, { createContext, useState } from 'react';

export const SearchContext = createContext<{
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
} | undefined>(undefined);  // On indique que le contexte peut être undefined.

export const SearchProvider: React.FC = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');

  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </SearchContext.Provider>
  );
};
