import React from 'react';
import styled from 'styled-components';
import TextBox from '../General/TextBox'
import RadioInput from '../General/RadioInput'
import PrimaryButton from '../General/PrimaryButton'

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
`

const Header = styled.div`
    display: flex;
    flex-direction: row;
`

const Title = styled.p`
    font-size: xx-large;
    color: #d9d9d9;
`


const CreateGamePrompt = () => {
    return (
        <Container>
            <Header>
                <Title>Create Game</Title>
            </Header>
            <TextBox width={"90%"} placeholder={"Title"}></TextBox>
            <RadioInput width="100%" options={[1, 2, 3, 4]} />
            <PrimaryButton label="Create Game" />
        </Container>
    );
}

export default CreateGamePrompt;