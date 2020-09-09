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

const DeclareAttacksBtn = styled.button`
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

const DeclareBlockssBtn = styled.button`
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
    const name = useSelector(state => state.gameStates[props.gameID].players[props.playerID].name)
    const life = useSelector(state => state.gameStates[props.gameID].players[props.playerID].life)
    const manaPool = useSelector(state => state.gameStates[props.gameID].players[props.playerID].manaPool)
    const zoneSizes = useSelector(state => state.gameStates[props.gameID].players[props.playerID].zoneSizes)
    const status = useSelector(state => state.gameStates[props.gameID].status)
    const hasPriority = useSelector(state => props.isYours ? state.gameStates[props.gameID].hasPriority : null)
    const question = useSelector(state => props.isYours ? state.gameStates[props.gameID].question : null)
    const answer = useSelector(state => props.isYours ? state.gameStates[props.gameID].answer : null)

    const answerQuestion = (answer) => {
        client.emit("Answer Question", answer)

        dispatch({
            type: "CHANGE_PLAYER_STATUS",
            payload: {
                gameID: props.gameID,
                status: null
            }
        })

    }

    const pass = () => {
        client.emit("Pass")
    }

    const declareAttacks = () => {
        client.emit("Declare Attacks", answer)
        dispatch({
            type: "CHANGE_PLAYER_STATUS",
            payload: {
                gameID: props.gameID,
                status: null
            }
        })
    }

    const declareBlocks = () => {
        client.emit("Declare Blocks", answer)
        dispatch({
            type: "CHANGE_PLAYER_STATUS",
            payload: {
                gameID: props.gameID,
                status: null
            }
        })
    }

    return (
        <Container>
            <ProfilePic src={require("../../../assets/images/default-pfp.svg")} />
            <Name>{name}</Name>
            <SubContainer>
                <Datum>
                    <DatumIcon src={require("../../../assets/images/mana-pool.svg")} />
                    <DatumCount>{manaPool}</DatumCount>
                </Datum>
                <Datum>
                    <DatumIcon src={require("../../../assets/images/hand.svg")} />
                    <DatumCount>{zoneSizes["Zone.HAND"]}</DatumCount>
                </Datum>
                <Datum>
                    <DatumIcon src={require("../../../assets/images/heart.svg")} />
                    <DatumCount>{life}</DatumCount>
                </Datum>
            </SubContainer>
            <SubContainer>
                <Datum>
                    <DatumIcon src={require("../../../assets/images/exile.svg")} />
                    <DatumCount>{zoneSizes["Zone.EXILE"]}</DatumCount>
                </Datum>
                <Datum>
                    <DatumIcon src={require("../../../assets/images/grave.svg")} />
                    <DatumCount>{zoneSizes["Zone.GRAVE"]}</DatumCount>
                </Datum>
                <Datum>
                    <DatumIcon src={require("../../../assets/images/deck.svg")} />
                    <DatumCount>{zoneSizes["Zone.DECK"]}</DatumCount>
                </Datum>
            </SubContainer>
            {props.isYours && status == "ANSWERING_BINARY_QUESTION" ?
                <>
                    <Question>{question}</Question>
                    <SubContainer>
                        <Answer color="green" onClick={() => { answerQuestion(true) }}>Yes</Answer>
                        <Answer color="red" onClick={() => { answerQuestion(false) }}>No</Answer>
                    </SubContainer>
                </> : []}
            {props.isYours && status == "CHOOSING_ATTACKS" ? <DeclareAttacksBtn onClick={declareAttacks}>Finish Declaring Attacks</DeclareAttacksBtn> : []}
            {props.isYours && status == "CHOOSING_BLOCKS" ? <DeclareBlockssBtn onClick={declareBlocks}>Finish Declaring Blocks</DeclareBlockssBtn> : []}
            {props.isYours && hasPriority && !status ? <PassBtn onClick={pass}>Pass</PassBtn> : []}
        </Container>
    );
}

export default Profile;