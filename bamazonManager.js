var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    managerOptions();
})

function managerOptions() {
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: ["View Products for Sale", 
            "View Low Inventory", 
            "Add to Inventory", 
            "Add New Products"]
        }
    ])
        .then(function (answers) {
            switch (answers.action) {
                case "View Products for Sale":
                    return viewProducts();

                case "View Low Inventory":
                    return lowInventory();

                case "Add to Inventory":
                    return addInventory();

                case "Add New Products":
                    return newProducts();
            }
        })
}

function viewProducts() {
    let query = "SELECT * FROM products";

    connection.query(query, function (err, res) {
        if (err) throw err;

        for (let i = 0; i < res.length; i++) {
            console.log(`\nID: ${res[i].item_id}\n`, 
            `Name: ${res[i].product_name}\n`, 
            `Department: ${res[i].department_name}\n`, 
            `Price: $${res[i].price}\n`, 
            `Stock: ${res[i].stock_quantity}`);
        }
        connection.end();
    })
}

function lowInventory() {
    let query = "SELECT * FROM products";

    connection.query(query, function (err, res) {
        if (err) throw err;

        for (let i = 0; i < res.length; i++) {
            if (res[i].stock_quantity < 5) {
                console.log(`\nID: ${res[i].item_id}\n`, 
                `Name: ${res[i].product_name}\n`, 
                `Department: ${res[i].department_name}\n`, 
                `Price: $${res[i].price}\n`, 
                `Stock: ${res[i].stock_quantity}`);
            }
        }
        connection.end();
    })
}

function addInventory() {
    let query = "SELECT * FROM products";

    connection.query(query, function (err, res) {
        if (err) throw err;

        for (let i = 0; i < res.length; i++) {
            console.log(`\nID: ${res[i].item_id}\n`, `Name: ${res[i].product_name}`);
        }
        console.log(`\n-------------------`);
        orderForm(res);
    })

    function orderForm(res) {
        inquirer.prompt([
            {
                name: "item",
                type: "input",
                message: "Which product would you like to add more of? (Insert ID)",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true
                    }
                    return false
                }
            },
            {
                name: "amount",
                type: "input",
                message: "How many more would you like to add?"
            }
        ])
            .then(function (answers) {
                console.log(`\n-------------------`);
                let stock = parseInt(res[parseInt(answers.item) - 1].stock_quantity) + parseInt(answers.amount);
                let query = `UPDATE products SET stock_quantity = ${stock} WHERE item_id = ${answers.item}`;

                connection.query(query, function (err, res) {
                    if (err) throw err;

                    console.log("Stock has been successfully added!");
                    connection.end();
                })
            })
    }
}

function newProducts() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "Name of new product: "
        },
        {
            name: "department",
            type: "input",
            message: "Department Name: "
        },
        {
            name: "price",
            type: "input",
            message: "Set the price: "
        },
        {
            name: "amount",
            type: "input",
            message: "How much stock: "
        },
        {
            name: "boolean",
            type: "confirm",
            message: "Are you sure everything is correct?"
        }
    ])
    .then(function(answers) {
        var query = 
        `INSERT INTO products (product_name, department_name, price, stock_quantity) 
        VALUES ('${answers.name}', '${answers.department}', ${answers.price}, ${answers.amount});`;

        connection.query(query, function(err, res) {
            if (err) throw err;

            console.log("You have successfully added the product!");
        })
        connection.end();
    })
}