import React, { useState } from 'react';
import styled from 'styled-components';
import Tab from './Tab'
import GeneralSettings from './GeneralSettings'
import ServerSettings from './ServerSettings'
import AppearenceSettings from './AppearenceSettings'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
`
const TabContainer = styled.div`
    display: flex;
    flex-direction: row;
    height: 50px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    border-bottom: solid 1px black;
    padding-left: 2%;
`
const SubContainer = styled.div`
`

const Settings = () => {
    const [currTab, changeTab] = useState("General")

    return (
        <Container>
            <TabContainer>
                <Tab isActive={currTab === "General"} label="General" onClick={() => { changeTab("General") }} />
                <Tab isActive={currTab === "Server"} label="Server" onClick={() => { changeTab("Server") }} />
                <Tab isActive={currTab === "Appearence"} label="Appearence" onClick={() => { changeTab("Appearence") }} />
            </TabContainer>
            <SubContainer>
                {(function () {
                    switch (currTab) {
                        case 'General':
                            return <GeneralSettings />;
                        case 'Appearence':
                            return <AppearenceSettings />
                        case 'Server':
                            return <ServerSettings />
                        default:
                            return <GeneralSettings />;
                    }
                })()}
            </SubContainer>
        </Container>
    );
}

export default Settings;