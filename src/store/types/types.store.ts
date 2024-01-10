export interface ICallStore {
    audioEnabled: boolean,
    videoEnabled: boolean,
    setAudioEnabled: (value: boolean) => void
    setVideoEnabled: (value: boolean) => void
}