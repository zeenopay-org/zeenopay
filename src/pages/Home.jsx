import React from 'react'
import HeroSlider from "../components/specific/HeroSlider.jsx"
import FeatureEvents from "../components/specific/FeatureEvents.jsx"
import OngoingEvents from "../components/specific/OngoingEvents.jsx"


const Home = () => {
  return (
    <>
      <HeroSlider/>
      <FeatureEvents />
      <OngoingEvents />
    </>
  )
}

export default Home
