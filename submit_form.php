<?php
// submit_form.php

// 1. Database Configuration
// Update these values with your actual cPanel MySQL database credentials
$host = 'localhost'; // Usually 'localhost' on cPanel
$dbname = 'purplepo_inquiries'; // Replace with your database name
$username = 'purplepo_admin'; // Replace with your database username
$password = '(w#KMX8e]bc@64$7'; // Replace with your database password

// Admin email address for notifications
$admin_email = 'info@purplepoetpromotions.com';

// 2. Establish PDO Connection
try {
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    $pdo = new PDO($dsn, $username, $password, $options);
} catch (PDOException $e) {
    // Determine context (artist or venue) for redirection
    $form_type = $_POST['form_type'] ?? 'unknown';
    $anchor = ($form_type === 'venue_inquiry') ? '#venue-form' : '#artist-form';
    header("Location: index.html$anchor?status=error&message=Database connection failed");
    exit;
}

// 3. Helper Function to Sanitize Input
function sanitize_input($data) {
    if ($data === null) return '';
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// 4. Handle POST Request
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Check which form was submitted (requires a hidden input field 'form_type' in the HTML forms)
    $form_type = $_POST['form_type'] ?? '';
    
    if ($form_type === 'artist_inquiry') {
        // --- Process Artist Inquiry ---
        
        $name = sanitize_input($_POST['name'] ?? '');
        $talent_type = sanitize_input($_POST['talent_type'] ?? '');
        $email = sanitize_input($_POST['email'] ?? '');
        $phone = sanitize_input($_POST['phone'] ?? '');
        $epk_links = sanitize_input($_POST['epk_links'] ?? '');
        $message = sanitize_input($_POST['message'] ?? '');
        
        // Basic validation
        if (empty($name) || empty($talent_type) || empty($email) || empty($epk_links)) {
            header("Location: index.html#artist-form?status=error&message=Please fill in all required fields.");
            exit;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            header("Location: index.html#artist-form?status=error&message=Invalid email format.");
            exit;
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
            
            mail($admin_email, $subject, $email_body, $headers);
            
            // Redirect back to HTML page with success
            header("Location: index.html#artist-form?status=success");
            exit;
            
        } catch (PDOException $e) {
            header("Location: index.html#artist-form?status=error&message=Database error occurred.");
            exit;
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
        
        // Basic validation
        if (empty($name) || empty($email) || empty($event_details)) {
            header("Location: index.html#venue-form?status=error&message=Please fill in all required fields.");
            exit;
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            header("Location: index.html#venue-form?status=error&message=Invalid email format.");
            exit;
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
            
            mail($admin_email, $subject, $email_body, $headers);
            
            // Redirect back to HTML page with success
            header("Location: index.html#venue-form?status=success");
            exit;
            
        } catch (PDOException $e) {
            header("Location: index.html#venue-form?status=error&message=Database error occurred.");
            exit;
        }
        
    } else {
        // Unknown form type
        header("Location: index.html?status=error&message=Invalid form submission.");
        exit;
    }
} else {
    // Not a POST request
    header("Location: index.html");
    exit;
}
?>