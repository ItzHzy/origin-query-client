import React, { useState } from 'react';
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import Activity from './Activity'
import Tab from './Tab'

const Logo = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 10px;
  margin-left: auto;
  margin-right: auto;
`

const Tabs = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 77px;
  background-color: #313537;
`

const LineBreak = styled.hr`
  margin-left: auto;
  margin-right: auto;
  width: 80%;
  height: 2px;
  background-color: #525252;
  border: none;
`

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`

const App = () => {
  const games = useSelector((state) => Object.keys(state.gameStates))

  return (
    <Container>
      <Tabs>
        <Logo />
        <LineBreak></LineBreak>
        <Tab src={require("../../assets/images/builder.svg")} activityName='BUILDER' activityID={false} />
        <Tab src={require("../../assets/images/stats.svg")} activityName='STATISTICS' activityID={false} />
        {games.map((game) => {
          return <Tab key={game + "-Tab"} src={require("../../assets/images/game.svg")} activityName='GAME' activityID={game} />
        })}
        <Tab src={require("../../assets/images/server.svg")} activityName='SERVER' activityID={false} />
        <Tab src={require("../../assets/images/settings.svg")} activityName='SETTINGS' activityID={false} />
      </Tabs>
      <Activity />
    </Container>
  );
}

export default App;
