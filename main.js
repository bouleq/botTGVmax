window.addEventListener("load", initialisaton)

console.log("hello")

let token = "67697fde-d4d9-465a-bf06-12e9f9a2515d"
let backend =  "https://api.sncf.com/v1/coverage/sncf/";


function test() {
	fetch(backend + "commercial_modes", {method: 'GET', headers : {"authorization": token}})
	.then(res=>res.json())
	.then(json=>{
        console.log(json)
		let nom = document.querySelector(".test")
		nom.innerHTML = JSON.stringify(json)

	}).catch(function(error) {
        console.log('Il y a eu un problème avec l\'opération fetch: ' + error.message);
      });
}

function initialisaton(){
    document.querySelector("#button1").addEventListener("click", test);
}