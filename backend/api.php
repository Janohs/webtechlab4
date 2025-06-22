<?php
require_once './config.php';

// Set CORS headers to allow Vue.js frontend
header("Access-Control-Allow-Origin: http://localhost:8080");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit(0);
}

// Set content type to JSON
header('Content-Type: application/json');

$action = isset($_GET['action']) ? $_GET['action'] : '';
switch ($action) {
    // User endpoints
    case 'getUsers':
        getUsers();
        break;
    case 'getUserById':
        getUserById();
        break;
    case 'createUser':
        createUser();
        break;
    case 'updateUser':
        updateUser();
        break;
    case 'patchUser':
        patchUser();
        break;
    case 'deleteUser':
        deleteUser();
        break;
    case 'login':
        loginUser();
        break;
    case 'register':
        registerUser();
        break;
    
    // Product endpoints
    case 'getProducts':
        getProducts();
        break;
    case 'getProductById':
        getProductById();
        break;
    case 'createProduct':
        createProduct();
        break;
    case 'updateProduct':
        updateProduct();
        break;
    case 'patchProduct':
        patchProduct();
        break;
    case 'deleteProduct':
        deleteProduct();
        break;
    
    // Order endpoints
    case 'getOrders':
        getOrders();
        break;
    case 'getOrderById':
        getOrderById();
        break;
    case 'createOrder':
        createOrder();
        break;
    case 'updateOrder':
        updateOrder();
        break;
    case 'patchOrder':
        patchOrder();
        break;
    case 'deleteOrder':
        deleteOrder();
        break;
        
    default:
        echo json_encode(["error" => "Invalid action"]);
        break;
}

function getUsers(){
    try {
        $db = new db();
        $conn = $db->connect();
        $sql = "SELECT * FROM users";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $conn = null; // Close the connection
        echo json_encode($result);
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}

function getUserById(){
    try {
        $db = new db();
        $conn = $db->connect();
        $id = $_GET['id'];
        $sql = "SELECT * FROM users WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':id', $id);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user) {
            echo json_encode($user);
        } else {
            echo json_encode(["error" => "User not found"]);
        }
        $conn = null; // Close the connection
    } catch (PDOException $e) {
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
}

function createUser()
{
    try {
        $db = new db();
        $conn = $db->connect();
        // Get JSON data from the request body
        $json_data = file_get_contents('php://input');
        // Decode JSON data into associative array
        $data = json_decode($json_data, true);
        // Check if required fields are present
        if (!isset($data['name']) || !isset($data['email'])) {
            throw new Exception("Name and email are required.");
        }
        $name = $data['name'];
        $email = $data['email'];
        $password = isset($data['password']) ? password_hash($data['password'], PASSWORD_DEFAULT) : null;
        $role = isset($data['role']) ? $data['role'] : 'user';
        
        // Generate ID if not provided
        $id = isset($data['id']) ? $data['id'] : (string)time();
        
        $sql = "INSERT INTO users (id, name, email, password, role) VALUES (:id, :name, :email, :password, :role)";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':id', $id);
        $stmt->bindValue(':name', $name);
        $stmt->bindValue(':email', $email);
        $stmt->bindValue(':password', $password);
        $stmt->bindValue(':role', $role);
        $stmt->execute();
        echo json_encode(["message" => "User created successfully", "id" => $id]);
        $conn = null; // Close the connection
    } catch (Exception $e) {
        echo json_encode(["error" => "Error creating user: " . $e->getMessage()]);
    }
}

function updateUser(){
    try {
        $db = new db();
        $conn = $db->connect();
        // Get JSON data from the request body
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);
        
        // Get user ID from URL parameter
        if (!isset($_GET['id'])) {
            throw new Exception("User ID is required.");
        }
        $id = $_GET['id'];
        
        // Check if required fields are present
        if (!isset($data['name']) || !isset($data['email'])) {
            throw new Exception("Name and email are required.");
        }
        
        $name = $data['name'];
        $email = $data['email'];
        
        $sql = "UPDATE users SET name = :name, email = :email WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':name', $name);
        $stmt->bindValue(':email', $email);
        $stmt->bindValue(':id', $id);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(["message" => "User updated successfully"]);
        } else {
            echo json_encode(["error" => "User not found or no changes made"]);
        }
        
        $conn = null; // Close the connection
    } catch (Exception $e) {
        echo json_encode(["error" => "Error updating user: " . $e->getMessage()]);
    }
}

function patchUser(){
    try {
        $db = new db();
        $conn = $db->connect();
        // Get JSON data from the request body
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);
        
        // Get user ID from URL parameter
        if (!isset($_GET['id'])) {
            throw new Exception("User ID is required.");
        }
        $id = $_GET['id'];
        
        // Build dynamic update query based on provided fields
        $updateFields = [];
        $params = [':id' => $id];
        
        if (isset($data['name'])) {
            $updateFields[] = "name = :name";
            $params[':name'] = $data['name'];
        }
        
        if (isset($data['email'])) {
            $updateFields[] = "email = :email";
            $params[':email'] = $data['email'];
        }
        
        if (empty($updateFields)) {
            throw new Exception("No fields to update.");
        }
        
        $sql = "UPDATE users SET " . implode(', ', $updateFields) . " WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(["message" => "User updated successfully"]);
        } else {
            echo json_encode(["error" => "User not found or no changes made"]);
        }
        
        $conn = null; // Close the connection
    } catch (Exception $e) {
        echo json_encode(["error" => "Error updating user: " . $e->getMessage()]);
    }
}

function deleteUser(){
    try {
        $db = new db();
        $conn = $db->connect();
        
        // Get user ID from URL parameter
        if (!isset($_GET['id'])) {
            throw new Exception("User ID is required.");
        }
        $id = $_GET['id'];
        
        $sql = "DELETE FROM users WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':id', $id);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(["message" => "User deleted successfully"]);
        } else {
            echo json_encode(["error" => "User not found"]);
        }
        
        $conn = null; // Close the connection
    } catch (Exception $e) {
        echo json_encode(["error" => "Error deleting user: " . $e->getMessage()]);
    }
}

function loginUser(){
    try {
        $db = new db();
        $conn = $db->connect();
        // Get JSON data from the request body
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);
        
        if (!isset($data['email']) || !isset($data['password'])) {
            throw new Exception("Email and password are required.");
        }
        
        $email = $data['email'];
        $password = $data['password'];
        
        $sql = "SELECT * FROM users WHERE email = :email";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':email', $email);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && ($user['password'] === null || password_verify($password, $user['password']))) {
            // Remove password from response
            unset($user['password']);
            echo json_encode([
                "success" => true, 
                "user" => $user,
                "token" => "fake-jwt-token-" . time()
            ]);
        } else {
            echo json_encode(["error" => "Invalid credentials"]);
        }
        
        $conn = null;
    } catch (Exception $e) {
        echo json_encode(["error" => "Login error: " . $e->getMessage()]);
    }
}

function registerUser(){
    try {
        $db = new db();
        $conn = $db->connect();
        
        // Get JSON data from the request body
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);
        
        // Check if required fields are present
        if (!isset($data['name']) || !isset($data['email']) || !isset($data['password'])) {
            throw new Exception("Name, email and password are required.");
        }
        
        // Check if email already exists
        $checkSql = "SELECT id FROM users WHERE email = :email";
        $checkStmt = $conn->prepare($checkSql);
        $checkStmt->bindValue(':email', $data['email']);
        $checkStmt->execute();
        
        if ($checkStmt->fetch()) {
            throw new Exception("Email already exists");
        }
        
        $name = $data['name'];
        $email = $data['email'];
        $password = password_hash($data['password'], PASSWORD_DEFAULT);
        $role = isset($data['role']) ? $data['role'] : 'user';
        $id = (string)time();
        
        $sql = "INSERT INTO users (id, name, email, password, role) VALUES (:id, :name, :email, :password, :role)";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':id', $id);
        $stmt->bindValue(':name', $name);
        $stmt->bindValue(':email', $email);
        $stmt->bindValue(':password', $password);
        $stmt->bindValue(':role', $role);
        $stmt->execute();
        
        $newUser = [
            "id" => $id,
            "name" => $name,
            "email" => $email,
            "role" => $role
        ];
        
        echo json_encode([
            "success" => true,
            "user" => $newUser,
            "token" => "fake-jwt-token-" . time()
        ]);
        
        $conn = null;
    } catch (Exception $e) {
        echo json_encode(["error" => "Registration error: " . $e->getMessage()]);
    }
}

// PRODUCT FUNCTIONS
function getProducts(){
    try {
        $db = new db();
        $conn = $db->connect();
        $sql = "SELECT * FROM products";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $conn = null;
        echo json_encode($result);
    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function getProductById(){
    try {
        $db = new db();
        $conn = $db->connect();
        $id = $_GET['id'];
        $sql = "SELECT * FROM products WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':id', $id);
        $stmt->execute();
        $product = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($product) {
            echo json_encode($product);
        } else {
            echo json_encode(["error" => "Product not found"]);
        }
        $conn = null;
    } catch (PDOException $e) {
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
}

function createProduct(){
    try {
        $db = new db();
        $conn = $db->connect();
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);
        
        if (!isset($data['name']) || !isset($data['price'])) {
            throw new Exception("Name and price are required.");
        }
        
        $id = isset($data['id']) ? $data['id'] : (string)time();
        $name = $data['name'];
        $price = $data['price'];
        $description = isset($data['description']) ? $data['description'] : '';
        $category = isset($data['category']) ? $data['category'] : '';
        $stock = isset($data['stock']) ? $data['stock'] : 0;
        
        $sql = "INSERT INTO products (id, name, price, description, category, stock) VALUES (:id, :name, :price, :description, :category, :stock)";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':id', $id);
        $stmt->bindValue(':name', $name);
        $stmt->bindValue(':price', $price);
        $stmt->bindValue(':description', $description);
        $stmt->bindValue(':category', $category);
        $stmt->bindValue(':stock', $stock);
        $stmt->execute();
        echo json_encode(["message" => "Product created successfully", "id" => $id]);
        $conn = null;
    } catch (Exception $e) {
        echo json_encode(["error" => "Error creating product: " . $e->getMessage()]);
    }
}

function updateProduct(){
    try {
        $db = new db();
        $conn = $db->connect();
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);
        
        if (!isset($_GET['id'])) {
            throw new Exception("Product ID is required.");
        }
        $id = $_GET['id'];
        
        if (!isset($data['name']) || !isset($data['price'])) {
            throw new Exception("Name and price are required.");
        }
        
        $name = $data['name'];
        $price = $data['price'];
        $description = isset($data['description']) ? $data['description'] : '';
        $category = isset($data['category']) ? $data['category'] : '';
        $stock = isset($data['stock']) ? $data['stock'] : 0;
        
        $sql = "UPDATE products SET name = :name, price = :price, description = :description, category = :category, stock = :stock WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':name', $name);
        $stmt->bindValue(':price', $price);
        $stmt->bindValue(':description', $description);
        $stmt->bindValue(':category', $category);
        $stmt->bindValue(':stock', $stock);
        $stmt->bindValue(':id', $id);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(["message" => "Product updated successfully"]);
        } else {
            echo json_encode(["error" => "Product not found or no changes made"]);
        }
        
        $conn = null;
    } catch (Exception $e) {
        echo json_encode(["error" => "Error updating product: " . $e->getMessage()]);
    }
}

function patchProduct(){
    try {
        $db = new db();
        $conn = $db->connect();
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);
        
        if (!isset($_GET['id'])) {
            throw new Exception("Product ID is required.");
        }
        $id = $_GET['id'];
        
        $updateFields = [];
        $params = [':id' => $id];
        
        if (isset($data['name'])) {
            $updateFields[] = "name = :name";
            $params[':name'] = $data['name'];
        }
        if (isset($data['price'])) {
            $updateFields[] = "price = :price";
            $params[':price'] = $data['price'];
        }
        if (isset($data['description'])) {
            $updateFields[] = "description = :description";
            $params[':description'] = $data['description'];
        }
        if (isset($data['category'])) {
            $updateFields[] = "category = :category";
            $params[':category'] = $data['category'];
        }
        if (isset($data['stock'])) {
            $updateFields[] = "stock = :stock";
            $params[':stock'] = $data['stock'];
        }
        
        if (empty($updateFields)) {
            throw new Exception("No fields to update.");
        }
        
        $sql = "UPDATE products SET " . implode(', ', $updateFields) . " WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(["message" => "Product updated successfully"]);
        } else {
            echo json_encode(["error" => "Product not found or no changes made"]);
        }
        
        $conn = null;
    } catch (Exception $e) {
        echo json_encode(["error" => "Error updating product: " . $e->getMessage()]);
    }
}

function deleteProduct(){
    try {
        $db = new db();
        $conn = $db->connect();
        
        if (!isset($_GET['id'])) {
            throw new Exception("Product ID is required.");
        }
        $id = $_GET['id'];
        
        $sql = "DELETE FROM products WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':id', $id);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(["message" => "Product deleted successfully"]);
        } else {
            echo json_encode(["error" => "Product not found"]);
        }
        
        $conn = null;
    } catch (Exception $e) {
        echo json_encode(["error" => "Error deleting product: " . $e->getMessage()]);
    }
}

// ORDER FUNCTIONS
function getOrders(){
    try {
        $db = new db();
        $conn = $db->connect();
        $sql = "SELECT * FROM orders";
        $stmt = $conn->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $conn = null;
        echo json_encode($result);
    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
}

function getOrderById(){
    try {
        $db = new db();
        $conn = $db->connect();
        $id = $_GET['id'];
        $sql = "SELECT * FROM orders WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':id', $id);
        $stmt->execute();
        $order = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($order) {
            echo json_encode($order);
        } else {
            echo json_encode(["error" => "Order not found"]);
        }
        $conn = null;
    } catch (PDOException $e) {
        echo json_encode(["error" => "Database error: " . $e->getMessage()]);
    }
}

function createOrder(){
    try {
        $db = new db();
        $conn = $db->connect();
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);
        
        if (!isset($data['customer'])) {
            throw new Exception("Customer is required.");
        }
        
        $id = isset($data['id']) ? $data['id'] : (string)time();
        $productId = isset($data['productId']) ? $data['productId'] : null;
        $quantity = isset($data['quantity']) ? $data['quantity'] : 1;
        $customer = $data['customer'];
        $status = isset($data['status']) ? $data['status'] : 'pending';
        $total_amount = isset($data['total_amount']) ? $data['total_amount'] : 0;
        
        $sql = "INSERT INTO orders (id, productId, quantity, customer, status, total_amount) VALUES (:id, :productId, :quantity, :customer, :status, :total_amount)";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':id', $id);
        $stmt->bindValue(':productId', $productId);
        $stmt->bindValue(':quantity', $quantity);
        $stmt->bindValue(':customer', $customer);
        $stmt->bindValue(':status', $status);
        $stmt->bindValue(':total_amount', $total_amount);
        $stmt->execute();
        echo json_encode(["message" => "Order created successfully", "id" => $id]);
        $conn = null;
    } catch (Exception $e) {
        echo json_encode(["error" => "Error creating order: " . $e->getMessage()]);
    }
}

function updateOrder(){
    try {
        $db = new db();
        $conn = $db->connect();
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);
        
        if (!isset($_GET['id'])) {
            throw new Exception("Order ID is required.");
        }
        $id = $_GET['id'];
        
        if (!isset($data['customer'])) {
            throw new Exception("Customer is required.");
        }
        
        $productId = isset($data['productId']) ? $data['productId'] : null;
        $quantity = isset($data['quantity']) ? $data['quantity'] : 1;
        $customer = $data['customer'];
        $status = isset($data['status']) ? $data['status'] : 'pending';
        $total_amount = isset($data['total_amount']) ? $data['total_amount'] : 0;
        
        $sql = "UPDATE orders SET productId = :productId, quantity = :quantity, customer = :customer, status = :status, total_amount = :total_amount WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':productId', $productId);
        $stmt->bindValue(':quantity', $quantity);
        $stmt->bindValue(':customer', $customer);
        $stmt->bindValue(':status', $status);
        $stmt->bindValue(':total_amount', $total_amount);
        $stmt->bindValue(':id', $id);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(["message" => "Order updated successfully"]);
        } else {
            echo json_encode(["error" => "Order not found or no changes made"]);
        }
        
        $conn = null;
    } catch (Exception $e) {
        echo json_encode(["error" => "Error updating order: " . $e->getMessage()]);
    }
}

function patchOrder(){
    try {
        $db = new db();
        $conn = $db->connect();
        $json_data = file_get_contents('php://input');
        $data = json_decode($json_data, true);
        
        if (!isset($_GET['id'])) {
            throw new Exception("Order ID is required.");
        }
        $id = $_GET['id'];
        
        $updateFields = [];
        $params = [':id' => $id];
        
        if (isset($data['productId'])) {
            $updateFields[] = "productId = :productId";
            $params[':productId'] = $data['productId'];
        }
        if (isset($data['quantity'])) {
            $updateFields[] = "quantity = :quantity";
            $params[':quantity'] = $data['quantity'];
        }
        if (isset($data['customer'])) {
            $updateFields[] = "customer = :customer";
            $params[':customer'] = $data['customer'];
        }
        if (isset($data['status'])) {
            $updateFields[] = "status = :status";
            $params[':status'] = $data['status'];
        }
        if (isset($data['total_amount'])) {
            $updateFields[] = "total_amount = :total_amount";
            $params[':total_amount'] = $data['total_amount'];
        }
        
        if (empty($updateFields)) {
            throw new Exception("No fields to update.");
        }
        
        $sql = "UPDATE orders SET " . implode(', ', $updateFields) . " WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->execute($params);
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(["message" => "Order updated successfully"]);
        } else {
            echo json_encode(["error" => "Order not found or no changes made"]);
        }
        
        $conn = null;
    } catch (Exception $e) {
        echo json_encode(["error" => "Error updating order: " . $e->getMessage()]);
    }
}

function deleteOrder(){
    try {
        $db = new db();
        $conn = $db->connect();
        
        if (!isset($_GET['id'])) {
            throw new Exception("Order ID is required.");
        }
        $id = $_GET['id'];
        
        $sql = "DELETE FROM orders WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $stmt->bindValue(':id', $id);
        $stmt->execute();
        
        if ($stmt->rowCount() > 0) {
            echo json_encode(["message" => "Order deleted successfully"]);
        } else {
            echo json_encode(["error" => "Order not found"]);
        }
        
        $conn = null;
    } catch (Exception $e) {
        echo json_encode(["error" => "Error deleting order: " . $e->getMessage()]);
    }
}
?>
