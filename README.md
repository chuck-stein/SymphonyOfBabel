# Symphony of Babel
<https://www.symphonyofbabel.com/>

Symphony of Babel is a web app containing a collection of every possible snippet of sound. It is inspired by Jonathon Basile's website
[Library of Babel](https://libraryofbabel.info/), which is the same concept except using text instead of audio.

The "symphony" is divided into 35<sup>120,000</sup> different 5-second excerpts, and together they comprise everything you have ever heard
or ever could hear (albeit divided into 5-second chunks).

## Current Features

### Random

Find a random audio excerpt from the symphony. Statistically, this will almost always be white noise, as a random page from the Library of
Babel will almost always be gibberish. Fortunately, there are more compelling ways to explore the symphony... 

### Browse

Locate a specific excerpt given its Excerpt ID, which you can copy from any audio excerpt that you or any friend discovers in the symphony.

### Search

Record your own audio and find where that audio lies in the Symphony of Babel. It will always be in the same place, and always has been, so
you can share it with friends by giving them the Excerpt ID.

## Future Features

- Search by uploading audio files
- More concise Excerpt IDs
- Unique URL for each excerpt
  - Provides easier means of sharing Excerpts
  - Dependent on feasibility of short Excerpt IDs
- Symphony subdivisions
  - Symphony contains many Movements
  - Movements contain many Sections
  - Sections contain many Phrases
  - Phrases contain many Measures
  - Measures contain many Excerpts
  - Provide navigation throughout this hierarchy, as another way to explore
- Navigation to next/previous excerpt
  - Additional ability to skip forward 10 or back 10 (or even 100 or 1000)
    - Allows for discovering excerpts similar — but not indistinguishably so — to the current excerpt
- Ability to rate/favorite excerpts
- Ability to add descriptive tags to excerpts
- Section for excerpts you've previously discovered
- Section for popular excerpts
  - Button for random popular excerpt
    - More interesting than random white noise
- Some way of randomly searching excerpts more interestingly
  - Integration with an API for a sound database?
  - Algorithm for making random audio buffers that aren't white noise?
  - Machine learning model for generating audio data based on previously recorded/uploaded search queries & files?
    - Potential security implications if using recorded audio from users as training data

## Built Using

- [Flask](https://github.com/pallets/flask)
- [React](https://github.com/facebook/react)
- [Create React App](https://github.com/facebook/create-react-app)
- [React Router](https://github.com/ReactTraining/react-router)
- [Axios](https://github.com/axios/axios)
