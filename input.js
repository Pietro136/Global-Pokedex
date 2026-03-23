const inputValue=document.getElementById('pokemon-search-input')
const submitBtn=document.getElementById('submit-button')

const langChoice=document.getElementById('lang-select')

const prevBtn=document.getElementById('previous-button');
const nextBtn=document.getElementById('next-button');

const spriteImg = document.getElementById('pokemon-sprite-img'); 

const shinyBtn=document.getElementById('shiny-button');
const genderBtn=document.getElementById('gender-button');

const latestBtn=document.getElementById('latestBtn')
const legacyBtn=document.getElementById('legacyBtn')

const descBtn=document.getElementById('desc-button')

langChoice.addEventListener('change', (e) => {
    currentLan = e.target.value;
    console.log("Lingua cambiata in:", currentLan);
    if(!firstTry) getPokemonInfos(currentID)

});

// Chiudi la tendina se l'utente clicca fuori
document.addEventListener('click', (e) => {
if (!e.target.closest('.search-container')) {
	document.getElementById('suggestions').classList.add('d-none');
}});

submitBtn.addEventListener("click", () => {
	console.log(inputValue.value)
	searchForPokemon(inputValue);
});

prevBtn.addEventListener("click", () => {
	getPokemonInfos(currentID-1) //avanti
});

nextBtn.addEventListener("click", () => {
	getPokemonInfos(currentID+1) //indietro
});


shinyBtn.addEventListener("click", ()=>
{
	shinySprite=!shinySprite;//Cambia la rarità!
	console.log("shiny: ",shinySprite);
	switchSprite();
	shinyBtn.classList.toggle("btn-warning");
});

spriteImg.addEventListener("click", () => {
    backSprite=!backSprite; // Inverte la vista (davanti/dietro)
    console.log("back: ",backSprite);
    //Effetto rotazione CSS (opzionale ma consigliato)
    //Applichiamo la rotazione 3D
    if (backSprite) {
		spriteImg.style.transition="transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
        //spriteImg.style.transform = "rotateY(180deg)";
		spriteImg.classList.toggle("rotated");
     } else {
		spriteImg.style.transition="transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)";
        //spriteImg.style.transform = "rotateY(0deg)";
		spriteImg.classList.toggle("rotated");
    } 
	
	
    setTimeout(()=>
	//Quando arriva a metà rotea a 180 subito e cambia sprite 
	//Per dare il senso di roteazione
	{
		switchSprite();
		spriteImg.style.transition="transform 0s";
		spriteImg.classList.toggle("rotated");
	}, 250);
});

genderBtn.addEventListener("click", ()=>
{
	isFemale=!isFemale;
	// console.log("Female: ",isFemale);
	switchSprite();
	genderBtn.classList.toggle('female-btn');
	genderBtn.classList.toggle('male-btn');
	genderBtn.classList.toggle('fa-venus');
	genderBtn.classList.toggle('fa-mars');
});
latestBtn.addEventListener("click", ()=>
{
	isLatest=true;
	console.log(isLatest)
	playSounds()
});
//^^^vvv I due gate per accedere ai due tipi di sounds
legacyBtn.addEventListener("click", ()=>
{
	isLatest=false;
	console.log(isLatest)
	playSounds()
});

//Per attivare con enter

var focusItem=-1
var matches
var suggCont
inputValue.addEventListener('input', (e) => {
	searcher(e.target.value);
});


inputValue.addEventListener("keydown", function(e)
{
	if(e.code=="Enter" && inputValue.value!="")
		searchForPokemon(inputValue);
	if(e.code=="ArrowUp" && inputValue.value.length>2){
		focusItem--
		toggleActive()
	}
	if(e.code=="ArrowDown" && inputValue.value.length>2){
		focusItem++
		toggleActive()
	}
});

/*
for (miniCard of evoCards)
{
	miniCard.addEventListener("click", () => {
		const name=div.children
	searchForPokemon(inputValue);
});
}*/



