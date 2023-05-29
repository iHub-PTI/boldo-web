import React, { createContext, useState } from 'react';


type AttachmentFilesType = {
  attachmentFiles: FileList;
  setAttachmentFiles: (value: FileList) => void;
};


export const AttachmentFilesContext = createContext<AttachmentFilesType | null>(null);


const AttachmentFilesProvider = ({children}) => {
  const [attachmentFiles, setAttachmentFiles] = useState<FileList>(new DataTransfer().files)

  return(
    <AttachmentFilesContext.Provider value={{attachmentFiles, setAttachmentFiles}}>
      {children}
    </AttachmentFilesContext.Provider>
  )
};

export default AttachmentFilesProvider;