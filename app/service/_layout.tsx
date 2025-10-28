import {Stack} from 'expo-router';

export default function ServiceLayout() {
    return (
        <Stack screenOptions={{headerShown: false}}>
            <Stack.Screen name="add/add"/>
            <Stack.Screen name="detail/[id]"/>
            <Stack.Screen name="edit/[id]"/>
            <Stack.Screen name="analitics/analytics"/>
            <Stack.Screen name="exportdata/export-data"/>
        </Stack>
    );
}