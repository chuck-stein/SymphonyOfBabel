import React from 'react'

const AudioSettingsContext = React.createContext({sampleRate: 24000, excerptDuration: 5});

export const AudioSettingsProvider = AudioSettingsContext.Provider;
export default AudioSettingsContext;
