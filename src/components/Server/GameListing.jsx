import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: row;
    width: 99%;
    padding-left: 1%;
    height: fit-content;
    color: #d9d9d9;
    border-radius: 3px;

    &:hover{
        background: #545454;
        cursor: pointer;
    }
`
const Title = styled.span`
    width: 30%;
`

const Creator = styled.span`
    width: 30%;
`

const PlayerCount = styled.span`
    width: 20%;
`

const Status = styled.span`
    width: 20%;
`

const GameListing = (props) => {
    return (
        <Container>
            <Title>{props.title}</Title>
            <Creator>{props.creator}</Creator>
            <PlayerCount>{props.numPlayers}</PlayerCount>
            <Status>{props.status}</Status>
        </Container>
    );
}

export default GameListing;