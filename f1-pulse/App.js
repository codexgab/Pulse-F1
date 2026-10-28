
import React, { useState, useEffect } from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Linking,  ActivityIndicator} from 'react-native';

export default function App() {
  const [verTodos, setVerTodos] = useState(false);
  const [pilotos, setPilotos] = useState([]);
  const [proximaCorrida, setProximaCorrida] = useState(null);
  const [verDetalhes, setVerDetalhes] = useState(false);
  const [noticias, setNoticias] = useState([]);
const [carregandoNoticias, setCarregandoNoticias] = useState(true);

  useEffect(() => {
    async function buscarPilotos() {
      try {
        const resposta = await fetch(
          'https://api.jolpi.ca/ergast/f1/2026/driverStandings.json'
        );

        const dados = await resposta.json();
        const lista = dados.MRData.StandingsTable.StandingsLists[0].DriverStandings;

        setPilotos(lista.map((item) => ({
          id: item.Driver.driverId,
          nome: item.Driver.givenName + ' ' + item.Driver.familyName,
          equipe: item.Constructors[0]?.name || 'Equipe não informada',
        })));
      } catch (erro) {
        console.log('Erro:', erro);
      }
    }

    buscarPilotos();
  }, []);
  
useEffect(() => {
  async function buscarCorrida() {
    try {
      const resposta = await fetch(
        'https://api.jolpi.ca/ergast/f1/2026.json'
      );

      const dados = await resposta.json();
      const corridas = dados.MRData.RaceTable.Races;

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const proxima = corridas.find((corrida) => {
  const data = new Date(corrida.date + 'T12:00:00');
  return data >= hoje;
});

      setProximaCorrida(proxima || null);
    } catch (erro) {
      console.log('Erro ao buscar corrida:', erro);
    }
  }

  buscarCorrida();
}, []);
useEffect(() => {
  async function buscarNoticias() {
    try {
      const resposta = await fetch(
        'https://gnews.io/api/v4/search?q=Formula%201&lang=en&max=3&apikey=50c00299d71df57170aac0796f102897'
      );

      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error('Não foi possível carregar as notícias.');
      }

      setNoticias(dados.articles || []);
    } catch (erro) {
      console.log('Erro ao buscar notícias:', erro);
    } finally {
      setCarregandoNoticias(false);
    }
  }

  buscarNoticias();
}, []);


  return (
   
<ScrollView
  style={styles.container}
  contentContainerStyle={styles.conteudoTela}
  showsVerticalScrollIndicator={true}
  scrollEnabled={true}
>
      <View style={styles.header}>
        <Image
          source={require('./assets/logof1.png')}
          style={styles.imagem}
        />
        <Text style={styles.titulo}>PULSE</Text>
      </View>

    
      <View style={styles.banner}>
        <Image
          source={require('./assets/destaque.png')}
          style={styles.fotoBanner}
        />

        <View style={styles.conteudo}>
          <Text style={styles.etiqueta}>PRÓXIMA CORRIDA</Text>
         <Text style={styles.nomeGP}>
  {proximaCorrida
    ? proximaCorrida.raceName
    : 'Carregando calendário...'}
</Text>
<Text style={styles.dataGP}>
  {proximaCorrida
    ? new Date(proximaCorrida.date + 'T12:00:00')
        .toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'short',
        })
        .toUpperCase()
    : ''}
</Text>
        
<TouchableOpacity
  style={styles.botao}
  onPress={() => setVerDetalhes(!verDetalhes)}
>
  <Text style={styles.txtBotao}>
    {verDetalhes ? 'FECHAR DETALHES' : 'VER DETALHES'}
  </Text>
</TouchableOpacity>

        </View>
        
{verDetalhes && proximaCorrida && (
  <View style={styles.detalhes}>
    <Text style={styles.tituloDetalhes}>
      {proximaCorrida.Circuit.circuitName}
    </Text>

    <Text style={styles.txtDetalhes}>
      Local: {proximaCorrida.Circuit.Location.locality}
    </Text>

    <Text style={styles.txtDetalhes}>
      País: {proximaCorrida.Circuit.Location.country}
    </Text>

    <Text style={styles.txtDetalhes}>
      Data: {new Date(
        proximaCorrida.date + 'T12:00:00'
      ).toLocaleDateString('pt-BR')}
    </Text>
  </View>
)}

      </View>

   
      <View style={styles.classificacao}>
        <Text style={styles.tituloClassificacao}>
          CLASSIFICAÇÃO
        </Text>

        {pilotos.slice(0, verTodos ? pilotos.length : 3).map((piloto) => (
          <View key={piloto.id} style={styles.linhaPiloto}>
            <Text style={styles.nomePiloto}>{piloto.nome}</Text>
            <Text style={styles.equipePiloto}>{piloto.equipe}</Text>
          </View>
        ))}

        <TouchableOpacity
          style={styles.botao}
          onPress={() => setVerTodos(!verTodos)}
        >
          <Text style={styles.txtBotao}>
            {verTodos ? 'VER MENOS' : 'VER TODOS'}
          </Text>
        </TouchableOpacity>
      </View>

    
<View style={styles.secaoNoticias}>
  <Text style={styles.tituloClassificacao}>
    NOTÍCIAS
  </Text>

  {[
    {
      id: '1',
      categoria: 'GP DOS ESTADOS UNIDOS',
      titulo: 'Antonelli vence em Austin e se aproxima do título',
      descricao: 'O piloto da Mercedes conquista mais uma vitória na temporada de 2026.',
      fonte: 'Formula 1',
      url: 'https://www.formula1.com/en/latest/article/antonelli-surges-to-dominant-victory-in-united-states-grand-prix-ahead-of-leclerc-and-verstappen.6kmBQv9FNTW7LzkDj8S34j'
    },
    {
      id: '2',
      categoria: 'MERCEDES',
      titulo: 'Russell busca respostas após corrida difícil',
      descricao: 'O britânico terminou em oitavo lugar no GP dos Estados Unidos.',
      fonte: 'Formula 1',
      url: 'https://www.formula1.com/en/latest/article/russell-at-a-loss-to-explain-united-states-gp-struggles-as-mercedes-man-finishes-in-p8.4RRUvKCTx9siOaCCBh4xah'
    },
    {
      id: '3',
      categoria: 'ANÁLISE',
      titulo: 'Mercedes precisa resolver problemas no carro de Russell',
      descricao: 'Uma análise sobre as dificuldades recentes do piloto na temporada.',
      fonte: 'Autosport',
      url: 'https://www.autosport.com/f1/news/mercedes-has-a-russell-sized-problem-and-it-is-sharing-responsibility/10868909/'
    }
  ].map((noticia) => (
    <View key={noticia.id} style={styles.cardNoticia}>
    <Image
  source={
    noticia.id === '1'
      ? require('./assets/antonelli.jpg')
      : noticia.id === '2'
      ? require('./assets/russell.jpg')
      : require('./assets/carro.jpg')
  }
  style={styles.imagemNoticia}
/>

      <View style={styles.conteudoNoticia}>
        <Text style={styles.etiquetaNoticia}>
          {noticia.categoria}
        </Text>

        <Text style={styles.tituloNoticia}>
          {noticia.titulo}
        </Text>

        <Text style={styles.descricaoNoticia}>
          {noticia.descricao}
        </Text>

        <Text style={styles.fonteNoticia}>
          Fonte: {noticia.fonte}
        </Text>

        <TouchableOpacity
          style={styles.botao}
          onPress={() => Linking.openURL(noticia.url)}
        >
          <Text style={styles.txtBotao}>
            LER MATÉRIA ↗
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  ))}
</View>


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  header: {
    height: 75,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginTop: 15,
  },

  imagem: {
    width: 220,
    height: 200,
    resizeMode: 'contain',
    marginLeft: -20,
  },

  titulo: {
    color: '#fff',
    fontSize: 24,
    marginLeft: -30,
  },

  banner: {
    width: '90%',
    height: 210,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 25,
    overflow: 'hidden',
    justifyContent: 'center',
  },

  fotoBanner: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
  },

  conteudo: {
    position: 'absolute',
    top: 15,
    left: 15,
  },

  etiqueta: {
    color: '#fff',
    backgroundColor: '#e10600',
    fontSize: 11,
    fontWeight: 'bold',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },

  nomeGP: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },

  botao: {
    backgroundColor: '#e10600',
    padding: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 10,
  },

  txtBotao: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },

  classificacao: {
    margin: 15,
  },

  tituloClassificacao: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  linhaPiloto: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingVertical: 12,
  },

  nomePiloto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  equipePiloto: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 4,
  },
  dataGP: {
  color: '#fff',
  fontSize: 16,
  marginBottom: 10,
},

detalhes: {
  marginHorizontal: 20,
  marginTop: 12,
  padding: 15,
  backgroundColor: '#1a1a1a',
  borderRadius: 12,
},

tituloDetalhes: {
  color: '#fff',
  fontSize: 17,
  fontWeight: 'bold',
  marginBottom: 8,
},

txtDetalhes: {
  color: '#ccc',
  fontSize: 14,
  marginTop: 5,
},
conteudoTela: {
  paddingBottom: 30,
},
secaoNoticias: {
  marginHorizontal: 15,
  marginTop: 10,
},

cardNoticia: {
  backgroundColor: '#171717',
  borderRadius: 15,
  overflow: 'hidden',
  marginTop: 12,
  borderWidth: 1,
  borderColor: '#333',
},

imagemNoticia: {
  width: '100%',
  height: 170,
  resizeMode: 'cover',
},

conteudoNoticia: {
  padding: 15,
},

etiquetaNoticia: {
  color: '#e10600',
  fontSize: 11,
  fontWeight: 'bold',
},

tituloNoticia: {
  color: '#fff',
  fontSize: 19,
  fontWeight: 'bold',
  marginTop: 8,
},

descricaoNoticia: {
  color: '#bbb',
  fontSize: 13,
  marginTop: 8,
  lineHeight: 19,
},

});
