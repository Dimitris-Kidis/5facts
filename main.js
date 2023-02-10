const startButton = document.getElementById('start-button');

const firstContainer = document.getElementById('first-container');
const secondContainer = document.getElementById('second-container');
const thirdContainer = document.getElementById('third-container');
const fourthContainer = document.getElementById('fourth-container');


const addPlayerButton = document.getElementById('add-player');
const refreshPlayerButton = document.getElementById('refresh');
const goButton = document.getElementById('go-button');


const nameInput = document.getElementById('name');
const inputOne = document.getElementById('first');
const inputTwo = document.getElementById('second');
const inputThree = document.getElementById('third');
const inputFour = document.getElementById('fourth');
const inputFive = document.getElementById('fifth');


startButton.addEventListener('click', () => {
    firstContainer.classList.add('hidden');
    secondContainer.classList.remove('hidden');
})


addPlayerButton.addEventListener('click', () => {
    if (nameInput.value == '' ||
        inputOne.value == '' ||
        inputTwo.value == '' ||
        inputThree.value == '' ||
        inputFour.value == '' ||
        inputFive.value == '') {
        return;
    } else {
        let players = localStorage.players ? JSON.parse(localStorage.getItem('players')) : [];
        players.push({
            name: nameInput.value,
            facts: [inputOne.value,
                inputTwo.value,
                inputThree.value,
                inputFour.value,
                inputFive.value
            ]
        });
        if (players.length >= 3) goButton.classList.remove('hidden');
        localStorage.setItem('players', JSON.stringify(players));
        nameInput.value = '';
        inputOne.value = '';
        inputTwo.value = '';
        inputThree.value = '';
        inputFour.value = '';
        inputFive.value = '';
    }
})

// let players = localStorage.players ? JSON.parse(localStorage.getItem('players')) : [];


let names = [];
const namesContainer = document.getElementById('names');
const factContainer = document.getElementById('fact-container');


var playerIndex = 0;
var currentFactText = '';


goButton.addEventListener('click', () => {
    let players = JSON.parse(localStorage.getItem('players'));
    for (let i = 0; i < players.length; i++) {
        namesContainer.innerHTML +=
            `
        <div class="name">${players[i].name}</div>
        `
        names.push(players[i].name)
    }
    secondContainer.classList.add('hidden');
    thirdContainer.classList.remove('hidden');

    setFact();
    checkNamePressed(players);
})


var hasMore = true;
var voidCounter = 0;


function setFact() {
    let players = JSON.parse(localStorage.getItem('players'));
    while (true) {
        for (let i = 0; i < players.length; i++) {
            if (players[i].facts == []) {
                voidCounter++;
            }
        }
        if (voidCounter == players.length) {
            return
            finish()
        }
        voidCounter = 0;

        playerIndex = getRandomArrayIndex(players.length);
        if (players[playerIndex].facts[0] == undefined) continue;
        factContainer.innerText = players[playerIndex].facts[getRandomArrayIndex(players[playerIndex].facts.length)];
        currentFactText = factContainer.innerText;
        break;
    }
    // checkNamePressed(players);

}

function finish() {
    console.log('finish')
}

function getRandomArrayIndex(length) {
    return Math.floor(Math.random() * length);
}

function checkNamePressed(players) {
    for (let j = 0; j < players.length; j++) {
        document.getElementsByClassName('name')[j].addEventListener('click', e => {
            console.log(e.target.innerText);

            var ans = {
                name: players[playerIndex].name,
                fact: e.target.innerText,
                guessed: players[playerIndex].name == e.target.innerText ? true : false
            }

            var index = players[playerIndex].facts.indexOf(currentFactText)
            if (index > -1) { // only splice array when item is found
                players[playerIndex].facts.splice(index, 1); // 2nd parameter means remove one item only
                localStorage.setItem('players', JSON.stringify(players));

            }




            var table = localStorage.table ? JSON.parse(localStorage.getItem('table')) : [];
            table.push(ans);
            localStorage.setItem('table', JSON.stringify(table));
            if (table.length == 5 * JSON.parse(localStorage.getItem('players')).length) {
                thirdContainer.classList.add('hidden');
                fourthContainer.classList.remove('hidden');
                createTable();
                console.log('done')
                return
            }


            console.log(ans);
            setFact();

        })
    }
}


function compare(a, b) {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
}




function createTable() {
    var html = '';
    html += `
    <table class="table" >
            <tr>
              <th>Имя</th>
              <th>Факт</th>
              <th>✅ / ❌</th>
            </tr>

    `;

    var rows = JSON.parse(localStorage.getItem('table'));

    rows.sort(compare);
    for (let i = 0; i < rows.length; i++) {
        html += `
            <tr>
                <td>${rows[i].name}</td>
                <td>${rows[i].fact}</td>
                <td>${rows[i].guessed == true ? '✅' : '❌'}</td>
            </tr>
        `;

    }



    console.log(fourthContainer.innerHTML);
    html += `

        </table>
    `;

    fourthContainer.innerHTML = html;
    localStorage.setItem('table', JSON.stringify([]));
    localStorage.setItem('players', JSON.stringify([]));

}

