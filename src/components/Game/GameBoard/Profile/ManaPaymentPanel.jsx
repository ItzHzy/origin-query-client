import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux'
import { client } from '../../../../api/socket'
import { store } from '../../../../reducers/store';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: fit-content;
    width: 100%;
    margin-top: 10px;

`

const ManaToPay = styled.p`
    display: flex;
    margin-left: auto;
    margin-right: auto;
    margin-top: 10px;
    margin-bottom: 0px;
    font-size: x-large;
`

const Colors = styled.div`
    display: flex;
    flex-direction: row;
    height: fit-content;
    width: 100%;
    flex-wrap: wrap;
`

const Color = styled.p`
    display: flex;
    flex-direction: row;
    height: 30px;
    width: 50px;
    margin-left: auto;
    margin-right: auto;
    margin-top: 10px;
    border: 1px solid ${props => props.color};
    border-radius: 20px;
    color: black;
    justify-content: space-evenly;

    &:hover {
        cursor: pointer
    }
`

const PayManaBtn = styled.button`
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

const ManaPaymentPanel = (props) => {
    const dispatch = useDispatch()
    const manaPool = useSelector(state => state.gameStates[props.gameID].manaPool)
    const manaToPay = useSelector(state => state.gameStates[props.gameID].legalTargets)
    const manaPaying = useSelector(state => state.gameStates[props.gameID].answer)

    const payMana = () => {
        client.emit("Answer Question", manaPaying)
        store.dispatch({
            type: "CHANGE_PLAYER_STATUS",
            payload: {
                gameID: props.gameID,
                status: null
            }
        })
    }

    const addOneToPayment = (color) => {
        store.dispatch({
            type: "ADD_ONE_MANA_TO_PAYMENT",
            payload: {
                gameID: props.gameID,
                color: color
            }
        })
    }

    const subtractOneFromPayment = (color) => {
        store.dispatch({
            type: "SUBTRACT_ONE_MANA_FROM_PAYMENT",
            payload: {
                gameID: props.gameID,
                color: color
            }
        })
    }

    return (
        <Container>
            <ManaToPay>{"Pay "}{Object.keys(manaToPay).map(manaType =>
                manaType == "ManaType.GENERIC"
                    ? "{" + manaToPay[manaType] + "}"
                    : manaType == "ManaType.WHITE"
                        ? "{W}".repeat(manaToPay[manaType])
                        : manaType == "ManaType.BLUE"
                            ? "{U}".repeat(manaToPay[manaType])
                            : manaType == "ManaType.BLACK"
                                ? "{B}".repeat(manaToPay[manaType])
                                : manaType == "ManaType.RED"
                                    ? "{R}".repeat(manaToPay[manaType])
                                    : "{G}".repeat(manaToPay[manaType])
            )}</ManaToPay>

            <ManaToPay>{"Paid "}{Object.keys(manaPaying).map(color =>
                color == "Color.WHITE"
                    ? "{W}".repeat(manaPaying[color])
                    : color == "Color.BLUE"
                        ? "{U}".repeat(manaPaying[color])
                        : color == "Color.BLACK"
                            ? "{B}".repeat(manaPaying[color])
                            : color == "color.RED"
                                ? "{R}".repeat(manaPaying[color])
                                : "{G}".repeat(manaPaying[color])
            )}</ManaToPay>

            <Colors>{
                Object.keys(manaPool).map(color =>
                    color == "Color.WHITE"
                        ? <Color key={color} color="white" onClick={() => { addOneToPayment(color) }} onContextMenu={() => { subtractOneFromPayment(color) }}>
                            <p style={{ margin: "auto" }}>W {manaPool[color] - manaPaying[color]}</p>
                        </Color>
                        : color == "Color.BLUE"
                            ? <Color key={color} color="blue" onClick={() => { addOneToPayment(color) }} onContextMenu={() => { subtractOneFromPayment(color) }}>
                                <p style={{ margin: "auto" }}>U {manaPool[color] - manaPaying[color]}</p>
                            </Color>
                            : color == "Color.BLACK"
                                ? <Color key={color} color="black" onClick={() => { addOneToPayment(color) }} onContextMenu={() => { subtractOneFromPayment(color) }}>
                                    <p style={{ margin: "auto" }}>B {manaPool[color] - manaPaying[color]}</p>
                                </Color>
                                : color == "Color.RED"
                                    ? <Color key={color} color="red" onClick={() => { addOneToPayment(color) }} onContextMenu={() => { subtractOneFromPayment(color) }}>
                                        <p style={{ margin: "auto" }}>R {manaPool[color] - manaPaying[color]}</p>
                                    </Color>
                                    : <Color key={color} color="green" onClick={() => { addOneToPayment(color) }} onContextMenu={() => { subtractOneFromPayment(color) }}>
                                        <p style={{ margin: "auto" }}>G {manaPool[color] - manaPaying[color]}</p>
                                    </Color>
                )
            }</Colors>

            <PayManaBtn onClick={payMana}>Pay Mana</PayManaBtn>
        </Container>
    );
}

export default ManaPaymentPanel;