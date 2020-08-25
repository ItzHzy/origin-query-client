import React, { Profiler } from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 370px;
    border-right: solid 2px black
`

const ProfilePic = styled.img`
    display: flex;
    height: 150px;
    width: 150px;
    border-radius: 50%;
    oveflow: hidden;
    border: solid 2x black;
    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;
`

const Name = styled.p`
    display: flex;
    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;
    height: fit-content;
    width fit-content;
    font-size: xxx-large;
    margin-bottom: 0px;
`

const SubContainer = styled.div`
    display: flex;
    flex-direction: row;
    height: 50px;
    width: 270px;
    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;
    justify-content: space-between;
`

const Datum = styled.div`
    display: flex;
    flex-direction: row;
    height: 50px;
    width: 80px;
    justify-content: space-evenly;
`

const DatumIcon = styled.img`
    display: flex;
    height: 50px;
    width: 40px;
    margin-top: auto;
    margin-bottom: auto;
`

const DatumCount = styled.p`
    display: flex;
    height: fit-content;
    width: fit-content;
    font-size: x-large;
    margin-top: auto;
    margin-bottom: auto;
`


const Profile = (props) => {
    return (
        <Container>
            <ProfilePic src={require("../../../assets/images/default-pfp.svg")} />
            <Name>{props.player.name}</Name>
            <SubContainer>
                <Datum>
                    <DatumIcon src={require("../../../assets/images/mana-pool.svg")} />
                    <DatumCount>{props.player.totalMana}</DatumCount>
                </Datum>
                <Datum>
                    <DatumIcon src={require("../../../assets/images/hand.svg")} />
                    <DatumCount>{props.player.handCount}</DatumCount>
                </Datum>
                <Datum>
                    <DatumIcon src={require("../../../assets/images/heart.svg")} />
                    <DatumCount>{props.player.lifeTotal}</DatumCount>
                </Datum>
            </SubContainer>
            <SubContainer>
                <Datum>
                    <DatumIcon src={require("../../../assets/images/exile.svg")} />
                    <DatumCount>{props.player.exileCount}</DatumCount>
                </Datum>
                <Datum>
                    <DatumIcon src={require("../../../assets/images/grave.svg")} />
                    <DatumCount>{props.player.graveCount}</DatumCount>
                </Datum>
                <Datum>
                    <DatumIcon src={require("../../../assets/images/deck.svg")} />
                    <DatumCount>{props.player.deckCount}</DatumCount>
                </Datum>
            </SubContainer>
        </Container>
    );
}

export default Profile;