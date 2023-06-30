import React, { createContext, useState } from 'react';


type AttachmentFilesType = {
  attachmentFilesForm: FileList;
  setAttachmentFilesForm: (value: FileList) => void;
};


export const AttachmentFilesFormContext = createContext<AttachmentFilesType | null>(null);


const AttachmentFilesFormProvider = ({children}) => {
  const [attachmentFilesForm, setAttachmentFilesForm] = useState<FileList>(new DataTransfer().files)

  return(
    <AttachmentFilesFormContext.Provider value={{attachmentFilesForm, setAttachmentFilesForm}}>
      {children}
    </AttachmentFilesFormContext.Provider>
  )
};

export default AttachmentFilesFormProvider;