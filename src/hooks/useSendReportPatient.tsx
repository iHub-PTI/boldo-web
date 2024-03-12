import { useCallback, useState } from 'react';
import { sendReportPatiend } from '../services/services';

interface Props {
  patientId: string;
  encounterId: string;
}

const useSendReportPatient = ({ patientId, encounterId }:Props) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSendReportPatient = useCallback(async (commentReason:string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await sendReportPatiend(patientId, encounterId, commentReason);
      setData(res.data)
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [patientId, encounterId]);

  return { data, loading, error, fetchSendReportPatient };
};

export default useSendReportPatient;
