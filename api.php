<?php
header('Access-Control-Allow-Origin: *');
$parametrosPermitidos = array(
    'method',
    'text',
    'author',
    'lastId'
);


switch($_SERVER['REQUEST_METHOD']){
    case 'GET':
        $params = $_GET;
        $data = get($params);
        result(200, $data);
        break;
}


function get($params) : ?array
{
    global $parametrosPermitidos;
    foreach($params as $key => $value){
        if(!in_array($key, $parametrosPermitidos)){
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
    $connection = new mysqli("hectorrdez.es", "u774699806_logadmin", "", "u774699806_scoutLog");
    if(isset($params['method']) && $params['method'] == 'newMsg'){
        $insert = $connection->prepare("INSERT INTO `msg`(`author`,`text`) VALUES(?, ?)");
        $insert->bind_param("ss", $params['author'], $params['text']);
        $insert->execute();
        $connection->close();
        return array(
            'result' => 'ok',
            'details' => 'new message from '. $params['author']. 'added'
        );
    }else if(isset($params['method']) && $params['method'] == 'lastMsg'){
        $query = $connection->prepare("SELECT author, text FROM msg WHERE id > ?");
        $id = (int)$params['lastId'];
        $query->bind_param('i', $id);
        $query->execute();
        $result = $query->get_result();
        $salida = array();
        if($result->num_rows)
            while($row = $result->fetch_assoc())
                $salida []= array(
                    'author' => $row['author'],
                    'text' => $row['text']
                );
        $connection->close();
        return array(
            'result' => 'ok',
            'details' => $salida
        );
    }else{
        $connection->close();
        return array(
            'result' => 'ok',
            'details' => 'void'
        );
    }
}


function result(int $code, $response)
{
    header('Content/type: application/json');
    http_response_code($code);
    echo json_encode($response, JSON_PRETTY_PRINT);
}

?>
