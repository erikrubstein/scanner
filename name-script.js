document.getElementById('start-button').addEventListener('click', function() {
    const name = document.getElementById('name-input').value;
    if(name !== ''){
        window.location.href = `index.html?name=${encodeURI(name)}`;
    } else {
        alert('Please, enter your name.');
    }
});