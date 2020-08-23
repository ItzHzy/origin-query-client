import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    width: ${props => props.width};
    margin-left: auto;
    margin-right: auto;
    color: white;
`
const Input = styled.input`
    height: 20px;
    width: 20px;

    &:hover{
        cursor: pointer;
    }
`

const Label = styled.label`
    font-size: x-large;
    margin-left: 10px;
`

const RadioInput = (props) => {
    return (
        <Container width={props.width}>
            {props.options.map((option) => {
                return <div key={option}>
                    <Input type="radio" name="numPlayers" value={option}></Input>
                    <Label>{option}</Label>
                </div>
            })}
        </Container>
    );
}

export default RadioInput;