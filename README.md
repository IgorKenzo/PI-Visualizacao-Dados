# PI-Visualizacao-Dados

## Integrantes: 
- Felipe Nishino
- Igor Miyamoto
- Lucas Claro
  
-----
## Objetivo:

Mostrar as relações entre plataforma, engines e gêneros de jogos. 

-----
## Pré-Processamento:
Foi consumida a API de dados do [IGDB](https://api-docs.igdb.com/#about) e usando conteúdos aprendidos na disciplina de Ciência de Dados, denormalizando os dados e os juntando de forma a facilitar a análise.
Subimos no MongoDB e utilizamos agregações para obter o resultado desejado.

-----
## Arquivos:
Para ver o site basta acessar: https://igorkenzo.github.io/PI-Visualizacao-Dados/html/index.html

- `/html/index.html`: Página com os gráficos.
- `/data`: Dados pós-processamento, já ajeitados para visualização
- `/Pre-processing`: Script utilizado para: 
  - consumir a API;
  - fazer as modificações necessárias;
  - subir no Mongo;
  - realizar as agregações.