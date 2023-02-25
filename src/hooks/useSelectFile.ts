import { useState } from 'react';

const useSelectFile = () => {
  const [selectedFile, setSelectedFile] = useState<string>();

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (e.target.files?.[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }

    reader.addEventListener('load', (readEvent) => {
      if (readEvent.target?.result) {
        setSelectedFile(readEvent.target.result as string);
      }
    });
  };

  return {
    selectedFile,
    setSelectedFile,
    onSelectFile,
  };
};

export default useSelectFile;
