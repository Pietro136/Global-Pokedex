// <<<<<<< HEAD
const API_URL="https://pokeapi.co/api/v2";

var firstTry=true;
var isLatest=true;

//vvv Variabili per prendere dati dal pokemon attuale, 
//importante per non dover mantenere le informazioni locali

var currentID;
var currentSprites;
var currentCry;
var currentLan;
var currentType;
var currentMoveType
//^^^

var backSprite=false
var shinySprite=false;
var isFemale=false;

var megaCount=0;

var variantAcc

var listVersion; //Lista delle versioni di gioco
var listMoves; //Lista mosse
var listVariants;

var abilityTable;
var abilityTBody;
var typeContainer;
var cardTitle;

var statCont;
var extraInfo;

var playCry;


var evoTitle;
var evoContainer;

var pokeDesc;

function initialize()
{
	//console.log("Qua inizializzo");

	currentID=0;
	currentSprites={
		front_default: '',
		back_default: '',
		front_shiny: '',
		back_shiny: ''
	}
	currentCry={
		latest: '',
		legacy: ''
	}
	currentLan='en'
	currentType=''
	currentMoveType=''
	listVersion = document.getElementById("list-group-version");
	listMoves = document.getElementById("list-group-moves");
	listVariants=document.getElementById("list-group-variants");
	abilityTable = document.getElementById('abilityTable');
	abilityTBody = abilityTable.children[1];
	typeContainer=document.querySelector(".type-container");
	
	statCont=document.getElementById("pokemonStats");
	extraInfo=document.getElementById("extraInfo");
	playCry=document.getElementById("playCry");
	
	evoTitle=document.getElementById('evTitle');
	evoContainer=document.getElementById("evolutionChain");
	pokeDesc=document.getElementById("pokeDescription");

	variantAcc=document.getElementById("variantAccordion");
}

function restart()
{
	console.clear()//Puliamo la console
	console.log("Restart")
	if (typeContainer) typeContainer.innerHTML = '';
	if (abilityTBody) abilityTBody.innerHTML = '';
	if (listVersion) listVersion.innerHTML = '';
	if (listMoves) listMoves.innerHTML = '';
	if (statCont) statCont.innerHTML='';
	if (evoTitle) evoTitle.innerHTML="Catena di evoluzione";
	if (evoContainer) evoContainer.innerHTML='';
	
	//console.log(abilityTable)
	
    if (cardTitle) cardTitle.textContent = '';
	
	if (spriteImg.src==currentSprites.front_shiny ||
		spriteImg.src==currentSprites.back_shiny)
			shinyBtn.classList.toggle("btn-warning");
	
	shinySprite=false;
	backSprite=false;
	isFemale=false;
	isLatest=true;
	megaCount=0;
	
	if(!genderBtn.classList.contains('d-none')) 
		//Cancelliamo gli sprite extra se non servono
	{
		genderBtn.classList.add('d-none');
		genderBtn.classList.remove('male-btn');
		genderBtn.classList.remove('fa-mars');
		genderBtn.classList.add('female-btn');
		genderBtn.classList.add('fa-venus');
		delete currentSprites.front_female;
		delete currentSprites.back_female;
		delete currentSprites.front_shiny_female;
		delete currentSprites.back_shiny_female;
	}
	//Rimetto lo sfondo normale
	if(mainBody.classList.contains('MS-pattern')){
		mainBody.classList.remove('MS-pattern')
		mainBody.classList.add('pattern')
	}
	
	
	if(!variantAcc.classList.contains('d-none')) variantAcc.classList.add('d-none')
	if(latestBtn.classList.contains('d-none')) latestBtn.classList.remove('d-none')
	if(legacyBtn.classList.contains('d-none')) legacyBtn.classList.remove('d-none')
	if(prevBtn.classList.contains('d-none')) prevBtn.classList.remove('d-none')
	if(nextBtn.classList.contains('invisible')) nextBtn.classList.remove('invisible')
}

//!!!!!!! non mettere EventListener qui dentro
async function getPokemonInfos(IV)	
{
	document.getElementById('suggestions').classList.add('d-none'); //Nasconde i suggerimenti quando la ricerca inizia
	inputValue.value=''
	if (firstTry) {
        initialize();
    } else {
        restart();
    }
	if(!/\d/.test(IV)) IV=IV.toLowerCase();
	
	try
	{
	const response =await fetch(API_URL+"/pokemon/"+IV);  //<- IMPORTANTE
	if (!response.ok) {
		if (response.status === 404) {
			//throw new Error(`Error: ${response.status} - ${IV} is
			//not a valid Pokémon`);
			//searcher(IV)
		} else {
		throw new Error("HTTP error! Status: "+response.status);
		}
		return response.json();
	}
	//data=i dati del pokemon deciso
		const data=await response.json();  //Arriva con successo!!!
		
			if(data.id>=10033 && data.id<=10076) // Cambio sfondo se mega/
			{
				mainBody.classList.remove("pattern")
				mainBody.classList.add("MS-pattern")
			}
				
			//console.log(abilityTable)
			firstTry=false;
			pokemonCard=document.getElementById("pokemonDescription")
			pokemonCard.classList.remove('d-none');
			cardTitle=document.querySelector(".card-title");
			const spriteImg=document.getElementById("pokemon-sprite-img");

			currentID=data.id //Da conferire ai pulsanti prossimo precedente
			if(currentID==1) prevBtn.classList.add('d-none') //Controllare se si può andare avanti o indietro
			if(currentID==1025) nextBtn.classList.add('invisible')

			const speciesData=await getSpeciesInfo(data);
			const localName=getLocalName(speciesData)
			console.log(localName)
			console.log(currentLan)
			cardTitle.textContent += "Pokemon #"+data.id+" - "+capitalize(localName);
			
			//Colonna 1
			currentSprites.front_default=data.sprites.front_default;
			currentSprites.back_default=data.sprites.back_default;
			currentSprites.front_shiny=data.sprites.front_shiny;
			currentSprites.back_shiny=data.sprites.back_shiny;
			if(data.sprites.front_female!=null) addFemaleSprites(data);
			/* console.log(currentSprites); */
			
			switchSprite() //Sprite iniziale
			/*console.log(data)
			console.log(data.name)
			console.log(data.abilities)
			console.log(data.height)
			console.log(data.id)
			*/
			console.log(listVersion)
			console.log(listMoves)

			data.types.forEach(type => {//Tipi
				const pokemonType = document.createElement('span');
				pokemonType.classList.add(`${type.type.name}`);
				pokemonType.classList.add(`type`);
				pokemonType.textContent = capitalize(type.type.name);
				typeContainer.appendChild(pokemonType);
			})
			currentType=data.types[0].type.name
			data.abilities.forEach((obj, index) => { //Abilità
				const abilityRow = document.createElement('tr');
				const abilityIndex = document.createElement('td');
				const abilityName = document.createElement('td');
				const abilityHidden = document.createElement('td');
				const abilityInfo=document.createElement('td');
				abilityIndex.textContent = index + 1;
				abilityName.textContent = capitalize(obj.ability.name);
				abilityHidden.textContent = capitalize(String(obj.is_hidden))
				abilityInfo.innerHTML = `<button
											class="btn btn-info fa-solid fa-info btn-sm rounded-3"
											type="submit"
											id="ability-info-${index+1}">
										</button>`
				abilityTBody.appendChild(abilityRow);
				abilityRow.appendChild(abilityIndex);
				abilityRow.appendChild(abilityName);
				abilityRow.appendChild(abilityHidden);
				abilityRow.appendChild(abilityInfo);

				const infoBtn=document.getElementById("ability-info-"+(index+1))
				infoBtn.onclick = () => openAbilityModal(index, data);
			});
			
			data.game_indices.forEach(obj => //Giochi/Versioni in cui appaiono
			{
				let version=obj.version.name;
				version=capitalize(version);
				if (version.includes("-")) version=spaceReplace(version);
				//console.log(version);
				
				let li=document.createElement("li")
				li.classList.add("list-group-item")
				li.classList.add("col-6")
				
				let nodeT=document.createTextNode(version);
				li.appendChild(nodeT);
				listVersion.appendChild(li);
			})
			
			//Colonna 2
			statCont.appendChild
			
			/* console.log(data.stats) */
			let score=0
			data.stats.forEach(obj=>
			{
				const statName=spaceReplace(obj.stat.name)
				const statValue=obj.base_stat
				const percentage = (statValue / 150) * 100; // Calcolo percentuale
				
				const statW=document.createElement('div')
				statW.classList.add("mb-2");
				let statImg
				if(statName==="hp") statImg="heart"
				if(statName==="attack") statImg="burst"
				if(statName==="defense") statImg="shield"
				if(statName==="special attack") statImg="ring"
				if(statName==="special defense") statImg="shield-halved"
				if(statName==="speed") statImg="bolt"
				statW.innerHTML=`
				<div class="d-flex justify-content-between mb-1" style="font-size: 0.9rem;">
					<div>
					<span class="text-uppercase fw-bold">${statName}</span>
					<i class="fa-solid fa-${statImg}"></i>
					</div>
					<span class="fw-bold">${statValue}</span>
				</div>
				<div class="progress" style="height: 8px; background-color: #e9ecef;">
					<div class="progress-bar" 
						 role="progressbar" 
						 style="width: 0%; transition: width 1.5s cubic-bezier(0.4, 0, 0.2, 1);" 
						 aria-valuenow="${statValue}" 
						 aria-valuemin="0" 
						 aria-valuemax="255">
					</div>
				</div>`;
				statCont.appendChild(statW);
				
				setTimeout(() => {
				const bar = statW.querySelector('.progress-bar');
				bar.style.width = percentage + "%";
				// Cambiamo colore in base al valore
				if(statValue < 10) bar.classList.add('bg-dark');
				else if(statValue < 60) bar.classList.add('bg-danger'); //Debole
				else if(statValue < 90) bar.classList.add('bg-warning'); //Medio
				else if(statValue < 150) bar.classList.add('bg-success');//Buono
				else  bar.classList.add('bg-primary'); //Fantastico!
			}, 100);
				score+=statValue
			})
			const total=document.createElement('p')
			total.className="mt-2 text-end fw-bold";
			total.innerHTML="BST: "+score;
			statCont.appendChild(total);
			
			if(data.cries.legacy==null) legacyBtn.classList.add('d-none')
			//togliamo i pulsanti audio non necessari
			if(data.cries.latest==null) latestBtn.classList.add('d-none')
			currentCry.latest=data.cries.latest //Diamo i valori ad un oggetto globale
			currentCry.legacy=data.cries.legacy
			
			const moves=data.moves;
			moves.forEach((move, index) => //Mosse imparabili
			{
				let moveName=move.move.name;
				moveName=capitalize(moveName);
				if (moveName.includes("-")) moveName=spaceReplace(moveName);
				//console.log(version);
				
				let liMove=document.createElement("li")
				liMove.classList.add("list-group-item")
				liMove.classList.add("col-4")
				liMove.innerHTML = `${moveName}`
				let liBtn=document.createElement("li")
				liBtn.classList.add("list-group-item")
				liBtn.classList.add("col-2")
				
				liBtn.innerHTML=`<button
									class="btn btn-info fa-solid fa-info btn-sm rounded-3 me-3"
									type="submit"
									id="move-info-${index+1}">
								</button>`
				listMoves.appendChild(liMove);
				listMoves.appendChild(liBtn);

				const infoBtn=document.getElementById("move-info-"+(index+1))
				infoBtn.onclick = () => openMoveModal(index, data);
			})
			

			/* playSounds(); */
			
			//Colonna 3
			const variants=speciesData.varieties
			if(variants.length>1) variantAcc.classList.remove('d-none')
			variants.forEach(variant=>{
				if(/mega/.test(variant.pokemon.name)){
					hasMega=true
					megaCount+=1;
				}
					
			})

			const evoData=await getEvoInfo(speciesData);
			if(evoData.chain.evolves_to.length>0) renderEvo(speciesData, evoData, megaCount);
			else evoTitle.innerHTML=`${capitalize(data.name)} non ha evoluzioni`;
			
			insertDescription(speciesData);

			
			
			
	}
	catch(e){ 
	console.log(e)
	};
}
// =======
// >>>>>>> 617d497 (commit generale di tutti i file)