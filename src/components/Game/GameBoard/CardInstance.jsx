import React from 'react';
import styled from 'styled-components';
import ContextMenuArea from 'react-electron-contextmenu'
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
    const menuItems = [];
    if (props.card.abilities.length != 0) {
        menuItems.push({
            label: "Activate Ability",
            submenu: props.card.abilities.map(ability => {
                return {
                    label: ability[1],
                    click: () => client.emit("Take Action", ability[0])
                }
            })
        })
    }

    if (props.card.zone == "Zone.HAND") {
        menuItems.push({
            label: "Play Card",
            click: () => client.emit("Take Action", props.card.instanceID)
        })
    }

    return (
        <ContextMenuArea menuItems={menuItems}>
            <Container src={props.src} tapped={props.tapped} />
        </ContextMenuArea>
    );
}

export default CardInstance;