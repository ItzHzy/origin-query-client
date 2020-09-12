import React from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux'
const { remote } = require('electron')
const { Menu, MenuItem } = remote
import { client } from '../../../api/socket'

const Container = styled.img`
    display: flex;
    height: 90%;
    margin-top: auto;
    margin-bottom: auto;
    transform: ${props => props.tapped ? "rotate(90deg)" : "none"};

    &:hover{
        display: relative;
        z-index: 100;
        cursor: pointer;
    }
`

const CardInstance = (props) => {
    const dispatch = useDispatch()
    const card = useSelector(state => state.gameStates[props.gameID].cards[props.instanceID])
    const legalTargets = useSelector(state => state.gameStates[props.gameID].legalTargets)


    const createContextMenu = (e) => {
        e.preventDefault()
        const menu = new Menu()

        if (card.zone == "Zone.FIELD" && card.types.includes("Type.CREATURE")) {
            menu.append(new MenuItem({
                label: "Declare Attack On",
                submenu: legalTargets.map(opponent => {
                    return {
                        label: opponent.name,
                        click: () => dispatch({
                            type: "DECLARE_ATTACK",
                            payload: {
                                gameID: props.gameID,
                                attacker: card.instanceID,
                                defender: opponent.playerID
                            }
                        })
                    }
                })
            }))
        }

        if (card.abilities.length != 0) {
            menu.append(new MenuItem({
                label: "Activate Ability",
                submenu: card.abilities.map(ability => {
                    return {
                        label: ability[1],
                        click: () => client.emit("Take Action", ability[0])
                    }
                })
            }))
        }

        if (card.zone == "Zone.HAND") {
            menu.append(new MenuItem({
                label: "Play Card",
                click: () => client.emit("Take Action", card.instanceID)
            }))
        }

        menu.popup({ window: remote.getCurrentWindow() })
    }

    return (
        <Container src={card.src} tapped={card.tapped} onContextMenu={createContextMenu} />
    );
}

export default CardInstance;