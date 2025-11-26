<?php
class User {
    private $conn;
    private $table_name = "usuario";

    public $id;
    public $nome;
    public $email;
    public $senha;
    public $foto;
    public $tipo_usuario;
    public $ativo;
    public $data_criacao;
    public $data_atualizacao;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function findByEmail() {
        $query = "SELECT 
                    id, nome, email, senha, foto, tipo_usuario, ativo
                  FROM " . $this->table_name . " 
                  WHERE email = :email AND ativo = 1 
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":email", $this->email);
        $stmt->execute();

        return $stmt;
    }

    public function findById() {
        $query = "SELECT 
                    id, nome, email, foto, tipo_usuario, ativo, data_criacao
                  FROM " . $this->table_name . " 
                  WHERE id = :id AND ativo = 1 
                  LIMIT 1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id);
        $stmt->execute();

        return $stmt;
    }

    public function updateLastLogin() {
        $query = "UPDATE " . $this->table_name . " 
                  SET data_atualizacao = CURRENT_TIMESTAMP 
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(":id", $this->id);
        
        return $stmt->execute();
    }
}
?>