import {ActivityIndicator,StyleSheet} from "react-native";

export default function Espera() {
    return (
        <ActivityIndicator size="large" color="darkgoldenrod" style={[estilo.carregar]} />
    );
}

export const estilo = StyleSheet.create({
    carregar: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        left: 0,
        right: 0,
        top: 40,
        bottom: 0,
        zIndex: 1
    }
});
