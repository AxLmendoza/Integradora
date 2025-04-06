import React from 'react'
import { View, Text } from 'react-native'
import PusherListener from './PusherListener'

export default function App() {
  return (
    <View>
      <Text>App funcionando con Pusher</Text>
      <PusherListener />
    </View>
  )
}
