const submitBtn=document.querySelector("#submit-button");
const shinyBtn=document.querySelector("#shiny-button");
const inputValue=document.querySelector("#pokemon-search-input");
const spriteImg = document.getElementById('pokemon-sprite-img'); 
const genderBtn=document.getElementById('genderButton');
const descBtn=document.getElementById('descButton')

// Opzionale: chiudi la tendina se l'utente clicca fuori (gemini)
document.addEventListener('click', (e) => {
if (!e.target.closest('.search-container')) {
	document.getElementById('suggestions').classList.add('d-none');
}});

inputValue.addEventListener('input', (e) => {
	searcher(e.target.value);
});

submitBtn.addEventListener("click", () => {
	console.log(inputValue.value)
	searchForPokemon(inputValue);
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
//Per attivare con enter
document.addEventListener("keydown", processKeyEvent);

function processKeyEvent(e)
{
	if(e.code=="Enter")
		searchForPokemon(inputValue);
}
//


/*
for (miniCard of evoCards)
{
	miniCard.addEventListener("click", () => {
		const name=div.children
	searchForPokemon(inputValue);
});
}*/



