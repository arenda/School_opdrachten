<?php
session_start();

function startGame()
{
    $_SESSION['choices'] = ['rock', 'paper', 'scissors'];
}

function determineWinner($userChoice, $computerChoice)
{
    if ($userChoice == $computerChoice) {
        return "It's a tie!";
    } elseif (
        ($userChoice == 'rock' && $computerChoice == 'scissors') ||
        ($userChoice == 'paper' && $computerChoice == 'rock') ||
        ($userChoice == 'scissors' && $computerChoice == 'paper')
    ) {
        return 'You win!';
    } else {
        return 'You lose!';
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $userChoice = filter_input(INPUT_POST, 'choice');

    if (in_array($userChoice, $_SESSION['choices'])) {
        $computerChoice = $_SESSION['choices'][array_rand($_SESSION['choices'])];

        $result = determineWinner($userChoice, $computerChoice);
    } else {
        $result = 'Invalid choice. Please choose rock, paper, or scissors.';
    }
} else {
    if (!isset($_SESSION['choices'])) {
        startGame();
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rock, Paper, Scissors Game</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 50px;
        }

        button {
            padding: 10px;
            font-size: 16px;
            margin: 5px;
        }
    </style>
</head>

<body>

    <h1>Rock, Paper, Scissors Game</h1>

    <form method="post" action="">
        <button type="submit" name="choice" value="rock">Rock</button>
        <button type="submit" name="choice" value="paper">Paper</button>
        <button type="submit" name="choice" value="scissors">Scissors</button>
    </form>

    <?php if (isset($result)) : ?>
        <p><?php echo 'Computer chose: ' . $computerChoice; ?></p>
        <p><?php echo $result; ?></p>
    <?php endif; ?>
    <button type="submit"><a href="index.php">Return Home</a></button>
</body>

</html>