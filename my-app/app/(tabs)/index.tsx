import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Link } from 'expo-router';

const palavras: string[] = [
  "ABACAXI", "AMARELO", "ELEFANTE", "COMPUTADOR", "CRIATIVO", "ESCRITORIO", "FOGUETE", "HISTORIA", "JANELA",
  "LAGARTO", "MELANCIA", "PARAFUSO", "QUADRO", "RELOGIO", "SAPATO", "TELEFONE", "UNICORNIO", "VIAGEM",
  "XICARA", "ZUMBI", "AVIAO", "BICICLETA", "CHOCOLATE", "DINOSSAURO", "ESTRELA", "GIRAFA", "INVERNO",
  "JACARE", "KIWI", "LIMONADA", "MARIPOSA", "NOZES", "OVO", "PINTURA", "QUEIJO", "RAIO", "SABOROSO",
  "TARTARUGA", "ULTRA", "VENTO", "XERIFE", "ZEBRA"
];

const maxTentativas: number = 6;
const alfabeto: string[] = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('');

type StatusJogo = 'jogando' | 'venceu' | 'perdeu';

export default function App(): React.JSX.Element {
  const [palavra, setPalavra] = useState<string>('');
  const [letrasAdivinhadas, setLetrasAdivinhadas] = useState<Set<string>>(new Set());
  const [tentativasRestantes, setTentativasRestantes] = useState<number>(maxTentativas);
  const [statusJogo, setStatusJogo] = useState<StatusJogo>('jogando');

  useEffect(() => {
    iniciarNovoJogo();
  }, []);

  const iniciarNovoJogo = (): void => {
    const palavraAleatoria: string = palavras[Math.floor(Math.random() * palavras.length)];
    setPalavra(palavraAleatoria);
    setLetrasAdivinhadas(new Set<string>());
    setTentativasRestantes(maxTentativas);
    setStatusJogo('jogando');
  };

  const processarAdivinhacao = (letra: string): void => {
    if (letrasAdivinhadas.has(letra) || statusJogo !== 'jogando') {
      return;
    }

    const novasLetrasAdivinhadas = new Set(letrasAdivinhadas).add(letra);
    setLetrasAdivinhadas(novasLetrasAdivinhadas);

    if (!palavra.includes(letra)) {
      setTentativasRestantes(tentativasRestantes - 1);
    }

    // Checar vitória
    const palavraExibida = palavra.split('').map(char => novasLetrasAdivinhadas.has(char) ? char : '_').join('');
    if (!palavraExibida.includes('_')) {
      setStatusJogo('venceu');
      return;
    }

    // Checar derrota
    if (tentativasRestantes - 1 === 0) {
      setStatusJogo('perdeu');
    }
  };

  const getPalavraExibida = (): string => {
    return palavra.split('').map(char => (letrasAdivinhadas.has(char) ? char : '_')).join(' ');
  };

  const renderForca = (): React.JSX.Element => {
    const partesDoCorpo: string[] = [
      'Cabeça 😵',
      'Corpo 🧍',
      'Braço Direito 🦾',
      'Braço Esquerdo 🦾',
      'Perna Direita 🦵',
      'Perna Esquerda 🦵',
    ];
    return (
      <View style={styles.forcaContainer}>
        <Text style={styles.forcaTexto}>
          {`Tentativas restantes: ${tentativasRestantes}`}
        </Text>
        <Text style={styles.forcaTexto}>
          {`Partes do corpo restantes: ${tentativasRestantes}`}
        </Text>
        {Array.from({ length: maxTentativas - tentativasRestantes }).map((_, index) => (
          <Text key={index} style={styles.parteCorpo}>
            {partesDoCorpo[index]}
          </Text>
        ))}
      </View>
    );
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Jogo da Forca</Text>
      
      {renderForca()}

      <Text style={styles.palavraExibida}>{getPalavraExibida()}</Text>

      <View style={styles.letrasUsadasContainer}>
        <Text style={styles.letrasUsadasTitulo}>Letras Usadas:</Text>
        <Text style={styles.letrasCorretas}>
          Corretas: {Array.from(letrasAdivinhadas).filter(letra => palavra.includes(letra)).join(', ')}
        </Text>
        <Text style={styles.letrasIncorretas}>
          Incorretas: {Array.from(letrasAdivinhadas).filter(letra => !palavra.includes(letra)).join(', ')}
        </Text>
      </View>

      <View style={styles.teclado}>
        {alfabeto.map((letra: string) => (
          <TouchableOpacity
            key={letra}
            style={[
              styles.botaoLetra,
              letrasAdivinhadas.has(letra) && styles.botaoLetraUsada
            ]}
            onPress={() => processarAdivinhacao(letra)}
            disabled={letrasAdivinhadas.has(letra) || statusJogo !== 'jogando'}
          >
            <Text style={styles.textoBotao}>{letra}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {statusJogo !== 'jogando' && (
        <View style={styles.statusContainer}>
          <Text style={[styles.mensagemStatus, statusJogo === 'venceu' ? styles.mensagemVitoria : styles.mensagemDerrota]}>
            {statusJogo === 'venceu' ? `Parabéns! Você venceu! 🎉` : `Você perdeu! A palavra era: ${palavra} 😔`}
          </Text>
          <TouchableOpacity style={styles.botaoReiniciar} onPress={iniciarNovoJogo}>
            <Text style={styles.textoBotaoReiniciar}>Reiniciar Jogo</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  forcaContainer: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  forcaTexto: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
  parteCorpo: {
    fontSize: 18,
    marginVertical: 2,
    color: '#555',
  },
  palavraExibida: {
    fontSize: 30,
    letterSpacing: 8,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#444',
  },
  letrasUsadasContainer: {
    marginVertical: 15,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
    alignItems: 'center',
  },
  letrasCorretas: {
    fontSize: 16,
    color: 'green',
    fontWeight: 'bold',
  },
  letrasIncorretas: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
  },
  letrasUsadasTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  teclado: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 20,
  },
  botaoLetra: {
    width: 35,
    height: 35,
    margin: 5,
    backgroundColor: '#1e90ff',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  botaoLetraUsada: {
    backgroundColor: '#ccc',
  },
  textoBotao: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusContainer: {
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
  },
  mensagemStatus: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 15,
  },
  mensagemVitoria: {
    color: 'green',
  },
  mensagemDerrota: {
    color: 'red',
  },
  botaoReiniciar: {
    backgroundColor: '#ffa500',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  textoBotaoReiniciar: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
