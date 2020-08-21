import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    width: fit-content;
    padding-right: 5px;
    padding-left: 5px;
    margin-left: 2px;
    font-size: larger;
    font-weight: normal;
    border-bottom: ${props => props.isActive ? "solid 4px #f294cbd9" : "solid 4px none"};

    & > p{
        height: fit-content;
        width: fit-content;
        margin: auto;
        color: ${props => props.isActive ? "#b7b7b7" : "#949494"};
    }

    &:hover{
        cursor: pointer;
    }
`

const Tab = (props) => {
    return (
        <Container isActive={props.isActive} onClick={props.onClick}><p>{props.label}</p></Container>
    );
}

export default Tab;