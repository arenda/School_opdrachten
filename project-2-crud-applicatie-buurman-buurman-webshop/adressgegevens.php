<?php
session_start();
include('functions/functions.php');
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kruiwagen || B&B Webshop</title>
    <link rel="icon" type="image/x-icon" href="img/buurmanheader2.jpg">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="css/background.css" rel="stylesheet">
</head>

<body>
    <?php
    include("includes/header.php");
    include("includes/navbar.php");
    ?>
    <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
            <div class="col-12">
                <div class="column">
                    <div class="card card-registration card-registration-2" style="border-radius: 15px;">
                        <div class="card-body p-0">
                            <div class="row g-0">
                                <div class="col-lg-7">
                                    <div class="p-5">
                                        <div class="d-flex justify-content-between align-items-center mb-5">
                                            <h1 class="fw-bold mb-0 text-black">Kruiwagen</h1>
                                        </div>
                                        <hr class="my-4">
                                        <form method="post" action="wagen_update.php">
                                            <table class="table table-striped">
                                                <div class="row">
                                                    <div class="col-md-10 mb-4">
                                                        <div class="card mb-4">
                                                            <div class="card-header py-3">
                                                                <h5 class="mb-0">betaal gegevens</h5>
                                                            </div>
                                                            <div class="card-body">
                                                                <form onsubmit="return validateForm()">
                                                                    <!-- 2 column grid layout with text inputs for the first and last names -->
                                                                    <div class="row mb-4">
                                                                        <div class="col">
                                                                            <div data-mdb-input-init class="form-outline">
                                                                                <input type="text" id="voornaam" class="form-control" required />
                                                                                <label class="form-label" for="voornaam">Voornaam</label>
                                                                            </div>
                                                                        </div>
                                                                        <div class="col">
                                                                            <div data-mdb-input-init class="form-outline">
                                                                                <input type="text" id="form7Example2" class="form-control" required />
                                                                                <label class="form-label" for="form7Example2">Achternaam</label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div class="row mb-4">
                                                                        <div class="col">
                                                                            <div data-mdb-input-init class="form-outline">
                                                                                <input type="text" id="form7Example3" class="form-control" required />
                                                                                <label class="form-label" for="form7Example3">Adres 1</label>
                                                                            </div>
                                                                        </div>
                                                                        <div class="col">
                                                                            <div data-mdb-input-init class="form-outline">
                                                                                <input type="text" id="form7Example4" class="form-control" required />
                                                                                <label class="form-label" for="form7Example4">Adres 2</label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div data-mdb-input-init class="form-outline mb-4">
                                                                        <input type="text" id="form7Example5" class="form-control" required />
                                                                        <label class="form-label" for="form7Example5">postcode</label>
                                                                    </div>
                                                                    
                                                                        <div>
                                                                            <div class="form-outline mb-4">
                                                                                <select id="form7Example5" class="form-select" required>
                                                                                    <option value="" selected disabled>Kies je bank</option>
                                                                                    <option value="bank1">ING</option>
                                                                                    <option value="bank2">ABN AMRO</option>
                                                                                    <option value="bank3">RABO BANK</option>
                                                                                    <option value="bank4">REGIO BANK</option>
                                                                                    <option value="bank5">ASN BANK</option>
                                                                                    <option value="bank6">bunq</option>
                                                                                    <option value="bank7">SNS</option>
                                                                                   
                                                                                </select>
                                                                            </div>
                                                                        </div>

                                                                    <?php 
                                                                        if (!isset($_SESSION['email'])) {
                                                                        echo '<!-- Email input -->
                                                                            <div data-mdb-input-init class="form-outline mb-4">
                                                                            <input type="email" id="form7Example6" class="form-control" required />
                                                                            <label class="form-label" for="form7Example6">Email</label>
                                                                            </div>';
                                                                        } ?>

                                                                    <div data-mdb-input-init class="form-outline mb-4">
                                                                        <input type="number" id="form7Example7" class="form-control" />
                                                                        <label class="form-label" for="form7Example7">Telefoonnummer</label>
                                                                    </div>
                                                                    <div class="form-check d-flex justify-content-center mb-2">
                                                                        <input class="form-check-input me-2" type="checkbox" value="" id="form7Example8" required />
                                                                        <label class="form-check-label" for="form7Example8">Ik ga akkoord met de algemene voorwaarden</label>
                                                                    </div>
                                                                    <button type="submit" class="btn btn-success">Afrekenen</button>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <tbody>

                                                        <?php
                                                        $totaal = 0;
                                                        $b = 0;
                                                        // als producten naar de winkelwagen worden gestuurd, wordt alles netjes met bootstrap in de winkelwagen gezet
                                                        if (isset($_SESSION["producten"])) {

                                                            foreach ($_SESSION["producten"] as $wagen_item) {
                                                                $product_naam = $wagen_item["product_naam"];
                                                                $product_aantal = min(max($wagen_item["product_aantal"], 1), 10);
                                                                $product_prijs = $wagen_item["product_prijs"];
                                                                $product_code = $wagen_item["product_code"];
                                                                $subtotaal = ($product_prijs * $product_aantal);
                                                                $totaal = ($totaal + $subtotaal);
                                                            }
                                                        }
                                                        ?>
                                            </table>
                                            <input type="hidden" name="url_terug" value="<?php
                                                                                            $url = urlencode($url = "http://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']);
                                                                                            echo $url; ?>" />
                                        </form>
                                    </div>
                                </div>
                                <!-- prijs sectie -->
                                <div class="col-md-5 offset-md-6.5" style="margin-top: 140px;">
                                    <div class="card mb-3">
                                        <div class="card-header text-center">
                                            <h5>Overzicht</h5>
                                        </div>
                                        <div class="card-body">
                                            <ul class="list-group list-group-flush">
                                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                                    Subtotaal
                                                    <span>€<?php echo $totaal; ?></span>
                                                </li>
                                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                                    Verzendkosten
                                                    <span>€5.00</span>
                                                </li>
                                                <li class="list-group-item d-flex justify-content-between align-items-center">
                                                    totaal
                                                    <span>€<?php echo $totaal + 5; ?></span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <?php
    include("includes/footer.php");
    ?>
</body>

</html>