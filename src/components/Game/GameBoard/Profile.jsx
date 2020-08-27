import React, { Profiler } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux'
import { client } from '../../../api/socket'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 370px;
    border-right: solid 2px black
`

const ProfilePic = styled.img`
    display: flex;
    height: 100px;
    width: 100px;
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
    font-size: x-large;
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
    justify-content: space-evenly;
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
const Question = styled.p`
    display: flex;
    height: 20px;
    width: fit-content;
    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 0px;
    font-size: x-large;
`

const Answer = styled.button`
    display: flex;
    height: fit-content;
    width: fit-content;    
    border: none;
    outline: none;
    background: none;
    color: ${props => props.color};
    margin-top: auto;
    margin-bottom: auto;
    font-size: x-large;

    &:hover{
        cursor: pointer;
    }
`

const PassBtn = styled.button`
    display: flex;
    height: fit-content;
    width: fit-content;    
    border: none;
    outline: none;
    background: none;
    color: green;
    margin-top: 10px;
    margin-left: auto;
    margin-right: auto;
    font-size: x-large;

    &:hover{
        cursor: pointer;
    }
`


const Profile = (props) => {
    const dispatch = useDispatch()
    const player = useSelector(state => state.players.find(player => player.playerID == props.playerID))

    const answerQuestion = (answer) => {
        dispatch({
            type: "SET_BINARY_QUESTION",
            payload: null
        })

        client.emit("Answer Question", answer)
    }

    const pass = () => {
        dispatch({
            type: "TAKING_ACTION",
            payload: false
        })

        client.emit("Pass")
    }
    return (
        <Container>
            <ProfilePic src={require("../../../assets/images/default-pfp.svg")} />
            <Name>{player.name}</Name>
            <SubContainer>
                <Datum>
                    <DatumIcon src={require("../../../assets/images/mana-pool.svg")} />
                    <DatumCount>{player.totalMana}</DatumCount>
                </Datum>
                <Datum>
                    <DatumIcon src={require("../../../assets/images/hand.svg")} />
                    <DatumCount>{player.handCount}</DatumCount>
                </Datum>
                <Datum>
                    <DatumIcon src={require("../../../assets/images/heart.svg")} />
                    <DatumCount>{player.lifeTotal}</DatumCount>
                </Datum>
            </SubContainer>
            <SubContainer>
                <Datum>
                    <DatumIcon src={require("../../../assets/images/exile.svg")} />
                    <DatumCount>{player.exileCount}</DatumCount>
                </Datum>
                <Datum>
                    <DatumIcon src={require("../../../assets/images/grave.svg")} />
                    <DatumCount>{player.graveCount}</DatumCount>
                </Datum>
                <Datum>
                    <DatumIcon src={require("../../../assets/images/deck.svg")} />
                    <DatumCount>{player.deckCount}</DatumCount>
                </Datum>
            </SubContainer>
            {player.binaryQuestion ?
                <>
                    <Question>{player.binaryQuestion}</Question>
                    <SubContainer>
                        <Answer color="green" onClick={() => { answerQuestion(true) }}>Yes</Answer>
                        <Answer color="red" onClick={() => { answerQuestion(false) }}>No</Answer>
                    </SubContainer>
                </> : []}
            {player.takingAction && !(player.binaryQuestion) ? <PassBtn onClick={pass}>Pass</PassBtn> : []}
        </Container>
    );
}

export default Profile;