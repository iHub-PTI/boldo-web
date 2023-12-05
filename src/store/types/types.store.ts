export interface ICallStore {
  streamRemote: MediaStream | undefined
  setStreamRemote: (value: MediaStream | undefined) => void
  cleanStream: () => void
  setCleanStream: (cleanUp: () => void) => void
  openPicture: boolean
  setOpenPicture: (value: boolean) => void
  currentCallPath: string
  setCurrentCallPath: (value: string) => void
}

export interface ICallConfigStore {
  audioEnabled: boolean
  videoEnabled: boolean
  setAudioEnabled: (value: boolean) => void
  setVideoEnabled: (value: boolean) => void
}