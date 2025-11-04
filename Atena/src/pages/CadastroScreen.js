import React, { useState } from "react";
import { View, Text, TextInput, Alert, StyleSheet, Image, TouchableOpacity } from "react-native";
import { supabase } from "../services/supabaseClient";

export default function CadastroScreen({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleCadastro = async () => {
    if (!nome || !email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }

    try {
      setCarregando(true);

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email.trim(),
        password: senha,
      });

      if (authError) throw authError;

      const user = authData.user;
      if (!user) throw new Error("Erro ao criar usuário na autenticação.");

      const { error: dbError } = await supabase.from("usuarios").insert([
        { id: user.id, nome, email: email.trim(), senha },
      ]);

      if (dbError) throw dbError;

      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      navigation.replace("Login");

    } catch (error) {
      console.error(error);
      Alert.alert("Erro ao cadastrar", error.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.background}>
      <View style={styles.container}>
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <Text style={styles.title}>Crie sua conta</Text>

        <TextInput
          placeholder="Nome completo"
          style={styles.input}
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          placeholder="E-mail"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          placeholder="Senha"
          secureTextEntry
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity
          style={[styles.button, carregando && { opacity: 0.7 }]}
          onPress={handleCadastro}
          disabled={carregando}
        >
          <Text style={styles.buttonText}>
            {carregando ? "Cadastrando..." : "Cadastrar"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.replace("Login")}>
          <Text style={styles.link}>Já tem conta? Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#023E8A", // azul escuro
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  logo: {
    width: 140,
    height: 130,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#023E8A",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    backgroundColor: "#fff",
  },
  button: {
    width: "100%",
    backgroundColor: "#1E3A5F",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  link: {
    color: "#0077B6",
    marginTop: 15,
    textDecorationLine: "underline",
  },
});
