<?php
// proxy.php
header('Access-Control-Allow-Origin: *'); // À remplacer par votre domaine en production
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Gotify-Key');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Répondre aux pré-requêtes CORS
    http_response_code(200);
    exit();
}

// Vérifier que la requête est en POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Méthode non autorisée']);
    exit();
}

// Récupérer les données du corps de la requête
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    http_response_code(400);
    echo json_encode(['error' => 'Données JSON invalides']);
    exit();
}

// Configuration Gotify
$gotify_url = "https://ntfy.elianova.com/message";
$token = "AfPyZwIcWYtk8iC"; // Clé secrète fournie par l'utilisateur

// Préparer les données pour Gotify
$post_fields = [
    "title" => $input['title'] ?? 'Notification Climatiseur.pro',
    "message" => $input['message'] ?? 'Aucun message',
    "priority" => $input['priority'] ?? 5
];

// Envoyer à Gotify
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $gotify_url);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $post_fields);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["X-Gotify-Key: $token"]);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curl_error = curl_error($ch);

curl_close($ch);

if ($curl_error) {
    http_response_code(500);
    echo json_encode(['error' => 'Erreur cURL: ' . $curl_error]);
} else {
    http_response_code($http_code);
    echo json_encode([
        'success' => $http_code === 200,
        'gotify_response' => $response,
        'http_code' => $http_code
    ]);
}
?>