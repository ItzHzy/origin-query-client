import React from 'react';
import styled from 'styled-components';
import { Field, reduxForm } from 'redux-form'
import { client } from '../../api/socket'
import PrimaryButton from '../General/PrimaryButton'
import TextBox from '../General/TextBox'


const Container = styled.form`
    display: flex;
    flex-direction: column;
    position: absolute;
    height: 600px;
    width: 750px;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    background: #232627;
    border-radius: 20px;
    
    &>:nth-child(1n){
        margin-bottom: 20px;
        margin-left: auto;
        margin-right: auto;
    }

    &>:last-child{
        margin-top: auto;
        margin-bottom: 40px;
    }
`

const Header = styled.div`
    display: flex;
    flex-direction: row;
`

const Title = styled.p`
    font-size: xx-large;
    color: #d9d9d9;
`

const radioStyles = {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: "space-evenly"
}

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
    color: #d9d9d9;
`


const _CreateGamePrompt = (props) => {

    const createGame = (values) => {
        client.emit('Create Game', {
            title: values.title,
            numPlayers: values.numPlayers
        })
    }

    return (
        <Container onSubmit={props.handleSubmit(createGame)}>
            <Header>
                <Title>Create Game</Title>
            </Header>
            <TextBox width="90%" type="text" placeholder="Title" name="title"></TextBox>
            <Field component="div" style={radioStyles} name="numPlayers">
                <Input type="radio" value="1" name="numPlayers"></Input>
                <Label>1</Label>
                <Input type="radio" value="2" name="numPlayers"></Input>
                <Label>2</Label>
                <Input type="radio" value="3" name="numPlayers"></Input>
                <Label>3</Label>
                <Input type="radio" value="4" name="numPlayers"></Input>
                <Label>4</Label>
            </Field>
            <PrimaryButton type="submit" label="Create" />
        </Container>
    );
}

export default reduxForm({
    form: "createGame"
})(_CreateGamePrompt);