import React,{ useRef,useCallback } from 'react';
import { View,ScrollView,Image,KeyboardAvoidingView,Platform,TextInput,Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native'
import * as Yup from 'yup'

import { Form } from '@unform/mobile'
import { FormHandles } from '@unform/core'
import validationErrors from '../../utils/validationErrors';

import LogoImg from '../../assets/logo.png'
import Input from '../../components/Input'
import Button from '../../components/Button'

import api from '../../services/api'

import { Container,Title,BackToSigninButton,BackToSigninButtonText } from './styles';

interface SignupFormData{
  name:string
  email:string
  password:string
}

const Signup: React.FC = () => {

  const formRef = useRef<FormHandles>(null)
  const navigation = useNavigation()

  const emailInputRef= useRef<TextInput>(null)
  const passwordInputRef= useRef<TextInput>(null)

  const handleSubmit=useCallback( async(data:SignupFormData)=>{
    try{

      formRef.current?.setErrors({})

      const schema = Yup.object().shape({
        name:Yup.string().required('O Nome é obrigatorio'),
        email:Yup.string().required('O Email é obrigatorio').email('Digite um e-mail Valido'),
        password:Yup.string().min(6,'Mínimo de 6 digitos')
      })

      await schema.validate(data,{
        abortEarly:false
      })

      await api.post('/users',data)

      Alert.alert('Opa seu cadastro foi realizado com sucesso !!!','Você ja pode fazer o login.')

      navigation.navigate('Signin')

    }catch(e){

      if(e instanceof Yup.ValidationError){
        const errors = validationErrors(e)
        formRef.current?.setErrors(errors)    
        return
      }

      Alert.alert(
        'Erro na Autenticação',
        'Ocorreu um erro ao fazer login cheque as credenciais'
      )     
    } 
  },[navigation])

  return(
    <>
    <KeyboardAvoidingView enabled style={{flex:1}} behavior={Platform.OS === 'ios' ? 'padding' : undefined }>
      <ScrollView
        contentContainerStyle={{flex:1}}
        keyboardShouldPersistTaps="handled"
      >
        <Container>
          <Image source={LogoImg}/>
          
          <View>
            <Title>Faça seu Cadastro</Title>
          </View>
          
          <Form ref={formRef} onSubmit={handleSubmit}>
            
            <Input 
              autoCorrect={false}
              autoCapitalize="words"
              name="name" 
              icon="user" 
              placeholder="Nome"
              returnKeyType="next"
              onSubmitEditing={()=>{ emailInputRef.current?.focus()}}
            />
            <Input 
              ref={emailInputRef}
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
              name="email" 
              icon="mail" 
              placeholder="E-mail"
              returnKeyType="next"
              onSubmitEditing={()=>{ passwordInputRef.current?.focus()}}
            />
            <Input 
              ref={passwordInputRef}
              secureTextEntry
              name="password" 
              icon="lock" 
              placeholder="Senha"
              returnKeyType="send"
              onSubmitEditing={()=>{ formRef.current?.submitForm() }}
            />
          
          </Form>

          <Button onPress={()=>{ formRef.current?.submitForm() }}>Criar</Button>

        </Container>
      </ScrollView>
    </KeyboardAvoidingView>

      <BackToSigninButton onPress={()=>navigation.goBack()}>
        <Icon name="arrow-left" size={20} color="#fff"/>
        <BackToSigninButtonText>Voltar para login</BackToSigninButtonText>
      </BackToSigninButton>
    </>
  );
}

export default Signup;