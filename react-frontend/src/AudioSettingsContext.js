import React from 'react'

// The settings for audio excerpts (duration and sample rate)
const AudioSettingsContext = React.createContext({sampleRate: 24000, excerptDuration: 5});

export const AudioSettingsProvider = AudioSettingsContext.Provider;
export default AudioSettingsContext;
