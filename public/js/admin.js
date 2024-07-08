
function save() {
        fetch('/enemy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this)
        })
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch(error => console.error('Error:', error));
}


document.getElementById('enemyForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const enemyData = {
        name: formData.get('name'),
        desc: formData.get('desc'),
        hp: parseInt(formData.get('hp')),
        strength: parseInt(formData.get('strength')),
        defense: parseInt(formData.get('defense')),
        dexterity: parseInt(formData.get('dexterity')),
        resistence: parseInt(formData.get('resistence')),
        intelligence: parseInt(formData.get('intelligence')),
        luck: parseInt(formData.get('luck')),
        hostility: formData.get('hostility') === 'on',
        availability: formData.get('availability'),
        drops: formData.get('drops').split(',')
    };
    console.log(enemyData)
});


