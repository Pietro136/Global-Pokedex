// <<<<<<< HEAD
function searchForPokemon(IV)
{
	// Questa funzione verrà chiamata in vari pezzi
	// di codice, la vogliamo rendere dinamica per più tipi di parametri
	let val
	if(IV instanceof String || typeof IV==='string') {
		console.log("It's a string")
		val=IV
	}	
	else{
		console.log("Not a string")
		val=IV.value;
	}

	const hasLetters=/[a-zA-Z]/.test(val);
	const hasNumbers=/^[0-9]+$/.test(val);
	if( val.trim()!=="" && (hasLetters || hasNumbers) && (val<=20000 || hasLetters)) //controllo se il valore è accettabile
	{
		//console.log(IV.value)
		getPokemonInfos(val);
	}
	else
		alert("Inserire almeno una lettera")
}

function switchSprite()
{
	
	let view,type,gender;
	if(backSprite) view='back';
	else view='front'
	
	
	if(shinySprite) type='_shiny';
	else type='_default';
	
	if(isFemale) gender='_female';
	else gender='';
	
	let key;
	if(!shinySprite && isFemale) key=view+'_female';
	else if(shinySprite && isFemale) key=view+'_shiny_female';
	else if(shinySprite) key=view+'_shiny';
	else key=view+'_default';
		
	// console.log("Tentativo con la chiave "+key)
	// Se lo sprite esiste, lo carichiamo, altrimenti fallback sul front_default
    spriteImg.src = currentSprites[key];
	//+sparkle
	if(shinySprite) spriteImg.classList.add("shiny-active")
	else spriteImg.classList.remove("shiny-active")
		
}

function addFemaleSprites(data)
{
	genderBtn.classList.remove('d-none');
	currentSprites.front_female=data.sprites.front_female;
    currentSprites.back_female=data.sprites.back_female;
    currentSprites.front_shiny_female=data.sprites.front_shiny_female;
    currentSprites.back_shiny_female=data.sprites.back_shiny_female;
}

async function getJsonData(url)
{
	try {
        const res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.error("Errore nel recupero dati:", error);
        return null;
    }
}

async function getSpeciesInfo(data) {
    return await getJsonData(data.species.url);
}

async function getEvoInfo(speciesData) {
    return await getJsonData(speciesData.evolution_chain.url);
}

async function getAbilitiesInfo(index) {
    return await getJsonData(index.ability.url);
}

async function getMovesInfo(index) {
    return await getJsonData(index.move.url);
}

async function insertDescription(speciesData)
{
	//console.log(descData);
	
	const entry = speciesData.flavor_text_entries.find(e => e.language.name === currentLan) 

    if (entry) {
        // Pulisci il testo dai caratteri di controllo obsoleti (\f, \n, \t)
        let cleanDesc = entry.flavor_text
            .replace(/[\f\n\r\t\v]/g, ' ') // Sostituisce i caratteri strani con spazi
            .replace(/\s\s+/g, ' ');      // Rimuove doppi spazi creati dalla pulizia

        pokeDesc.innerHTML = cleanDesc;
    } else {
        pokeDesc.innerHTML = "Nessuna descrizione disponibile per questo Pokemon/Lingua.";
    }
}

function getLocalName(speciesData) {return speciesData.names.find(e=>e.language.name===currentLan).name;}

async function renderEvo(evoData)
{	


		//console.log("Evoluzioni")
		evoContainer.innerHTML="";
		// 1. Render del Pokémon Base (Eevee)

		speciesDataFirst=await getSpeciesInfo(evoData.chain)
		localNameFirst=getLocalName(speciesDataFirst)
		await drawPokemon(evoData.chain.species.name, evoContainer, localNameFirst);
		/* console.log('draw'); */
		// 2. Controlliamo le evoluzioni
		let evoluzioni = evoData.chain.evolves_to;

		// 3. Array per passare al prossimo layer di evo
		
		while (evoluzioni.length > 0) {
			const nextIter=[];
			// Creiamo un contenitore per tutte le evoluzioni "figlie"
			const branchContainer = document.createElement('div');
			branchContainer.className = 'border rounded d-flex flex-wrap justify-content-center align-items-center mt-3';
			evoContainer.appendChild(branchContainer);

			for (const evo of evoluzioni) {
				// Per ogni evoluzione (Vaporeon, Jolteon, ecc.) per la maggior parte dei pokemon si itera 1 volta
				const wrapper = document.createElement('div');
				wrapper.className = 'd-flex align-items-center m-2 p-2';
				
				/*// Aggiungiamo la freccia compatta con il requisito
				const req = getRequirement(evo);
				const type = getReqType(evo);
				wrapper.innerHTML = `
					<div class="d-flex flex-column align-items-center me-2">
						<span style="font-size: 0.6rem;" class="text-muted fw-bold">${req.text}</span>`
						if(type==3) //Il requisito è un item...
						`<img src="${itemData.sprites.default}" 
						style="width: 30px;" class="mt-0 align-items-center" alt="${"Item sprite"}">`;
						`
						<i class="fa-solid fa-arrow-right text-secondary"></i>
					</div>`;*/
					
				// Ottieni i dati base
				const req = getRequirement(evo);
				const type = getReqType(evo);
				let itemImgHtml = ""; // Variabile per contenere l'eventuale tag <img>

				// Se è un item (type 3), scarichiamo i dati per l'immagine
				if (type === 3 && evo.evolution_details[0].item) {
					const itemRes = await fetch(evo.evolution_details[0].item.url);
					const itemData = await itemRes.json();
					itemImgHtml = `<img src="${itemData.sprites.default}" style="width: 25px;" class="mb-n1" alt="item">`;
				}

				// Ora componiamo tutto l'HTML insieme
				wrapper.innerHTML = `
					<div class="d-flex flex-column align-items-center me-2">
						<span style="font-size: 0.6rem; line-height: 1;" class="text-muted fw-bold">${capitalize(req.text)}</span>
						${itemImgHtml} 
						<i class="fa-solid fa-arrow-right text-secondary" style="font-size: 0.8rem;"></i>
					</div>
				`;
				speciesData=await getSpeciesInfo(evo)
				/* console.log(speciesData) */
				localNameEvo=getLocalName(speciesData)
				// Disegniamo il Pokémon evoluto dentro il wrapper
				await drawPokemon(evo.species.name, wrapper, localNameEvo);
				branchContainer.appendChild(wrapper);
				
				if(evo.evolves_to.length>0){
					//Prosegui per il prossimo layer
					nextIter.push(...evo.evolves_to)
				}
			}
		evoluzioni=nextIter;
		}
		
		async function drawPokemon(name, container, localNameEvo) {
			
			
			// Recuperiamo i dati (necessario per l'immagine)
			const res = await fetch(`${API_URL}/pokemon/${name}`);
			const data = await res.json();
			// Creiamo il pezzettino di HTML
			const div = document.createElement('div');
			div.className = 'border rounded clickable-pokemon text-center p-2';
			div.style.cursor = 'pointer';
			
			div.innerHTML = `
				<img src="${data.sprites.front_default}" style="width: 70px;" alt="${name}">
				<p class="small fw-bold mb-0 text-capitalize">${localNameEvo}</p>
			`;
			div.addEventListener("click",()=>{
				getPokemonInfos(name);
				
				// Opzionale: scroll in alto per vedere la nuova card
				window.scrollTo({ top: 0, behavior: 'smooth' });
			});
			container.appendChild(div);
		}
		// Funzione di supporto per estrarre i requisiti
		function getRequirement(evoNode) {
			const details = evoNode.evolution_details[0];
			if (!details) return { text: "" };
			if (details.min_level) return { text: "Lvl " + details.min_level };
			if (details.item) return { text: details.item.name.replace("-", " ") };
			if (details.trigger) return { text: details.trigger.name };
			return { text: "Special" };
		}
		function getReqType(evoNode)
		{
			const details = evoNode.evolution_details[0];
			if (!details) return 1;
			if (details.min_level) return 2;
			if (details.item) return 3;
			if (details.trigger) return 4;
			return 5;
		}
}

async function searcher(inputV="")
{	
    
	const suggCont = document.getElementById('suggestions');

    // Se l'input è vuoto, nascondi la tendina e fermati
    if (inputV.length < 2) {
        suggCont.classList.add('d-none');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/pokemon?limit=20000`);
        const data = await response.json();
        
        // Filtriamo i risultati
        const matches = data.results.filter(p => 
            p.name.includes(inputV.toLowerCase())
        ).slice(0, 10); // Mostriamo solo i primi 10 per pulizia

        // Puliamo la lista precedente
        suggCont.innerHTML = '';
		focusItem=-1

        if (matches.length > 0) {
            suggCont.classList.remove('d-none');
            
            matches.forEach(pokemon => {
                const item = document.createElement('div');
                item.classList.add('suggestion-item');
                item.textContent = capitalize(pokemon.name);
                
                // Quando l'utente clicca su un suggerimento:
                item.onclick = () => {
					const IV=document.getElementById('pokemon-search-input');
					IV.value = pokemon.name;
                    suggCont.classList.add('d-none');// 	Chiudi tendina
					/* console.log(pokemon.name); */
                    searchForPokemon(IV); // Avvia la ricerca vera e propria
                };
                
                suggCont.appendChild(item);
            });
        } else {
            suggCont.classList.add('d-none');
        }
    } catch (error) {
        console.error("Errore suggerimenti:", error);
    }
};


function toggleActive()
{
	const suggL=document.getElementById('suggestions').getElementsByClassName('suggestion-item');
	/* console.log(matches)
	console.log(suggCont) */

	//Se non ci sono items esco dalla funzione
	if(suggL.length===0) return 

	//Inizio togliendo l'active da tutti
	for (let i=0; i<suggL.length; i++)
		suggL[i].classList.remove("suggestion-item-active");

	//Calcolo un giro
	if (focusItem >= suggL.length) focusItem = 0; // Ricomincia dall'inizio
    if (focusItem < 0) focusItem = suggL.length - 1; // Va all'ultimo

	// Evidenzia l'elemento
	/* console.log(suggL) */
    const active = suggL[focusItem];
    active.classList.add("suggestion-item-active");
    active.scrollIntoView({ block: "nearest" }); //Scroll automatico

    /* console.log(focusItem) */
}

function playSounds()
{
	if(isLatest) playCry.src = currentCry.latest;
	else if(!isLatest) playCry.src = currentCry.legacy;
	/* else {
		const div=document.getElementById('audioCont')//Non verrà mai eseguito questo pezzo di codice(per ora)vvvv
		const p=document.createElement('p')
		p.innerHTML="Verso non disponibile per questo Pokémon"
		div.appendChild(p)
		// Se non trova l'audio nasconde il bottone
		playBtn.style.display = 'none';
	} */

	// Riproduce il verso automaticamente al caricamento
	playCry.play().catch(error => {
	console.log("Riproduzione automatica bloccata...");
	});//Catturiamo un possibile errore di caricamento audio
}

async function openAbilityModal(index, data) {
	const abilityData=await getAbilitiesInfo(data.abilities[index])//Recuperiamo l'url dello specifico elemento

	const entry = abilityData.effect_entries.find(e => e.language.name === currentLan)

	let title=document.getElementById("abilityTitle")
	title.textContent=capitalize(abilityData.name)
	const header=document.getElementById("abilityHeader")

	header.classList.add(currentType.type.name)
	if(entry) document.getElementById('abilityText').textContent=entry.effect
	else document.getElementById('abilityText').textContent="Nessuna descrizione disponibile per questa abilità/Lingua"
	const bsModal = new bootstrap.Modal(modalAbility);
	bsModal.show();
}

async function openMoveModal(index, data) {
	const moveData=await getMovesInfo(data.moves[index])//Recuperiamo l'url dello specifico elemento
	
	console.log(moveData.type.name)
	const entry = moveData.effect_entries.find(e => e.language.name === currentLan)
	let title=document.getElementById("moveTitle")
	title.textContent=capitalize(moveData.name)
	let clss=document.getElementById("moveClass")
	let power=document.getElementById("movePower")
	let acc=document.getElementById("moveAccuracy")
	let pp=document.getElementById("movePP")

	clss.textContent=capitalize(moveData.damage_class.name)
	if(moveData.power!==null)power.textContent=moveData.power
	if(moveData.damage_class.name!=="status") acc.textContent=moveData.accuracy
	pp.textContent=moveData.pp
	

	const header=document.getElementById("moveHeader")

	header.classList.add(moveData.type.name)
	if(entry) document.getElementById('moveText').textContent=entry.effect
	else document.getElementById('moveText').textContent="Nessuna descrizione disponibile per questa abilità/Lingua"
	const bsModal = new bootstrap.Modal(modalMove);
	bsModal.show();
}

function spaceReplace(str)
{
	return str.replace("-"," ");
}

function capitalize (str)
{
	return str.charAt(0).toUpperCase()+str.slice(1);
}