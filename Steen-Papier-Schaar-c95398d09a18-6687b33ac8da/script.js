let speler1 = '';
let speler2 = '';

function keuze(kies) {
    if (!speler1) {
        speler1 = kies;
        document.getElementById('result').innerHTML = `Speler 2, Kies!`;
    } else if (!speler2) {
        speler2 = kies;
        const result = win(speler1, speler2);
        document.getElementById('result').innerHTML = `${result}`;

        speler1 = '';
        speler2 = '';
    }
}

function win(man1, man2) {
    if (man1 === man2) {
        return "Gelijkspel!";
    } else if (
        (man1 === 'steen' && man2 === 'schaar') ||
        (man1 === 'papier' && man2 === 'steen') ||
        (man1 === 'schaar' && man2 === 'papier')
    ) {
        return "Speler 1 wint!";
    } else {
        return "Speler 2 wint!";
    }
}