import React, { useState } from 'react';
import styled from 'styled-components'
import PageContext from './context/PageContext'
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

  const [page, setPage] = useState('builder')
  const changePage = (page) => setPage(page)

  return (
    <PageContext.Provider value={{page, changePage}}>
    <Container>
      <Tabs>
        <Logo />
        <LineBreak></LineBreak>
        <Tab src={require("./assets/builder.svg")} page='builder'/>
        <Tab src={require("./assets/stats.svg")} page='stats'/>
        <Tab src={require("./assets/game.svg")} page='builder'/>
        <Tab src={require("./assets/server.svg")} page='builder'/>
        <Tab src={require("./assets/settings.svg")} page='builder'/>
      </Tabs>
      <Activity />
    </Container>
    </PageContext.Provider>
  );
}

export default App;
