var mysql = require('mysql');
var inquirer = require('inquirer');
var ctable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    supervisorChoice();
});

function supervisorChoice() {
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "Select an Action",
            choices: ["View Product Sales by Department", "Create New Department"]
        }
    ])
        .then(function (answers) {
            switch (answers.action) {
                case "View Product Sales by Department":
                    return productSales();

                case "Create New Department":
                    return newDepartment();
            }
        })
}

function productSales() {
    var query = 
    "SELECT department_id, department_name, over_head_costs, SUM(product_sales) AS product_sales, SUM(product_sales) - over_head_costs AS total_profit FROM departments INNER JOIN products USING (department_name) GROUP BY department_name";

    connection.query(query, function (err, res) {
        if (err) throw err;

        let table = [];

        for (let i = 0; i < res.length; i++) {
            let group = {
                "Department ID": res[i].department_id,
                "Department Name": res[i].department_name,
                "Overhead Costs": res[i].over_head_costs,
                "Product Sales": res[i].product_sales,
                "Total Profit": res[i].total_profit
            }
            table.push(group);
        }
        console.table(table);
        connection.end();
    })
}

function newDepartment() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "What is the name of the new department?"
        },
        {
            name: "cost",
            type: "input",
            message: "What is the overhead cost?"
        }
    ])
        .then(function (answers) {
            let query = `INSERT INTO departments (department_name, over_head_costs) VALUES ("${answers.name}", ${answers.cost});`

            connection.query(query, function (err, res) {
                if (err) throw err;
            });

            console.log("Department has been added!");
            connection.end();
        })
}