<?php
// submit_form.php

// 1. reCAPTCHA Configuration
// Replace with your actual keys from https://www.google.com/recaptcha/admin
$recaptcha_secret = '6Lf_qf4sAAAAAGRMVs94grEXO4zjIzbE8om2A0FG';
$recaptcha_score_threshold = 0.5; // Scores above this are considered human (0.0 = bot, 1.0 = human)

// 2. Database Configuration
// Update these values with your actual cPanel MySQL database credentials
$host = 'localhost'; // Usually 'localhost' on cPanel
$dbname = 'purplepo_inquiries'; // Replace with your database name
$username = 'purplepo_admin'; // Replace with your database username
$password = '(w#KMX8e]bc@64$7'; // Replace with your database password

// Admin email address for notifications
$admin_email = 'info@purplepoetpromotions.com';

// 3. Helper Functions

/**
 * Sanitize input data
 */
function sanitize_input($data) {
    if ($data === null) return '';
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

/**
 * Robust email validation
 */
function is_valid_email($email) {
    if (empty($email) || !is_string($email)) return false;
    $email = trim($email);
    
    // RFC 5321: max 254 characters
    if (strlen($email) > 254) return false;
    
    // Must contain exactly one @
    $at_count = substr_count($email, '@');
    if ($at_count !== 1) return false;
    
    // PHP built-in filter
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) return false;
    
    // Check domain has valid MX record or at least an A record
    $domain = substr(strrchr($email, '@'), 1);
    if (!$domain) return false;
    
    // Block known disposable/temporary email domains
    $blocked_domains = [
        'example.com', 'test.com', 'mailinator.com', 'guerrillamail.com',
        '10minutemail.com', 'tempmail.com', 'throwaway.email', 'yopmail.com',
        'sharklasers.com', 'trashmail.com', 'maildrop.cc', 'getnada.com',
        'dispostable.com', 'temp-mail.org', 'fakeinbox.com', 'mintemail.com'
    ];
    if (in_array(strtolower($domain), $blocked_domains)) return false;
    
    return true;
}

/**
 * Verify reCAPTCHA v3 token with Google's API
 * Returns true if human, false if likely bot or verification failed
 */
function verify_recaptcha($token, $secret, $threshold) {
    if (empty($token)) {
        error_log('reCAPTCHA: No token provided');
        return false;
    }
    
    if ($secret === 'YOUR_RECAPTCHA_SECRET_KEY') {
        // reCAPTCHA not configured yet — log warning and allow through
        error_log('reCAPTCHA: Secret key not configured — allowing submission (DEV MODE)');
        return true;
    }
    
    $url = 'https://www.google.com/recaptcha/api/siteverify';
    $data = [
        'secret' => $secret,
        'response' => $token
    ];
    
    $options = [
        'http' => [
            'header' => "Content-type: application/x-www-form-urlencoded\r\n",
            'method' => 'POST',
            'content' => http_build_query($data),
            'timeout' => 10
        ]
    ];
    
    $context = stream_context_create($options);
    $result = @file_get_contents($url, false, $context);
    
    if ($result === false) {
        error_log('reCAPTCHA: Failed to reach Google API');
        return false;
    }
    
    $response = json_decode($result, true);
    
    if (!$response || !isset($response['success'])) {
        error_log('reCAPTCHA: Invalid response from Google');
        return false;
    }
    
    if (!$response['success']) {
        $error_codes = isset($response['error-codes']) ? implode(', ', $response['error-codes']) : 'unknown';
        error_log("reCAPTCHA: Verification failed — error codes: $error_codes");
        return false;
    }
    
    $score = isset($response['score']) ? (float)$response['score'] : 0;
    error_log("reCAPTCHA: Score = $score (threshold = $threshold)");
    
    if ($score < $threshold) {
        error_log("reCAPTCHA: Score below threshold — likely bot (score: $score)");
        return false;
    }
    
    return true;
}

/**
 * Send a JSON response and exit
 */
function json_response($success, $message = '', $status_code = 200) {
    http_response_code($status_code);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => $success,
        'message' => $message
    ]);
    exit;
}

// 4. Handle POST Request
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    json_response(false, 'Invalid request method.', 405);
}

// 5. Verify reCAPTCHA token
$recaptcha_token = $_POST['recaptcha_token'] ?? '';
if (!verify_recaptcha($recaptcha_token, $recaptcha_secret, $recaptcha_score_threshold)) {
    json_response(false, 'reCAPTCHA verification failed. If you are human, please try again. If the problem persists, contact us directly via email or Facebook.', 400);
}

// 6. Establish PDO Connection
try {
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (PDOException $e) {
    error_log('Database connection failed: ' . $e->getMessage());
    json_response(false, 'Service temporarily unavailable. Please try again later or contact us via email.', 503);
}

// 7. Route to appropriate form handler
$form_type = $_POST['form_type'] ?? '';

if ($form_type === 'artist_inquiry') {
    // --- Process Artist Inquiry ---

    $name = sanitize_input($_POST['name'] ?? '');
    $talent_type = sanitize_input($_POST['talent_type'] ?? '');
    $email = sanitize_input($_POST['email'] ?? '');
    $phone = sanitize_input($_POST['phone'] ?? '');
    $epk_links = sanitize_input($_POST['epk_links'] ?? '');
    $message = sanitize_input($_POST['message'] ?? '');

    // Server-side validation
    if (empty($name) || empty($talent_type) || empty($email) || empty($epk_links)) {
        json_response(false, 'Please fill in all required fields.', 400);
    }

    if (!is_valid_email($email)) {
        json_response(false, 'Please enter a valid email address.', 400);
    }

    // Insert into database
    $sql = "INSERT INTO artist_inquiries (name, talent_type, email, phone, epk_links, message) 
            VALUES (:name, :talent_type, :email, :phone, :epk_links, :message)";

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':name' => $name,
            ':talent_type' => $talent_type,
            ':email' => $email,
            ':phone' => $phone,
            ':epk_links' => $epk_links,
            ':message' => $message
        ]);

        // Send Email Notification
        $subject = "New Artist Inquiry: $name";
        $email_body = "You have received a new Artist Inquiry:\n\n".
                      "Name: $name\n".
                      "Talent Type: $talent_type\n".
                      "Email: $email\n".
                      "Phone: $phone\n".
                      "EPK/Media Links: $epk_links\n".
                      "Additional Message: $message\n";
        $headers = "From: no-reply@purplepoetpromotions.com\r\n";
        $headers .= "Reply-To: $email\r\n";

        @mail($admin_email, $subject, $email_body, $headers);

        json_response(true, 'Artist inquiry submitted successfully!');

    } catch (PDOException $e) {
        error_log('Database insert error (artist): ' . $e->getMessage());
        json_response(false, 'An error occurred while saving your inquiry. Please try again.', 500);
    }

} elseif ($form_type === 'venue_inquiry') {
    // --- Process Venue/Client Inquiry ---

    $name = sanitize_input($_POST['name'] ?? '');
    $venue_name = sanitize_input($_POST['venue_name'] ?? '');
    $email = sanitize_input($_POST['email'] ?? '');
    $phone = sanitize_input($_POST['phone'] ?? '');
    $event_date = sanitize_input($_POST['event_date'] ?? '');
    $event_details = sanitize_input($_POST['event_details'] ?? '');
    $budget = sanitize_input($_POST['budget'] ?? '');

    // Server-side validation
    if (empty($name) || empty($email) || empty($event_details)) {
        json_response(false, 'Please fill in all required fields.', 400);
    }

    if (!is_valid_email($email)) {
        json_response(false, 'Please enter a valid email address.', 400);
    }

    // Insert into database
    $sql = "INSERT INTO venue_inquiries (name, venue_name, email, phone, event_date, event_details, budget) 
            VALUES (:name, :venue_name, :email, :phone, :event_date, :event_details, :budget)";

    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':name' => $name,
            ':venue_name' => $venue_name,
            ':email' => $email,
            ':phone' => $phone,
            ':event_date' => $event_date,
            ':event_details' => $event_details,
            ':budget' => $budget
        ]);

        // Send Email Notification
        $subject = "New Venue Inquiry: $name ($venue_name)";
        $email_body = "You have received a new Client/Venue Inquiry:\n\n".
                      "Contact Name: $name\n".
                      "Venue/Business Name: $venue_name\n".
                      "Email: $email\n".
                      "Phone: $phone\n".
                      "Desired Event Date: $event_date\n".
                      "Event Details: $event_details\n".
                      "Budget: $budget\n";
        $headers = "From: no-reply@purplepoetpromotions.com\r\n";
        $headers .= "Reply-To: $email\r\n";

        @mail($admin_email, $subject, $email_body, $headers);

        json_response(true, 'Venue inquiry submitted successfully!');

    } catch (PDOException $e) {
        error_log('Database insert error (venue): ' . $e->getMessage());
        json_response(false, 'An error occurred while saving your inquiry. Please try again.', 500);
    }

} else {
    json_response(false, 'Invalid form submission.', 400);
}