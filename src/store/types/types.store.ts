export interface ICallStore {
  streamRemote: MediaStream | undefined
  setStreamRemote: (value: MediaStream | undefined) => void
  openPicture: boolean
  setOpenPicture: (value: boolean) => void
  currentCallPath: string
  setCurrentCallPath: (value: string) => void
  peerConnectionStore: RTCPeerConnection | null
  setPeerConnectionStore: (value: RTCPeerConnection | null) => void
}

export interface ICallConfigStore {
  audioEnabled: boolean
  videoEnabled: boolean
  setAudioEnabled: (value: boolean) => void
  setVideoEnabled: (value: boolean) => void
}