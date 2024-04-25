<?php
session_start();

function getPDO()
{
    $host = 'localhost';
    $user = 'bit_academy';
    $password = 'bit_academy';
    $name = 'netland';

    try {
        $pdo = new PDO("mysql:host=$host;dbname=$name", $user, $password);
        return $pdo;
    } catch (PDOException $err) {
        echo "Database connection problem. " .  $err->getMessage();
        exit();
    }
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];
}
if (!empty($username) && !empty($password)) {
    $pdo = getPDO();

    $statement = $pdo->prepare("SELECT id FROM gebruikers WHERE username = :username AND password = :password");

    $statement->bindParam(':username', $username);
    $statement->bindParam(':password', $password);

    $statement->execute();

    $user = $statement->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        $_SESSION['loggedInUser'] = $user['id'];
        header("Location: index.php");
        exit();
    } else {
        $errorMessage = "username of password fout!";
    }
}
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
</head>

<body>
    <h2>Login</h2>
    <?php if (isset($errorMessage)) : ?>
        <p><?php echo $errorMessage; ?></p>
    <?php endif; ?>
    <form action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]); ?>" method="POST">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" required>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" required>
        <input type="submit" value="Login">
    </form>
</body>

</html>