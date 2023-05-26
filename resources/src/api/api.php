<?php
header('Access-Control-Allow-Origin: *');
$parametrosPermitidos = array(
    'method',
    'text',
    'author',
    'lastId',
    'time'
);


switch ($_SERVER['REQUEST_METHOD']) {
    case 'GET':
        $params = $_GET;
        $data = get($params);
        result(200, $data);
        break;
}


function get($params): ?array
{
    global $parametrosPermitidos;
    foreach ($params as $key => $value) {
        if (!in_array($key, $parametrosPermitidos)) {
            unset($params[$key]);
            $response = array(
                'result' => 'error',
                'details' => 'Not using good params'
            );
            result(400, $response);
            exit;
        }
    }
    $result = getDB($params);
    return $result;
}

function getDB(array $params)
{
    $host = 'localhost';
    $dbname = 'scoutchat';
    $user = 'root';
    $password = '';

    $dsn = "mysql:host=$host;dbname=$dbname";

    $options = [
        PDO::ATTR_PERSISTENT => true,
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ];

    try {
        $connection = new PDO($dsn, $user, $password, $options);
    } catch (PDOException $e) {
        die('Falló la conexión: ' . $e->getMessage());
    }
    if (isset($params['method']) && $params['method'] == 'newMsg') {
        $insert = $connection->prepare("INSERT INTO `msg`(`author`,`text`, `time`) VALUES(:author, :text, :time)");
        $insert->execute(['author' => $params['author'], 'text' => $params['text'], 'time' => $params['time']]);
        return array(
            'result' => 'ok',
            'details' => 'new message from ' . $params['author'] . ' added'
        );
    } else if (isset($params['method']) && $params['method'] == 'lastMsg') {
        $query = $connection->prepare('SELECT * FROM msg WHERE id > :message');
        $id = (int)$params['lastId'];
        $query->execute(['message' => $id]);
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        $salida = array();
        foreach ($result as $row)
            $salida[] = array(
                'author' => $row['author'],
                'text' => $row['text'],
                'time' => $row['time']
            );
        return array(
            'result' => 'ok',
            'details' => $salida
        );
    } else {
        return array(
            'result' => 'ok',
            'details' => 'void'
        );
    }
}


function result(int $code, $response)
{
    header('Content-Type: application/json');
    http_response_code($code);
    echo json_encode($response, JSON_PRETTY_PRINT);
}
