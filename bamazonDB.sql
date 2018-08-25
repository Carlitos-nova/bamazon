DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS departments;

CREATE TABLE products (
    item_id INT NOT NULL auto_increment,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100),
    price DECIMAL(10,2),
    stock_quantity INTEGER(100) DEFAULT 0,
    product_sales INTEGER(100) DEFAULT 0,
    PRIMARY KEY (item_id)
);

CREATE TABLE departments (
    department_id INT NOT NULL auto_increment,
    department_name VARCHAR(100) NOT NULL,
    over_head_costs DECIMAL(65, 2) NOT NULL,
    PRIMARY KEY (department_id)
);