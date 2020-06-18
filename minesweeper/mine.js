let gameStart = false
let gameOver = false;
let bombArray = [];
let objectBox = {};
let flagged = {}
let flagsCounter = document.getElementById("flag-counter")
let face = document.querySelector(".smile-button")
function reset(){
   location.reload()
}
let timer = document.querySelector(".timer")
setInterval(() => {
   if(!gameStart) return
   timer.innerHTML = parseFloat(timer.innerHTML) + 1
   while(timer.innerHTML.length < 3){
      timer.innerHTML = "0" + timer.innerHTML
   }
}, 1000)

const placement = () => {
   for(i = 1; i <= 100; i++){
      let btn = document.getElementById(`btn${i}`)
      let number = 0
      let bool = true;
      let neightborArray = [];
      const isThereABomb = (spot, i) => {
         if(bombArray.includes(i + spot)){
            number += 1;
            neightborArray.push(i + spot);
            btn.innerHTML = number
         }else{neightborArray.push(i + spot)}
      }
      if((i - 1) % 10 == 0){
         const numberToCheck = [1, 10, 11, -9, -10]
         numberToCheck.forEach(spot => isThereABomb(spot, i))
      }
      if(i % 10 == 0){
         const numberToCheck = [-1, -10, -11, 9, 10]
         numberToCheck.forEach(spot => isThereABomb(spot, i))
      }
      if(i % 10 != 0 && (i - 1) % 10 != 0){
         const numberToCheck = [9, -9, 10, -10, 11, -11, 1, -1]
         numberToCheck.forEach(spot => isThereABomb(spot, i))
      }
      bombArray.forEach(number => {
         let btnBomb = document.getElementById(`btn${number}`).innerHTML = "B"
      })
      let filterArray = neightborArray.filter(number => number > 0 && number < 101)
      objectBox[i] = filterArray
   }
}

window.addEventListener("load", () => {
   let body = document.body
   let grid = document.querySelector(".btn-grid")
   for(i = 1; i <= 100; i++){
      let createBtn = document.createElement("button")
      createBtn.setAttribute("id", `btn${i}`)
      createBtn.setAttribute("class", "unchecked")
      createBtn.setAttribute("onclick", `clickBtn('btn${i}')`)
      createBtn.setAttribute("oncontextmenu", `rightClick('btn${i}')`)
      grid.appendChild(createBtn)
   }

   const bombSelector = () => {
      bombArray = [];
      for(i = 0; i < 12; i++){
         let randomNumber = Math.ceil(Math.random() * 100);
         while(bombArray.includes(randomNumber) || bombArray.includes(randomNumber + 3) || bombArray.includes(randomNumber - 3) || randomNumber == 0){
            randomNumber = Math.floor(Math.random() * 100);
         }
         bombArray.push(randomNumber)
      }
      placement()
   }
   bombSelector()
   flagsCounter.innerHTML = bombArray.length
})


function clickBtn(btnId){
   if(gameOver) return
   gameStart = true
   let btn = document.getElementById(btnId)
   let getIdNumber = parseFloat(btnId.slice(3))
   if(btn.innerHTML == "🚩") return
   face.innerHTML = "😮";
   switch(btn.innerHTML){
      case "":
         setTimeout(() => face.innerHTML = "🙂", 300)
         btn.classList.remove("unchecked")
         btn.classList.add("checked")
         checkBox(getIdNumber)
         function checkBox(boxToCheck){
            objectBox[boxToCheck].forEach(number => {
            let btn = document.getElementById(`btn${number}`)
            if(btn.classList.contains("checked")) return
            if(btn.innerHTML != "B" || btn.innerHTML != "🚩"){
               btn.classList.remove("unchecked")
               btn.classList.add("checked")
               if(btn.innerHTML != "") return
               setTimeout(() => {
                  checkBox(number)
               }, 5)
            }
         });
      }
         break;
      case "B":
         gameStart = false
         gameOver = !gameOver
         bombArray.forEach(bomb => {
            let btn = document.getElementById(`btn${bomb}`)
            btn.classList.remove("unchecked")
            btn.classList.add("checked")
            btn.innerHTML = "💣"
         })
         setTimeout(() => face.innerHTML = "🙃", 300)
         break;
      default:
         setTimeout(() => face.innerHTML = "🙂", 300)
         btn.classList.remove("unchecked")
         btn.classList.add("checked")
         break;
   }
   if(document.querySelectorAll(".checked").length == 88){
      setTimeout(() => face.innerHTML = "😃", 300)
      bombArray.forEach(bomb => {
         let btn = document.getElementById(`btn${bomb}`)
         btn.innerHTML = "🚩"
      })
      flagsCounter.innerHTML = "00"
      gameOver = true
      gameStart = false
   }
}

function rightClick(btnId, e){
   gameStart = true
   e = window.event
   let btn = document.getElementById(btnId)
   e.preventDefault()
   if(gameOver) return
   if(btn.innerHTML == "🚩"){
      btn.innerHTML = flagged[btnId]
      flagsCounter.innerHTML = parseFloat(flagsCounter.innerHTML) + 1
   }else{
      if(btn.classList.contains("checked")) return
      if(flagsCounter.innerHTML == 0) return
      flagged[btnId] = btn.innerHTML
      btn.innerHTML = "🚩"
      flagsCounter.innerHTML -= 1
   }
   while(flagsCounter.innerHTML.length < 2){
      flagsCounter.innerHTML = "0" + flagsCounter.innerHTML
   }
}
