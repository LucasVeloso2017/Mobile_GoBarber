import React from 'react';
import { View,Text,Button } from 'react-native';

// import { Container } from './styles';

import { useAuth} from '../../context/AuthContext'

const Dashboard: React.FC = () => {

    const {signout} = useAuth()

    return (
        <View>
            <Text>Hello world</Text>
            <Button title="buttons" onPress={() => signout()}>
                <Text>Sair</Text>
            </Button>

        </View>
    );
}

export default Dashboard;