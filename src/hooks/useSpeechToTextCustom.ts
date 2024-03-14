import useSpeechToText from "react-hook-speech-to-text";

export const useSpeechToTextCustom = () => {
  const config = {
    speechRecognitionProperties: {
      lang: 'es-PY',
      interimResults: true,
    },
    continuous: false,
    useLegacyResults: false,
  };
  // NOTA: se quita soporte para otros navegadores con google cloud
  /* if (process.env.REACT_APP_GOOGLE_API_KEY) {
    Object.assign(config, {
      crossBrowser: true,
      googleApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
      googleCloudRecognitionConfig: {
        languageCode: 'es-PY',
      },
    });
  } */

  return useSpeechToText(config);
};


