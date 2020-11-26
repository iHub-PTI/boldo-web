import React, { useCallback, useState } from 'react'

//
// Just for debugging!
//

const initialSdpStats = {
  stable: 0,
  'have-local-offer': 0,
  'have-remote-offer': 0,
  'have-local-pranswer': 0,
  'have-remote-pranswer': 0,
  closed: 0,
  current: '',
}
type SdpStats = typeof initialSdpStats
type SdpState = keyof Omit<SdpStats, 'current'>

const initialIceStats = {
  new: 0,
  checking: 0,
  connected: 0,
  completed: 0,
  failed: 0,
  disconnected: 0,
  closed: 0,
  current: '',
}
type IceStats = typeof initialIceStats
type IceState = keyof Omit<IceStats, 'current'>

export type SetDebugValueFn = ({ iceState, sdpState }: { iceState?: IceState; sdpState?: SdpState }) => void

export const useWebRTCDebugger = (active: boolean) => {
  const [sdpStats, setSdpStats] = useState<SdpStats>(initialSdpStats)
  const [iceStats, setIceStats] = useState<IceStats>(initialIceStats)

  const setDebugValue = useCallback(
    ({ iceState, sdpState }: { iceState?: IceState; sdpState?: SdpState }) => {
      if (!active) return
      if (iceState)
        setIceStats(iceStats => {
          const value = iceStats[iceState] + 1
          return { ...iceStats, [iceState]: value, current: iceState }
        })
      if (sdpState)
        setSdpStats(sdpStats => {
          const value = sdpStats[sdpState] + 1
          return { ...sdpStats, [sdpState]: value, current: sdpState }
        })
    },
    [active]
  )

  return { sdpStats, iceStats, setDebugValue, active }
}

export const WebRTCStats = ({
  sdpStats,
  iceStats,
  active,
}: {
  sdpStats: SdpStats
  iceStats: IceStats
  active: boolean
}) => {
  if (!active) return null
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center pointer-events-none top-20 text-xxs'>
      <div className='p-6 m-2 bg-white rounded-sm'>
        <h3 className='font-bold'>SDP Offers</h3>
        <div className='grid grid-cols-2 gap-1'>
          <span className='font-semibold'>current:</span>
          <span>{sdpStats.current}</span>

          <span>stable</span>
          <span>{sdpStats['stable']}</span>

          <span>have-local-offer</span>
          <span>{sdpStats['have-local-offer']}</span>

          <span>have-remote-offer</span>
          <span>{sdpStats['have-remote-offer']}</span>

          <span>have-local-pranswer</span>
          <span>{sdpStats['have-local-pranswer']}</span>

          <span>have-remote-pranswer</span>
          <span>{sdpStats['have-remote-pranswer']}</span>

          <span>closed</span>
          <span>{sdpStats['closed']}</span>
        </div>
      </div>
      <div className='p-6 m-2 bg-white rounded-sm'>
        <h3 className='font-bold text-md'>ICE connection state</h3>
        <div className='grid grid-cols-2 gap-1'>
          <span className='font-semibold'>current:</span>
          <span>{iceStats.current}</span>

          <span>new</span>
          <span>{iceStats['new']}</span>

          <span>checking</span>
          <span>{iceStats['checking']}</span>

          <span>connected</span>
          <span>{iceStats['connected']}</span>

          <span>completed</span>
          <span>{iceStats['completed']}</span>

          <span>failed</span>
          <span>{iceStats['failed']}</span>

          <span>disconnected</span>
          <span>{iceStats['disconnected']}</span>

          <span>closed</span>
          <span>{iceStats['closed']}</span>
        </div>
      </div>
    </div>
  )
}
