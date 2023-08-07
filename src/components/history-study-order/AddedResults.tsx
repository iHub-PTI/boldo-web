import React from "react";
import { AttachmentUrlType, CardAttached } from "./CardAttached";

type DiagnosticReportType = {
  attachmentNumber: string;
  attachmentUrls: AttachmentUrlType[];
  category: string;
  description: string;
  effectiveDate: string;
  id: string;
  patientId: string;
  source: string;
  sourceID: string;
  sourceType: string;
}

type PropsResults = {
  diagnosticReports: DiagnosticReportType[]
}

export const AddedResults: React.FC<PropsResults> = ({ diagnosticReports }) => {

  if (diagnosticReports?.length === 0)
    return <div className='text-sm text-cool-gray-700 mb-2 mt-3'>Aún no se han añadido resultados.</div>

  return <div className='flex flex-col mt-3'>
    <div className='text-sm text-cool-gray-700 mb-2'>Resultados añadidos</div>
    <div className='flex flex-col gap-2'>
      {diagnosticReports.map((data, idx) =>
        data.attachmentUrls.map((fileData, idy) => {
          return <CardAttached
            key={idx + idy}
            fileData={fileData}
            effectiveDate={data.effectiveDate}
            sourceType={data.sourceType} />
        })
      )}
    </div>
  </div>
}