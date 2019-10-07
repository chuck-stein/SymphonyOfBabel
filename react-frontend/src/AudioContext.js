import React from 'react'

const AudioContext = React.createContext({sampleRate: 24000, excerptDuration: 5});

export const AudioProvider = AudioContext.Provider;
export default AudioContext;
