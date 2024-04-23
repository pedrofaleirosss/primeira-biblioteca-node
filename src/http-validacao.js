function extraiLinks (listaLinks) {
    return listaLinks.map((objetoLink) => Object.values(objetoLink).join());
}

async function checaStatus (listaURLs) {
    const listaStatus = await Promise.all(
        listaURLs.map(async (url, indice) => {
            try {
                const response = await fetch(url, {method: 'HEAD'});
                return `${response.status} - ${response.statusText}`
            } catch (erro) {
                return manejaErros(erro);
            }
        })  
    );
    
    return listaStatus;
}

function manejaErros (erro) {
    if (erro.cause.code === 'ENOTFOUND') {
        return 'Link não encontrado.'
    } else {
        return 'Ocorreu algum erro...'
    }
}

export default async function listaValidada (listaLinks) {
    const links = extraiLinks(listaLinks);
    const status = await checaStatus(links);
    
    return listaLinks.map((objeto, indice) => ({
        ...objeto,
        status: status[indice],
    }));
}

