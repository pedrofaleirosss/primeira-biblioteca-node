import chalk from 'chalk';
import fs from 'fs';
import pegaArquivo from './index.js';
import listaValidada from './http-validacao.js';

const caminho = process.argv;

async function imprimeLista (valida, resultado, identificador = '') {
    if (valida) {
        console.log(
            chalk.black.bgGreen(identificador),
            chalk.yellow('Lista de links validados:'),
            await listaValidada(resultado));
    }   else {
        console.log(
            chalk.black.bgGreen(identificador),
            chalk.yellow('Lista de links:'),
            resultado);
    }

}

async function processaTexto (argumentos) {
    const caminho = argumentos[2];
    const valida = argumentos[3] === 'valida';

    try {
        fs.lstatSync(caminho);
    } catch (erro) {
        if (erro.code === 'ENOENT') {
            console.log(chalk.red('Arquivo ou diretório não encontrado.'));
            return;
        }
    }

    if (fs.lstatSync(caminho).isFile()) {
        const listaLinks = await pegaArquivo(caminho);
        imprimeLista(valida, listaLinks);
    }
    else if (fs.lstatSync(caminho).isDirectory()) {
        const arquivos = await fs.promises.readdir(caminho);
        arquivos.forEach(async (nomeDoArquivo) => {
            const listaLinks = await pegaArquivo(`${caminho}/${nomeDoArquivo}`);
            imprimeLista(valida, listaLinks, nomeDoArquivo);
        });
    }

}

processaTexto(caminho);


