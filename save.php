<?php

header('Content-Type: application/json');
session_start();
if(empty($_SESSION['sid'])) $_SESSION['sid'] = bin2hex(random_bytes(16));
$sid  = $_SESSION['sid'];
$body = json_decode(file_get_contents('php://input'), true) ?? [];

try {
    $db = new PDO('sqlite:'._DIR_.'/../data/cv.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $db->exec("CREATE TABLE IF NOT EXISTS cvs (sid TEXT PRIMARY KEY, name TEXT, data TEXT, updated_at DATETIME DEFAULT CURRENT_TIMESTAMP)");
} catch(Exception $e) {
    echo json_encode(['success'=>false,'message'=>$e->getMessage()]); exit;
}

switch($_GET['action']??'') {
    case 'save':
        $name = htmlspecialchars($body['name']??'Mon CV');
        $data = json_encode($body);
        $stmt = $db->prepare("INSERT OR REPLACE INTO cvs(sid,name,data,updated_at) VALUES(?,?,?,CURRENT_TIMESTAMP)");
        $stmt->execute([$sid, $name, $data]);
        echo json_encode(['success'=>true,'message'=>'CV sauvegardé']);
        break;

    case 'load':
        $stmt = $db->prepare("SELECT * FROM cvs WHERE sid=?");
        $stmt->execute([$sid]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if($row) { $row['data']=json_decode($row['data'],true); echo json_encode(['success'=>true,'cv'=>$row]); }
        else echo json_encode(['success'=>false]);
        break;

    case 'validate_email':
        echo json_encode(['valid'=>(bool)filter_var($body['email']??'',FILTER_VALIDATE_EMAIL)]);
        break;

    case 'validate_phone':
        $p = preg_replace('/[\s\-]/','',$body['phone']??'');
        echo json_encode(['valid'=>(bool)preg_match('/^(\+221)?(7[05678]\d{7}|3[03]\d{7})$/',$p)]);
        break;

    default:
        echo json_encode(['success'=>false,'message'=>'Action inconnue']);
}
?>