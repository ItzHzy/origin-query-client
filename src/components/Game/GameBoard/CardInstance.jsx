import React from 'react';
import styled from 'styled-components';
import ContextMenuArea from 'react-electron-contextmenu'
import { useDispatch, useSelector } from 'react-redux'
import { client } from '../../../api/socket'

const Container = styled.img`
    display: flex;
    width: auto;
    height: 100%;
    transform: ${props => props.tapped ? "rotate(90deg)" : "none"};

    &:hover{
        display: relative;
        z-index: 100;
        cursor: pointer;
    }
`

const CardInstance = (props) => {
    const card = useSelector(state => state.gameStates[props.gameID].cards[props.instanceID])
    const opponents = useSelector(state => state.gameStates[props.gameID].opponents)
    const canAttack = useSelector(state => card.zone == "Zone.FIELD" && card.types.includes("Type.CREATURE") && card.controller == state.gameStates[props.gameID].playerID && state.gameStates[props.gameID].declaringAttacks)
    const dispatch = useDispatch()
    const menuItems = [];

    if (canAttack) {
        menuItems.push({
            label: "Declare Attack On",
            submenu: opponents.map(opponent => {
                return {
                    label: opponent,
                    click: () => client.emit("Take Action", opponent)
                }
            })
        })
    }


    if (card.abilities.length != 0) {
        menuItems.push({
            label: "Activate Ability",
            submenu: card.abilities.map(ability => {
                return {
                    label: ability[1],
                    click: () => client.emit("Take Action", ability[0])
                }
            })
        })
    }

    if (card.zone == "Zone.HAND") {
        menuItems.push({
            label: "Play Card",
            click: () => client.emit("Take Action", card.instanceID)
        })
    }

    return (
        <ContextMenuArea menuItems={menuItems}>
            <Container src={card.src} tapped={card.tapped} />
        </ContextMenuArea>
    );
}

export default CardInstance;