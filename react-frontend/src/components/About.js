import React, {useContext} from 'react';
import AudioSettingsContext from "../AudioSettingsContext";

function About() {
    const audioSettingsContext = useContext(AudioSettingsContext);
    const samplesPerExcerpt = audioSettingsContext.sampleRate * audioSettingsContext.excerptDuration;

    return (
        <div className='aboutParagraph'>
            <p>
                Symphony of Babel is, in essence, a collection of every possible snippet of sound. The symphony is
                divided into 35<sup>{samplesPerExcerpt.toLocaleString()}</sup> different {audioSettingsContext.excerptDuration}
                -second excerpts, and together they comprise everything you have ever heard or ever could hear (albeit
                divided into {audioSettingsContext.excerptDuration}-second chunks).

                Come, stay a while, see what the symphony has to offer. Don't be turned off by the statistical
                likelihood that every random excerpt you stumble upon will just sound like white noise. The beauty of
                the symphony is in its rare gems, which you can locate by searching using your microphone. Give it any
                sound and it will point you to the exact excerpt in the symphony where that sound occurs. That excerpt
                has been and always will be in the same place in the symphony. To prove it, copy its ID and share it with
                a friend, who can then find that same excerpt by pasting the ID in the "Browse" section. The audio you
                recorded isn't being stored anywhere. To store every excerpt would take more gigabytes than there are atoms
                in the universe, if every atom contained a universe-worth of atoms, and each of those atoms contained another
                universe, and so on, 700+ layers deep. But don't let that overwhelm you. Take peace from the notion that there's
                always more of the symphony to discover, and you will be the first to uncover many of its treasures.
            </p>
        </div>
    );
}

export default About;
