
/*
CRUD    HTTP        SQL
Create  POST        INSERT
Read    GET         SELECT
Update  PUT/PATCH   UPDATE
Delete  DELETE      DELETE
*/
//ORM Object Relational Mapper
class ORMBASE {
    constructor(tableName, fieldList, database) {
        this.tableName = tableName;
        this.fieldList = fieldList;
        this.database = database;
    }
    getFields() {
        return this.fieldList.map(f => `\`${f}\``).join(",")
    }
    getValues(dataObject) {
        const values = this.fieldList.map(f => dataObject[f]);
        return values.map(v => `'${v}'`).join(",");
    }
    create(dataObject) {
        //add the id
        const sql = `INSERT INTO \`${this.tableName}\`(${this.getFields()})
        VALUES(${this.getValues(dataObject)});`;
        console.log(sql);
        //TODO execute sql against database
        return dataObject;
    }
    getWhere(filterObject) {
        const keys = Object.keys(filterObject);
        if (keys.length === 0) {
            return "";
        }
        const output = [];
        for (const prop in filterObject) {
            output.push(`\`${prop}\` = '${filterObject[prop]}'`);
        }
        return "WHERE " + output.join(",");
    }
    read(filterObject = {}) { //as WHERE{
        const sql = `SELECT * FROM \`${this.tableName}\`
        ${this.getWhere(filterObject)};`;
        console.log(sql);
        return sql;
        // const data = [];
        // return data
    }
    getKeyValuePairs(dataObject) {
        const keys = Object.keys(dataObject);
        if (keys.length === 0) {
            return "";
        }
        const output = [];
        for (const prop in dataObject) {
            output.push(`\`${prop}\` = '${dataObject[prop]}'`);
        }
        return output.join(",");
    }
    update(dataObject, id, idField = "id") { //must include an id
        const sql = `UPDATE \`${this.tableName}\`
        SET ${this.getKeyValuePairs(dataObject)}
        WHERE \`${idField}\` = '${id}';`;
        console.log(sql);
        return dataObject
    }
    delete(id, idField = "id") { //USE TRUNCATE TO EMPTY A TABLE, or DROP TO REOVE A TABLE
        const sql = `DELETE FROM ${this.tableName}
        WHERE \`${idField}\` = '${id}';`;
        console.log(sql);
        return id;
    }
}


const actor = new ORMBASE("actor", ["first_name", "last_name"]);
const fromPost = { first_name: "Kevin", last_name: "Long" };

actor.create(fromPost);
const sql = actor.read({ first_name: "Kevin" }); //demo using db connection to run sql
actor.update({ first_name: "Ernest" }, 201, "actor_id");
actor.delete(201, "actor_id");

// var mysql = require('mysql');

// var con = mysql.createConnection({ //SETUP
//     host: "localhost",
//     port: 3306, //default
//     database: "sakila",
//     user: "root",
//     password: "S!mpl312" //NEEDS ENCRYPTION?
// });

// con.connect(function (err) { //APPLY
//     if (err) throw err;
//     console.log("Connected!");
//     con.query(sql, function (err, result) { //execute/run
//         if (err) throw err;
//         console.log("Result: " + result);
//     });
// });
