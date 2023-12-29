let name;

window.onload = function() {
    const urlParams = new URLSearchParams(window.location.search);
    name = urlParams.get('name');

    if (!name)
        window.location.href = "name.html";
}

const videoOverlay = document.getElementById('video-overlay');
const videoArea = document.getElementById('video-area');
const info = document.getElementById('info');

const itemsButton = document.getElementById('items-button');
const listCloseButton = document.getElementById('list-close-button');
const listContainer = document.getElementById('list-container');
const list = document.getElementById('list');
const listEmpty = document.getElementById('list-empty');

const nameButton = document.getElementById('name-button');

const maxQueueLength = 3;

let isScanning = false;
let scanQueue = [];
let listSize = 0;

function initializeScanner() {
    Quagga.init({
        inputStream : {
            name : 'Live',
            type : 'LiveStream',
            target: document.querySelector('#video-feed')
        },
        decoder : {
            readers : ['code_128_reader'],
            patchSize: 'medium',
            halfSample: true
        },
        frequency: 10,
    }, function(err) {
        if (err) {
            console.log(err);
            return
        }
        console.log('Initialization finished. Ready to start');
        Quagga.start();
    });
}

function onScanCode(code) {
    videoOverlay.style.borderColor = '#22de60';
    isScanning = false;

    scanQueue = [];
    addListItem(code);

    window.navigator.vibrate(1000);

    const audio = new Audio("sounds/beep.mp3");
    audio.play();
}

function startScanning() {
    isScanning = true;
    videoOverlay.style.display = 'block';
    videoOverlay.style.borderColor = null;
    info.style.display = 'none';
}

function stopScanning() {
    isScanning = false;
    videoOverlay.style.display = 'none';
    info.style.display = 'block';
}

function openList() {
    listContainer.classList.add('enabled');
    info.classList.add('hidden');
}

function closeList() {
    listContainer.classList.remove('enabled');
    info.classList.remove('hidden');
}

function addListItem(code) {
    const listItem = document.createElement("div");
    listItem.className = 'list-item';

    const item = document.createElement('h3');
    item.className = 'item';
    item.textContent = code;

    const img = document.createElement('img');
    img.src = 'icons/delete.svg';
    img.alt = 'Delete Icon';

    const button = document.createElement('button');
    button.appendChild(img);
    button.addEventListener('click', function() {
        listItem.classList.add('remove');
        setTimeout(() => {
            listItem.remove();
            listSize--;
            if (listSize === 0) {
                listEmpty.style.display = 'flex';
            }
        }, 500);
    });

    listItem.append(item);
    listItem.append(button);
    list.prepend(listItem);
    listSize++;

    if (listSize > 0)
        listEmpty.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function () {

    initializeScanner();

    Quagga.onDetected(function (result) {
        if (!isScanning)
            return;

        const code = result.codeResult.code;

        scanQueue.push(code);
        if (scanQueue.length > maxQueueLength)
            scanQueue.shift();

        if (scanQueue.length < maxQueueLength || scanQueue.some(item => item !== code))
            return;

        onScanCode(code);
    });

    videoArea.addEventListener('pointerdown', function() {
        startScanning();
    });

    videoArea.addEventListener('pointerup', function() {
        stopScanning();
    });

    videoArea.addEventListener('contextmenu', function(event) {
        event.preventDefault();
        stopScanning();
    });

    itemsButton.addEventListener('click', function() {
        openList();
    });

    listCloseButton.addEventListener('click', function() {
        closeList();
    });

    nameButton.addEventListener('click', function() {
        window.location.href = "name.html";
    });
});